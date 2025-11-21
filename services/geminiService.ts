
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CandidateDocument, ComplianceReport, OsintReport, Job, JobMatchResult } from "../types";

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
    }
  },
  required: ["candidateName", "districtOfOrigin", "isHostCommunity", "certificationsValid", "integrityScore", "riskAssessment", "auditNotes"]
};

// --- OSINT Schema ---
const osintSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    criminalRecordMatch: { type: Type.BOOLEAN, description: "True if name matches simulated criminal databases" },
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
      description: "List of specific simulated criminal records or court cases. If 'criminalRecordMatch' is false, this should be empty."
    },
    digitalFootprintScore: { type: Type.INTEGER, description: "0-100 visibility score online" },
    lifestyleAnalysis: { type: Type.STRING, description: "Deep inference of lifestyle, spending, and associations based on online data." },
    familyBackground: { type: Type.STRING, description: "Inferred family ties or political exposure (PEP)" },
    socialMediaSentiment: { type: Type.STRING, enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"] },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvementTips: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "3-4 actionable tips for the candidate to improve their professional online brand and digital footprint." 
    }
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

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeDocuments = async (documents: CandidateDocument[]): Promise<ComplianceReport> => {
  const ai = getAI();

  const parts = documents.map(doc => ({
    inlineData: {
      mimeType: doc.mimeType,
      data: doc.base64
    }
  }));

  const prompt = `
    You are the Intelligent Compliance Engine for Equatorial Talent Intelligence (ETI), a JV between Salus International and HRBL.
    Your role is to audit candidate documents for the Ugandan market, specifically Oil & Gas, Banking, Telecom, Engineering, and Agriculture.
    
    Analyze the provided documents (National ID, LC1 Letters, Academic Transcripts, Professional Certs, CVs).
    
    First, determine the likely Sector based on the documents.
    
    Perform the following checks based on Sector Regulations:

    1. **Oil & Gas (PAU Standards)**: 
       - Verify "District of Origin" for Host Community status (Hoima, Buliisa, Nwoya). 
       - Check for OPITO / NEBOSH / TUV certifications.

    2. **Banking (Bank of Uganda - BOU)**:
       - Check for 'Fit and Proper' test indicators.
       - Verify CPA / ACCA certifications.
       - Flag any potential fraud indicators in documents (Integrity Check).

    3. **Telecom & Engineering (UCC / ERB)**:
       - Verify Engineers Registration Board (ERB) registration or UIPE membership.
       - Check for telecom-specific technical certs.

    4. **Agriculture (MAAIF)**:
       - Verify agricultural qualifications and experience suitable for commercial farming/processing.

    5. **General**:
       - Cross-reference ID details with other docs for consistency (Integrity Score).
    
    Return the analysis in strict JSON format.
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
        temperature: 0.2,
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

export const generateOsintReport = async (candidateName: string, contextData: string): Promise<OsintReport> => {
  const ai = getAI();

  const prompt = `
    Conduct a DEEP FORENSIC OSINT (Open Source Intelligence) investigation on: ${candidateName}.
    Context extracted from CV/Docs: ${contextData}.

    **PRIMARY OBJECTIVE**: Uncover any compliance risks, criminal history, or reputational liabilities for high-sensitivity roles in Uganda (Oil & Gas, Banking).

    **TASK 1: DEEP CRIMINAL & SANCTIONS CHECK (Simulated)**
    - Check against: Interpol Red Notices, Uganda Police Force Wanted List, Anti-Money Laundering (AML) watchlists, and Global Sanctions.
    - Analyze for: Past court cases, fraud allegations, or disciplinary actions in previous employment.
    - OUTPUT: Provide a detailed paragraph in 'criminalDetails'. If clear, explicitly state "No negative matches found in global or local criminal databases."

    **TASK 2: DIGITAL FOOTPRINT & LIFESTYLE**
    - Analyze social media (LinkedIn, Facebook, X/Twitter) for behavior inconsistent with corporate values.
    - Assess 'Lifestyle' vs 'Reported Income/Role' (e.g., displaying unexplained wealth).
    - Check for radicalization or extremist affiliations.

    **TASK 3: BRAND IMPROVEMENT (For Candidate)**
    - Provide 3-4 highly specific, actionable tips to improve their professional brand (e.g., "Remove party photos from 2019," "Certify skills on LinkedIn").
    
    **SCENARIO**:
    - If the name matches a known high-risk profile OR if the prompt implies a test (simulated), flag it.
    - If flagged, generate 1-2 specific fictional criminal records (Case ID, Offense, Court, Date, Status) to populate 'criminalRecords'.
    - Examples for simulation: 'Uganda Anti-Corruption Court Case 102/2022', 'Fraudulent Procurement', etc.
    - Otherwise, 'criminalRecords' must be empty.
    
    Generate a JSON report.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: osintSchema,
      temperature: 0.4
    }
  });

  if (!response.text) throw new Error("Failed to generate OSINT report");
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
    Act as a Senior Recruitment & Compliance Officer for Salus International / HRBL.
    
    TARGET JOB:
    Title: ${job.title}
    Company: ${job.company}
    Location: ${job.location}
    Description: ${job.description}
    Required Skills: ${job.requiredSkills.join(', ')}

    TASK:
    Analyze the candidate documents to calculate a fit score.
    
    **SCORING ALGORITHM (CRITICAL)**:
    
    1. **EXPERIENCE (40% Weight)**: 
       - Extract total years of relevant experience.
       - IF candidate has LESS experience than implied by job level -> DEDUCT massive points.
       - IF candidate is Junior applying for Senior -> SCORE < 10/40.
       - PROVIDE specific 'experienceAnalysis' (e.g., "Job requires 5 years, Candidate has 2. Severe gap.").

    2. **LOCATION & MOBILITY (30% Weight)**:
       - Check candidate's current residence vs Job Location.
       - IF locations differ AND no 'Relocation' mention in CV -> DEDUCT 20 points.
       - IF candidate is in a different region (e.g., Kampala vs Hoima) -> Flag in 'locationAnalysis'.
       - Local content (Host Community) is a plus for Oil & Gas.

    3. **SKILLS & CERTIFICATIONS (30% Weight)**:
       - Keyword matching for technical skills and mandatory certs (NEBOSH, CPA, etc.).
    
    OUTPUT JSON:
    {
      "overallScore": number,
      "skillsMatchScore": number,
      "experienceAnalysis": "Specific commentary on experience fit.",
      "locationAnalysis": "Specific commentary on location fit.",
      "matchedSkills": string[],
      "missingSkills": string[],
      "reason": "A professional summary explaining the decision, specifically referencing the Experience and Location weightings."
    }
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

export const chatWithAi = async (message: string, history: any[]): Promise<string> => {
    const ai = getAI();
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: [
            {
                role: "user",
                parts: [{ text: "You are the ETI Assistant for Salus International & HRBL. Assist HR with compliance/OSINT and candidates with career branding." }]
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am ready to assist." }]
            },
            ...history
        ]
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm sorry, I couldn't process that.";
};
