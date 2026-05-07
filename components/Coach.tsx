import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icons } from './Icons';
import { ChatMessage } from '../types';
import { sendCoachMessage, resetCoachChat } from '../services/geminiService';

const GREETING = "Blessings, Warrior! 💛 I'm Coach Grace — your faith-fueled fitness partner. Whether you need a spiritual push, workout motivation, a carnivore recipe idea, or just some praise, I'm right here! Tap the mic and talk to me, or type below. What's on your heart today?";

export const Coach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: GREETING,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micError, setMicError] = useState('');
  const [voiceReady, setVoiceReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const hasSpokenGreeting = useRef(false);

  // Load voices and speak greeting on mount
  useEffect(() => {
    resetCoachChat();

    // Voices load async, wait for them
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices();
      if (voices && voices.length > 0) {
        setVoiceReady(true);
        // Auto-speak greeting once voices are available
        if (!hasSpokenGreeting.current) {
          hasSpokenGreeting.current = true;
          setTimeout(() => speak(GREETING), 500);
        }
      }
    };

    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);

    // Setup Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Use handleSendRef to avoid stale closure
        handleSendDirect(transcript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (e: any) => {
        setIsListening(false);
        if (e.error === 'not-allowed') {
          setMicError('Microphone blocked! Allow mic access in your browser settings, or use HTTPS.');
        } else if (e.error === 'no-speech') {
          // Normal - user didn't say anything
        } else {
          setMicError(`Mic error: ${e.error}. Try refreshing the page.`);
        }
      };
    } else {
      setMicError('Speech recognition not available in this browser. Use Chrome for voice features.');
    }

    return () => {
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    // Clean the text — remove emojis and markdown for speech
    const cleanText = text
      .replace(/[💛🔥💪✨🙏❤️😔⚡🏋️‍♀️🥩📖]/g, '')
      .replace(/\*\*/g, '')
      .replace(/[#*_~`]/g, '')
      .trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a warm female voice
    const preferredVoices = [
      'Microsoft Zira',
      'Google US English',
      'Samantha',
      'Karen',
      'Moira',
      'Female',
    ];
    
    let selectedVoice = null;
    for (const pref of preferredVoices) {
      selectedVoice = voices.find(v => v.name.includes(pref));
      if (selectedVoice) break;
    }
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en'));
    }
    
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.15;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    setMicError('');
    
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      // Stop coach from talking when user wants to speak
      stopSpeaking();
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e: any) {
        console.warn("Speech recognition error:", e);
        setMicError('Could not start microphone. Make sure you allowed mic access.');
        setIsListening(false);
      }
    }
  };

  const handleSendDirect = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      const responseText = await sendCoachMessage(text);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, modelMsg]);
      // Auto-speak the response! Voice-first!
      speak(responseText);
    } catch (error: any) {
      console.error("Coach error:", error);
      const errorText = error?.message || 'Connection hiccup';
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `The spirit is willing but something went wrong 😔 ${errorText}. Please try again!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isProcessing) return;
    handleSendDirect(textToSend);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6B21A8] to-[#7C3AED] p-4 flex items-center gap-3 rounded-t-2xl shadow-md -mx-4 -mt-4 px-6">
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white/30 shadow-lg">
            CG
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#6B21A8] ${isSpeaking ? 'bg-amber-400 animate-pulse' : 'bg-green-400 animate-pulse'}`} />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-white text-base">Coach Grace</h2>
          <p className="text-xs text-purple-200/70 flex items-center gap-1">
            <Icons.Sparkles size={10} className="text-amber-300" />
            {isSpeaking ? '🗣️ Speaking...' : 'Filled with Spirit & Coffee'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button 
              onClick={stopSpeaking}
              className="bg-white/20 px-2 py-1.5 rounded-full text-white hover:bg-white/30 transition-all"
              title="Stop speaking"
            >
              <Icons.VolumeX size={14} />
            </button>
          )}
          <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-[10px] text-white/80 font-medium">Voice On</span>
          </div>
        </div>
      </div>

      {/* Mic Error Banner */}
      {micError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 mx-0 flex items-start gap-2">
          <Icons.AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-amber-500" />
          <div>
            <p className="font-medium">{micError}</p>
            <p className="text-amber-600 mt-1">💡 Tip: If on your laptop, try accessing via <strong>https://</strong> or use localhost.</p>
          </div>
          <button onClick={() => setMicError('')} className="ml-auto text-amber-400 hover:text-amber-600">✕</button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 bg-gradient-to-b from-purple-50/50 to-white -mx-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} px-3`}
          >
            {msg.role === 'model' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[10px] font-bold mt-1 mr-2 flex-shrink-0 shadow-sm">
                CG
              </div>
            )}
            <div className="flex flex-col max-w-[78%]">
              <div 
                className={`rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-[#6B21A8] to-[#7C3AED] text-white rounded-br-md' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                <span className={`text-[10px] ${msg.role === 'user' ? 'text-slate-400' : 'text-slate-400 ml-1'}`}>
                  {formatTime(msg.timestamp)}
                </span>
                {msg.role === 'model' && msg.id !== '0' && (
                  <button 
                    onClick={() => speak(msg.text)} 
                    className="text-purple-400 hover:text-purple-600 transition-colors"
                    title="Replay this message"
                  >
                    <Icons.Volume2 size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start px-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[10px] font-bold mt-1 mr-2 flex-shrink-0">
              CG
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-purple-400 font-medium">Grace is praying on it...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice-First Input Area */}
      <div className="bg-white p-3 border-t border-slate-100 -mx-4 px-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)]">
        {/* Big Mic Button */}
        <div className="flex gap-2 items-center">
          <button 
            onClick={toggleListening}
            className={`p-3.5 rounded-full transition-all flex-shrink-0 ${
              isListening 
                ? 'bg-red-500 text-white shadow-lg shadow-red-300 scale-110 animate-pulse' 
                : 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-md shadow-purple-300 hover:shadow-purple-400 hover:scale-105 active:scale-95'
            }`}
          >
            {isListening ? <Icons.MicOff size={20} /> : <Icons.Mic size={20} />}
          </button>

          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "🎙️ I'm listening, speak up warrior!" : "Type or tap the mic to talk..."}
              className="w-full bg-slate-100 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-purple-500/30 outline-none placeholder:text-slate-400 transition-all"
            />
          </div>

          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isProcessing}
            className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-full shadow-md shadow-amber-300/30 hover:shadow-amber-400/40 disabled:opacity-40 disabled:shadow-none transition-all flex-shrink-0 active:scale-95"
          >
            <Icons.Send size={18} />
          </button>
        </div>
        
        {isListening && (
          <div className="text-center mt-2">
            <span className="text-xs text-red-500 font-medium animate-pulse">● Recording — speak now!</span>
          </div>
        )}
      </div>
    </div>
  );
};