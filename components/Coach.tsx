import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { ChatMessage } from '../types';
import { getCoachChat } from '../services/geminiService';

export const Coach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: "Blessings, Warrior! I'm Coach Grace. Ready to steward your temple today? Whether you need prayer, a push, or some praise, I'm here! What's on your heart?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Speech Recognition Setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript); // Auto-send on voice end
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English'));
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.rate = 1.1; // Energetic
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      const chat = getCoachChat();
      const result = await chat.sendMessage(textToSend);
      const responseText = result.response.text();

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, modelMsg]);
      speak(responseText); // Auto-speak response
    } catch (error) {
      console.error("Coach error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "The spirit is willing but the connection is weak! Check your internet, sister.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center gap-3">
         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-royal-purple to-grace-gold flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md">
            CG
         </div>
         <div>
            <h2 className="font-bold text-slate-800">Coach Grace</h2>
            <p className="text-xs text-green-600 flex items-center gap-1">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               Filled with Spirit & Coffee
            </p>
         </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm ${
                msg.role === 'user' 
                  ? 'bg-royal-purple text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isProcessing && (
           <div className="flex justify-start">
             <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 rounded-bl-none flex gap-2 items-center text-xs font-bold text-royal-purple">
                <Icons.Sparkles size={14} className="animate-spin" />
                Grace is praying on it...
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-100 flex gap-2 items-center">
        <button 
          onClick={toggleListening}
          className={`p-3 rounded-full transition-colors ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isListening ? <Icons.MicOff size={20} /> : <Icons.Mic size={20} />}
        </button>

        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isListening ? "Listening..." : "Speak life..."}
          className="flex-1 bg-slate-100 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-royal-purple/50 outline-none placeholder:text-slate-400"
        />

        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || isProcessing}
          className="p-3 bg-royal-purple text-white rounded-full shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all"
        >
          <Icons.Send size={20} />
        </button>
      </div>
    </div>
  );
};