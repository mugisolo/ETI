
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CandidateDocument, ComplianceReport, OsintReport, Job, JobMatchResult, SourcingResult } from "../types";

// --- Compliance Schema ---
const complianceSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    candidateName: { type: Type.STRING, description: "Name extracted from ID or documents" },
    districtOfOrigin: { type: Type.STRING, description: "District extracted from National ID or LC1 Letter" },
    isHostCommunity: { type: Type.BOOLEAN, description: "True if district is relevant to the sector's local content (e.g., Hoima for O&G)" },
    certificationsValid: { type: Type.BOOLEAN, description: "True if technical certs (OPITO, NEBOSH, CPA, ERB) look authentic" },
    integrityScore: { type: Type.INTEGER, description: "A score from 0-100 based on document consistency and fraud markers" },
    riskAssessment: {
      type: Type.OBJECT,
      properties: {
        level: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
        reason: { type: Type.STRING }
      },
      required: ["level", "reason"]
    },
    auditNotes: { type: Type.STRING, description: "Detailed summary of the compliance check against sector regulations" },
    missingDocuments: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of required documents that appear to be missing or illegible" 
    },
    identityVerification: {
        type: Type.OBJECT,
        properties: {
            isMatch: { type: Type.BOOLEAN, description: "Do the faces in the ID and the Selfie match?" },
            confidence: { type: Type.INTEGER, description: "0-100 confidence score of the face match." },
            reason: { type: Type.STRING, description: "Explanation of the visual comparison." }
        }
    }
  },
  required: ["candidateName", "districtOfOrigin", "isHostCommunity", "certificationsValid", "integrityScore", "riskAssessment", "auditNotes"]
};

// --- OSINT Schema ---
const osintSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    criminalRecordMatch: { type: Type.BOOLEAN, description: "True if name matches REAL criminal databases or news reports" },
    criminalDetails: { type: Type.STRING, description: "Extensive details of checks against Interpol, Police, and Court records." },
    criminalRecords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
            caseId: { type: Type.STRING },
            offense: { type: Type.STRING },
            date: { type: Type.STRING },
            court: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['Convicted', 'Acquitted', 'Pending', 'Wanted', 'Closed'] }
        }
      },
      description: "List of specific criminal records found. Empty if clean."
    },
    digitalFootprintScore: { type: Type.INTEGER, description: "0-100 visibility score online" },
    lifestyleAnalysis: { type: Type.STRING, description: "Deep inference of lifestyle based on search results." },
    familyBackground: { type: Type.STRING, description: "Inferred family ties or political exposure (PEP)" },
    socialMediaSentiment: { type: Type.STRING, enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"] },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvementTips: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "3-4 actionable tips for the candidate to improve their professional online brand." 
    },
    sources: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of URL links where information was found during the Google Search." }
  }
};

// --- Job Match Schema ---
const jobMatchSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, description: "0-100 overall fit score" },
    skillsMatchScore: { type: Type.INTEGER, description: "0-100 score based strictly on required skills" },
    experienceAnalysis: { type: Type.STRING, description: "Detailed analysis of years of experience vs required. Mention specific gaps." },
    locationAnalysis: { type: Type.STRING, description: "Detailed analysis of candidate location vs job location and willingness to relocate." },
    matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Skills from the job description found in CV" },
    missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Skills required but not found" },
    reason: { type: Type.STRING, description: "Detailed executive summary explaining the score" }
  }
};

// --- Sourcing Schema ---
const sourcingSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    searchString: { type: Type.STRING, description: "The Google X-Ray Boolean search string" },
    explanation: { type: Type.STRING, description: "Why these keywords were chosen" },
    simulatedMatches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          headline: { type: Type.STRING },
          currentRole: { type: Type.STRING },
          matchExplanation: { type: Type.STRING },
          profileUrl: { type: Type.STRING }
        }
      }
    }
  }
};

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeDocuments = async (documents: CandidateDocument[]): Promise<ComplianceReport> => {
  const ai = getAI();

  // Specifically identify the selfie and the ID for comparison
  const parts = documents.map(doc => ({
    inlineData: {
      mimeType: doc.mimeType,
      data: doc.base64
    }
  }));

  const prompt = `
    You are the Intelligent Compliance Engine for Equatorial Talent Intelligence (ETI).
    Your role is to audit candidate documents for the Ugandan market.
    
    **CRITICAL TASK: IDENTITY VERIFICATION**
    Compare the face in the document labeled as 'National ID' (or Passport) with the face in the document labeled as 'Selfie' (a photo of a person holding an ID).
    - If no selfie or ID is found, set 'isMatch' to false.
    - If faces match, set 'isMatch' to true and provide a high confidence score.
    - If they look different, flag it immediately in 'riskAssessment' as CRITICAL.

    **SECTOR ANALYSIS**:
    1. **Oil & Gas (PAU)**: Check for Host Community (Hoima, Buliisa) and NOGTR registration.
    2. **Banking (BOU)**: Integrity check and financial certifications (CPA/ACCA).
    3. **Engineering (ERB)**: Check for ERB registration.
    4. **Agriculture (MAAIF)**: Check for agricultural quals.

    Return the analysis in strict JSON format matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [...parts, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: complianceSchema,
        temperature: 0.1, // Low temp for strict analysis
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ComplianceReport;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const parseProfileText = async (text: string): Promise<ComplianceReport> => {
  const ai = getAI();

  const prompt = `
    Act as a Data Extraction Specialist for ETI.
    Analyze the following text which is pasted from a LinkedIn Profile or Resume:
    """
    ${text.substring(0, 10000)}
    """
    Objective: Structure this into a preliminary Compliance Report.
    Return strict JSON matching the ComplianceReport schema.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [{ text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: complianceSchema,
            temperature: 0.3,
        }
    });

    if (!response.text) throw new Error("Failed to parse text");
    return JSON.parse(response.text) as ComplianceReport;

  } catch (error) {
    console.error("Profile Parse Error:", error);
    throw error;
  }
};

export const generateOsintReport = async (candidateName: string, contextData: string): Promise<OsintReport> => {
  const ai = getAI();

  const prompt = `
    Conduct a REAL-TIME OSINT (Open Source Intelligence) investigation on: ${candidateName} in Uganda.
    Context: ${contextData}.

    Use Google Search to find ACTUAL public information about this person. 
    Look for:
    - LinkedIn profiles
    - News articles (New Vision, Daily Monitor)
    - Court records or Police statements
    - Professional registry listings (ERB, ICPAU)

    **REPORTING**:
    1. **Criminal/Sanctions**: If you find REAL negative news, detail it. If nothing is found in the search results, state "No public adverse media found."
    2. **Digital Footprint**: Summarize their professional online presence based on search results.
    3. **Sources**: You MUST include the URLs of the websites where you found information in the 'sources' array.

    **BRANDING ADVICE**:
    - Provide 3 specific tips to improve their online brand based on what you found (or didn't find).

    Generate a JSON report.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // Using Flash for speed with tools
    contents: { parts: [{ text: prompt }] },
    config: {
      tools: [{ googleSearch: {} }], // Enable Real Google Search
      responseMimeType: "application/json",
      responseSchema: osintSchema,
    }
  });

  if (!response.text) throw new Error("Failed to generate OSINT report");
  
  // Extract grounding metadata if needed, but the model should bake sources into the JSON 'sources' field as requested.
  return JSON.parse(response.text) as OsintReport;
};

export const matchCandidateToJob = async (documents: CandidateDocument[], job: Job): Promise<JobMatchResult> => {
  const ai = getAI();

  const parts = documents.map(doc => ({
    inlineData: {
      mimeType: doc.mimeType,
      data: doc.base64
    }
  }));

  const prompt = `
    Act as a Senior Recruitment Officer.
    TARGET JOB: ${job.title} at ${job.company}, Location: ${job.location}.
    
    Calculate fit score based on:
    1. EXPERIENCE (40%): Years of experience vs required.
    2. LOCATION (30%): Residence vs Job Location.
    3. SKILLS (30%): Keyword match.
    
    Return strict JSON matching JobMatchResult schema.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [...parts, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: jobMatchSchema
    }
  });

  if (!response.text) throw new Error("Analysis failed");
  const result = JSON.parse(response.text);
  
  return {
    jobId: job.id,
    overallScore: result.overallScore,
    skillsMatchScore: result.skillsMatchScore,
    experienceAnalysis: result.experienceAnalysis,
    locationAnalysis: result.locationAnalysis,
    matchedSkills: result.matchedSkills || [],
    missingSkills: result.missingSkills || [],
    reason: result.reason
  };
};

export const generateSourcingStrategies = async (job: Job): Promise<SourcingResult> => {
  const ai = getAI();
  const prompt = `
    Act as an Expert Technical Recruiter.
    Find candidates for: ${job.title}, ${job.location}.
    Generate X-Ray Search String and 3 simulated matches.
    Output JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: sourcingSchema
    }
  });

  if (!response.text) throw new Error("Sourcing failed");
  return JSON.parse(response.text) as SourcingResult;
};

export const chatWithAi = async (message: string, history: any[]): Promise<string> => {
    const ai = getAI();
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm sorry, I couldn't process that.";
};
