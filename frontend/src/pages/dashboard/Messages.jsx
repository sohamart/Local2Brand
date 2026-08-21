import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Send, AlertCircle, Paperclip } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Messages = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects');
        if (res.data?.projects && res.data.projects.length > 0) {
          setProjects(res.data.projects);
          setSelectedProjectId(res.data.projects[0]._id);
        }
      } catch (err) {
        console.error('Error fetching projects', err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch messages when project id shifts
  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      setError('');
      try {
        const res = await API.get(`/messages/${selectedProjectId}`);
        if (res.data?.messages) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        setError('Error loading chat logs.');
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedProjectId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedProjectId) return;

    try {
      const res = await API.post(`/messages/${selectedProjectId}`, { text });
      if (res.data?.success) {
        setMessages(prev => [...prev, res.data.message]);
        setText('');
      }
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col border border-slate-200 dark:border-white/5 bg-white/85 dark:bg-slate-900/40 rounded-[28px] overflow-hidden text-left glass-panel">
      {/* Header bar */}
      <div className="h-16 px-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between flex-wrap gap-4 shrink-0 bg-slate-50 dark:bg-[#0d0e15]/50">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Agency Communications</h3>
        
        {loadingProjects ? (
          <span className="text-[10px] text-slate-500">Loading channels...</span>
        ) : projects.length > 0 ? (
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-350 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-yellow-500 cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-xs text-slate-500">No active projects</span>
        )}
      </div>

      {/* Main chat window split */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-950/5 relative">
        {/* Messages stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loadingMessages ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="flex items-center justify-center h-full gap-2 text-red-400 text-xs">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-xs">
              No chat logs recorded. Drop a message to introduce yourself!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender._id === user.id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                      isMe
                        ? 'bg-yellow-450 text-black font-semibold rounded-tr-none shadow-sm'
                        : 'bg-slate-100 dark:bg-[#0d0e15]/65 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[9px] font-bold text-yellow-600 dark:text-yellow-450 uppercase tracking-wide">
                        {msg.sender.role === 'USER' ? 'Client' : 'Local2Brand Team'}
                      </p>
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-slate-650' : 'text-slate-500'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box form */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0d0e15]/50 flex gap-3 shrink-0">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!selectedProjectId}
            className="flex-grow px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500"
            placeholder={selectedProjectId ? "Write message..." : "Select project channel to chat"}
          />
          <button
            type="submit"
            disabled={!text.trim() || !selectedProjectId}
            className="px-5 py-3 text-xs font-bold liquid-btn disabled:bg-slate-300 disabled:text-slate-500 flex items-center justify-center gap-1.5"
          >
            Send
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
