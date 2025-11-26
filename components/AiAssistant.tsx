
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AiAssistant: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t('ai_welcome') }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Re-sync initial message when language changes if it's the only message
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
       setMessages([{ role: 'model', text: t('ai_welcome') }]);
    }
  }, [t]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    const newHistory = [...messages, { role: 'user', text: userMessage } as Message];
    setMessages(newHistory);
    setIsTyping(true);

    try {
      const apiHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await getChatResponse(userMessage, apiHistory);
      
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: t('ai_error') }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const suggestions = [
    t('ai_sugg_price'), 
    t('ai_sugg_reg'), 
    t('ai_sugg_schedule'), 
    t('ai_sugg_history')
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] h-[500px] flex flex-col mb-4 border border-slate-200 animate-fade-in-up overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-school-primary to-blue-900 p-4 flex items-center justify-between text-white">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Bot className="w-6 h-6 text-school-accent" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Habib</h3>
                <p className="text-xs text-blue-200 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/10 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-school-primary text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length < 3 && (
            <div className="px-4 pb-2 bg-slate-50 flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => { setInput(s); setTimeout(handleSend, 100); }}
                  className="text-xs bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('ask_something')} 
                className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-school-primary/20 focus:outline-none text-slate-800"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`p-2.5 rounded-full bg-school-primary text-white transition-all shadow-md ${
                  !input.trim() || isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800 hover:scale-105'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-slate-400">Powered by Gemini AI</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-school-primary text-white rounded-full shadow-lg hover:bg-blue-800 hover:scale-110 transition-all duration-300"
        >
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          <MessageCircle className="w-7 h-7" />
          
          <div className="absolute right-16 bg-white text-slate-800 px-3 py-1.5 rounded-lg shadow-md text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-100">
             {t('chat_with_habib')}
             <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white transform -translate-y-1/2 rotate-45 border-r border-t border-slate-100"></div>
          </div>
        </button>
      )}
    </div>
  );
};
