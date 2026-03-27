'use client';

import { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { fetchApi } from '@/lib/api';

type Message = { role: 'user' | 'assistant'; content: string };

export function AiChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hallo! Ich bin der Dependar AI Copilot. Füge hier SBOMs, Schwachstellenberichte oder Fragen zu deiner Infrastruktur ein.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetchApi('/chat/message', {
        method: 'POST',
        body: JSON.stringify({ message: userMsg }),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Fehler: ${err.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-96 h-full bg-slate-800 border-l border-slate-700 flex flex-col z-40 relative">
      <div className="p-4 border-b border-slate-700 flex items-center gap-2">
        <Bot className="w-5 h-5 text-violet-500" />
        <h2 className="text-sm font-bold text-slate-100">KI-Copilot</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-blue-600' : 'bg-violet-600'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`p-3 rounded-xl max-w-[80%] text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-500/20 text-blue-100 rounded-tr-none border border-blue-500/30' 
                : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-violet-600 shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="p-3 rounded-xl bg-slate-700 text-slate-400 text-sm rounded-tl-none border border-slate-600">
              <span className="animate-pulse">Denkt nach...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-800">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Stelle eine Frage zu deinem Stack..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-10 py-3 text-sm text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-violet-500 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
