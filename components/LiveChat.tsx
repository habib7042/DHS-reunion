
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, User, AlertTriangle, ShieldAlert } from 'lucide-react';
import { liveChatService } from '../services/api';

interface ChatMessage {
  _id: string;
  senderName: string;
  sscYear: number;
  message: string;
  timestamp: string;
}

export const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  
  // Join Form State
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check session storage for previous login
    const savedUser = sessionStorage.getItem('dhs_chat_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setName(user.name);
      setBatch(user.batch);
      setHasJoined(true);
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isOpen && hasJoined) {
      // Initial fetch
      fetchMessages();
      // Poll every 3 seconds
      interval = setInterval(fetchMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [isOpen, hasJoined]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const data = await liveChatService.getMessages();
      // Only update if different length to avoid jitter (simple check)
      setMessages(prev => {
        if (prev.length !== data.length) return data;
        return prev; // Assume same if length same (simplification)
      });
    } catch (e) {
      console.error("Chat error", e);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && batch) {
      sessionStorage.setItem('dhs_chat_user', JSON.stringify({ name, batch }));
      setHasJoined(true);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setWarning(null);

    try {
      await liveChatService.sendMessage(name, Number(batch), inputText);
      setInputText('');
      fetchMessages(); // Refresh immediately
    } catch (error: any) {
      setWarning(error.message); // Will show AI moderation warning
      setTimeout(() => setWarning(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans no-print">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[320px] h-[450px] flex flex-col mb-4 border border-slate-200 animate-fade-in-up overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-900 p-3 flex items-center justify-between text-white">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-amber-400" />
              <div>
                <h3 className="font-bold text-sm">Live Alumni Chat</h3>
                <p className="text-[10px] text-slate-400 flex items-center">
                  <ShieldAlert className="w-3 h-3 mr-1" /> AI Moderated
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          {!hasJoined ? (
            <div className="p-6 flex flex-col justify-center h-full bg-slate-50">
              <h4 className="text-center font-bold text-slate-800 mb-4">Join the Conversation</h4>
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500">Your Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-2 border rounded text-sm"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Rahim"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Batch Year</label>
                  <select 
                    required
                    className="w-full p-2 border rounded text-sm bg-white"
                    value={batch}
                    onChange={e => setBatch(e.target.value)}
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 50 }, (_, i) => 2026 - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <button className="w-full bg-school-primary text-white py-2 rounded font-bold text-sm hover:bg-blue-800">
                  Enter Chat
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-3 bg-slate-50 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderName === name;
                  return (
                    <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-2 rounded-xl text-xs shadow-sm ${
                        isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none'
                      }`}>
                        {!isMe && <p className="font-bold text-[10px] text-amber-600 mb-0.5">{msg.senderName} <span className="text-slate-400">({msg.sscYear})</span></p>}
                        <p>{msg.message}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5">
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Warning Toast */}
              {warning && (
                <div className="absolute bottom-16 left-2 right-2 bg-red-100 border border-red-200 text-red-700 p-2 rounded text-xs flex items-start animate-bounce">
                   <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
                   {warning}
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                <input 
                  className="flex-1 bg-slate-100 border-0 rounded-full px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                />
                <button 
                  disabled={isLoading || !inputText.trim()}
                  className={`p-2 bg-school-primary text-white rounded-full ${isLoading ? 'opacity-50' : 'hover:bg-blue-800'}`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800 hover:scale-110 transition-all duration-300 border-2 border-white"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="absolute left-14 bg-slate-900 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
             Live Chat
          </span>
        </button>
      )}
    </div>
  );
};
