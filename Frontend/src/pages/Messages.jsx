import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Search, MessageCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

// Mock conversation list
const CONVERSATIONS = [
  { id: 1, farmerId: 1, farmerName: 'Issah Abubakari', farmName: 'Issah Farms', buyerId: 2, buyerName: 'Amina Seidu', lastMessage: 'I can do 340 per bag...', time: '11:45', unread: 1 },
];

export default function Messages() {
  const { user } = useAuth();
  const { messages, sendMessage } = useData();
  const [activeConv, setActiveConv] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth > 768 ? CONVERSATIONS[0] : null
  );
  const [input, setInput] = useState('');
  const [searchConv, setSearchConv] = useState('');
  const messagesEndRef = useRef(null);

  const convMessages = messages.filter(m => m.conversationId === activeConv?.id);

  const suggestedMessages = user?.role === 'farmer' 
    ? ["Yes, it's still available.", "What quantity do you need?", "Let's discuss the price.", "I can arrange delivery."]
    : ["Hi, is this still available?", "Can we negotiate the price?", "Where is the farm located?", "Do you offer delivery?"];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages]);

  if (!user) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <div className="empty-state-icon"><MessageCircle size={28} /></div>
        <h3>Sign in to view messages</h3>
        <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
      </div>
    );
  }

  const handleSend = (msgText) => {
    const textToSend = typeof msgText === 'string' ? msgText : input;
    if (!textToSend.trim() || !activeConv) return;
    sendMessage({
      conversationId: activeConv.id,
      senderId: user.id,
      receiverId: user.role === 'farmer' ? activeConv.buyerId : activeConv.farmerId,
      message: textToSend.trim(),
    });
    if (typeof msgText !== 'string') {
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const getOtherName = (conv) => user.role === 'farmer' ? conv.buyerName : conv.farmerName;
  const getOtherInitials = (conv) => getOtherName(conv).split(' ').map(n => n[0]).join('').slice(0, 2);

  const filteredConvs = CONVERSATIONS.filter(c =>
    getOtherName(c).toLowerCase().includes(searchConv.toLowerCase())
  );

  const formatTime = (ts) => {
    const d = new Date(ts);
    return isNaN(d) ? ts : d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="messages-container" style={{ height: 'calc(100vh - 64px)', display: 'flex', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <div className="messages-sidebar" style={{
        width: 320, flexShrink: 0, background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.875rem' }}>Messages</h2>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input
              value={searchConv}
              onChange={e => setSearchConv(e.target.value)}
              className="form-input"
              placeholder="Search conversations"
              style={{ paddingLeft: '2rem', height: 38, fontSize: '0.875rem' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConvs.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1.25rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>No conversations yet</p>
            </div>
          ) : filteredConvs.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              style={{
                width: '100%', padding: '1rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                background: activeConv?.id === conv.id ? 'var(--green-50)' : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                borderLeft: activeConv?.id === conv.id ? '3px solid var(--green-500)' : '3px solid transparent',
                transition: 'var(--transition)',
              }}
            >
              <div className="avatar" style={{ width: 42, height: 42, fontSize: '0.875rem', flexShrink: 0 }}>
                {getOtherInitials(conv)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getOtherName(conv)}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', flexShrink: 0, marginLeft: 4 }}>{conv.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {conv.lastMessage}
                  </p>
                  {conv.unread > 0 && (
                    <span style={{ minWidth: 18, height: 18, background: 'var(--green-600)', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}>
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {activeConv ? (
        <div className="messages-chat" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{ padding: '1rem 1.5rem', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <button className="chat-back-btn" onClick={() => setActiveConv(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', marginLeft: '-0.5rem', color: 'var(--slate-600)' }}>
              <ArrowLeft size={20} />
            </button>
            <div className="avatar" style={{ width: 40, height: 40, fontSize: '0.875rem' }}>
              {getOtherInitials(activeConv)}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{getOtherName(activeConv)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                {user.role === 'farmer' ? 'Buyer' : activeConv.farmName}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {convMessages.map((msg, i) => {
              const isMine = msg.senderId === user.id;
              return (
                <div key={msg.id || i} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start', gap: 2 }}>
                  <div className={`chat-bubble ${isMine ? 'sent' : 'received'}`}>
                    {msg.message}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', marginLeft: isMine ? 0 : 4 }}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Messages */}
          <div className="hide-scrollbar" style={{ padding: '0.75rem 1.25rem 0', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {suggestedMessages.map((msg, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(msg)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '0.375rem 0.875rem',
                  borderRadius: 999,
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  fontSize: '0.8rem',
                  color: 'var(--slate-600)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-50)'; e.currentTarget.style.color = 'var(--green-700)'; e.currentTarget.style.borderColor = 'var(--green-200)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--slate-600)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                {msg}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem 1.25rem 1.25rem', background: 'var(--surface)', display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send)"
              className="form-input"
              rows={2}
              style={{ flex: 1, resize: 'none', minHeight: 'unset', height: 'auto' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="btn btn-primary btn-icon"
              style={{ height: 44, width: 44, borderRadius: 12, flexShrink: 0 }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state messages-empty" style={{ flex: 1 }}>
          <div className="empty-state-icon"><MessageCircle size={28} /></div>
          <h3>Select a conversation</h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>Choose a conversation from the left panel</p>
        </div>
      )}
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .chat-back-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .messages-sidebar {
            width: 100% !important;
            display: ${activeConv ? 'none' : 'flex'} !important;
            border-right: none !important;
          }
          .messages-chat {
            display: ${activeConv ? 'flex' : 'none'} !important;
            width: 100% !important;
          }
          .messages-empty {
            display: none !important;
          }
          .chat-back-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
