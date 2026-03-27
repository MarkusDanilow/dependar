'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

type Message = { role: 'user' | 'assistant'; content: string };

export function AiChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hallo! Ich bin der Dependar AI Copilot. Frag mich alles zu deiner Infrastruktur, Schwachstellen oder Projekten.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    let assistantMsg = '';
    const token = typeof window !== 'undefined' ? localStorage.getItem('dependar_token') : null;

    try {
      const response = await fetch(`${API_BASE_URL}/chat/message/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: userMsg, history }),
      });

      if (!response.ok) throw new Error('Streaming failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error('No reader available');

      // Add empty assistant message to be filled
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      setIsTyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              assistantMsg += data.content;
              
              setMessages(prev => {
                const newMessages = [...prev];
                const lastIdx = newMessages.length - 1;
                newMessages[lastIdx] = { ...newMessages[lastIdx], content: assistantMsg };
                return newMessages;
              });
            } catch (e) {
              console.error('Error parsing SSE chunk', e);
            }
          }
        }
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Fehler: ${err.message}` }]);
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
        <div ref={scrollRef} />
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
