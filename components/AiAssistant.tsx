import React, { useState, useRef, useEffect } from 'react';
import { chatWithAi } from '../services/geminiService';

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Welcome. I am the ETI Assistant. How may I assist with compliance or intelligence today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      }));
      
      const response = await chatWithAi(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection error. Please retry." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 font-sans">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gold-600 text-white p-4 shadow-2xl hover:bg-gold-700 transition-all flex items-center gap-2 border border-gold-400"
        >
          <span className="font-bold text-xs uppercase tracking-widest hidden sm:block">AI Counsel</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 sm:w-96 flex flex-col border border-stone-300 shadow-2xl h-[500px] transition-all animate-in slide-in-from-bottom-10 fade-in">
          {/* Header */}
          <div className="bg-stone-900 p-4 flex justify-between items-center text-white border-b border-gold-600">
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-gold-500 rounded-full animate-pulse"></div>
                <h3 className="font-serif font-bold text-gold-500 tracking-wide">ETI Intelligence</h3>
             </div>
             <button onClick={() => setIsOpen(false)} className="hover:text-gold-500">✕</button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-ivory-50">
             {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-3 text-sm leading-relaxed border ${msg.role === 'user' ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-800 border-stone-200'}`}>
                      {msg.text}
                   </div>
                </div>
             ))}
             {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white border border-stone-200 p-3 flex gap-1">
                      <div className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce"></div>
                      <div className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce delay-75"></div>
                      <div className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce delay-150"></div>
                   </div>
                </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-stone-200">
             <div className="flex gap-2">
                <input
                   type="text"
                   className="flex-1 border border-stone-300 px-4 py-2 text-sm focus:outline-none focus:border-gold-500 bg-ivory-50"
                   placeholder="Type your query..."
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                   onClick={handleSend}
                   className="bg-gold-600 text-white px-4 py-2 hover:bg-gold-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-widest"
                   disabled={!input.trim()}
                >
                   Send
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};