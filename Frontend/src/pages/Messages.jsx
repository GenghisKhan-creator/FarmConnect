import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Send, Search, MessageCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Messages() {
  const { user } = useAuth();
  const { messages, sendMessage, markMessagesAsRead, socket } = useData();
  const location = useLocation();
  const [activeConvId, setActiveConvId] = useState(null);
  const [input, setInput] = useState('');
  const [searchConv, setSearchConv] = useState('');
  const [presenceMap, setPresenceMap] = useState({});
  const messagesEndRef = useRef(null);

  // Compute conversations dynamically
  const conversations = useMemo(() => {
    if (!user) return [];
    const convMap = new Map();

    messages.forEach(m => {
      const convId = m.conversationId;
      if (!convMap.has(convId)) {
        const otherUser = m.senderId === user.id ? m.receiver : m.sender;
        const fallbackName = m.senderId === user.id ? 'Unknown' : 'Unknown';
        
        convMap.set(convId, {
          id: convId,
          otherId: m.senderId === user.id ? m.receiverId : m.senderId,
          otherName: otherUser ? otherUser.name : fallbackName,
          otherRole: otherUser?.role || (otherUser?.farmName ? 'farmer' : 'buyer'),
          otherFarmName: otherUser?.farmName || '',
          lastMessage: m.message,
          time: m.timestamp,
          unread: !m.read && m.receiverId === user.id ? 1 : 0
        });
      } else {
        const conv = convMap.get(convId);
        conv.lastMessage = m.message;
        conv.time = m.timestamp;
        if (!m.read && m.receiverId === user.id) conv.unread += 1;
      }
    });

    const state = location.state;
    if (state?.newConvUserId && state.newConvUserId !== user.id) {
      const ids = [String(user.id), String(state.newConvUserId)].sort();
      const newConvId = ids.join('_');
      if (!convMap.has(newConvId)) {
        convMap.set(newConvId, {
          id: newConvId,
          otherId: state.newConvUserId,
          otherName: state.newConvUserName,
          otherFarmName: state.newConvFarmName || '',
          lastMessage: 'Say Hi! 👋',
          time: new Date().toISOString(),
          unread: 0
        });
      }
    }

    return Array.from(convMap.values()).sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [messages, user, location.state]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth > 768 && conversations.length > 0 && !activeConvId) {
      const state = location.state;
      if (state?.newConvUserId) {
        const ids = [String(user?.id), String(state.newConvUserId)].sort();
        setActiveConvId(ids.join('_'));
      } else {
        setActiveConvId(conversations[0]?.id);
      }
    } else if (location.state?.newConvUserId && user && !activeConvId) {
      const ids = [String(user.id), String(location.state.newConvUserId)].sort();
      setActiveConvId(ids.join('_'));
    }
  }, [conversations, activeConvId, location.state, user]);

  const activeConv = conversations.find(c => c.id === activeConvId) || null;
  const convMessages = messages.filter(m => m.conversationId === activeConv?.id);

  const suggestedMessages = user?.role === 'farmer' 
    ? ["Yes, it's still available.", "What quantity do you need?", "Let's discuss the price.", "I can arrange delivery."]
    : ["Hi, is this still available?", "Can we negotiate the price?", "Where is the farm located?", "Do you offer delivery?"];

  useEffect(() => {
    if (!activeConv || !user || !markMessagesAsRead) return;
    const unreadIds = convMessages
      .filter(m => m.receiverId === user.id && !m.read && m.id)
      .map(m => m.id);
      
    if (unreadIds.length > 0) {
      markMessagesAsRead(unreadIds, activeConv.otherId);
    }
  }, [activeConv, user, convMessages, markMessagesAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages]);

  useEffect(() => {
    if (!socket || !user) return;

    // Fetch initial statuses
    const queryIds = Array.from(new Set(conversations.map(c => c.otherId)));
    if (queryIds.length > 0) {
      socket.emit('check_status', queryIds, (data) => {
        setPresenceMap(prev => ({ ...prev, ...data }));
      });
    }

    const handleUserStatus = ({ userId, isOnline, lastSeen }) => {
      setPresenceMap(prev => ({
        ...prev,
        [userId]: { ...prev[userId], isOnline, lastSeen: lastSeen || prev[userId]?.lastSeen }
      }));
    };

    const handleTypingStatus = ({ senderId, isTyping }) => {
      setPresenceMap(prev => ({
        ...prev,
        [senderId]: { ...prev[senderId], isTyping }
      }));
    };

    socket.on('user_status', handleUserStatus);
    socket.on('typing_status', handleTypingStatus);

    return () => {
      socket.off('user_status', handleUserStatus);
      socket.off('typing_status', handleTypingStatus);
    };
  }, [socket, user, conversations.length]); // depend on length so it doesn't fire constantly but does when new people appear

  useEffect(() => {
    if (socket && activeConv) {
      socket.emit('typing', { receiverId: activeConv.otherId, isTyping: !!input.trim() });
    }
  }, [input, socket, activeConv]);

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
      receiverId: activeConv.otherId,
      senderId: user.id, // For optimistic UI
      message: textToSend.trim(),
    });
    if (typeof msgText !== 'string') {
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const getOtherInitials = (conv) => conv.otherName && conv.otherName !== 'Unknown' ? conv.otherName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U';

  const filteredConvs = conversations.filter(c =>
    c.otherName.toLowerCase().includes(searchConv.toLowerCase())
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
              onClick={() => setActiveConvId(conv.id)}
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
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.otherName}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', flexShrink: 0, marginLeft: 4 }}>{formatTime(conv.time)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {presenceMap[conv.otherId]?.isTyping ? (
                      <span style={{ color: 'var(--green-600)', fontStyle: 'italic', fontWeight: 500 }}>typing...</span>
                    ) : (
                      conv.lastMessage.length > 30 ? conv.lastMessage.slice(0, 30) + '...' : conv.lastMessage
                    )}
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
            <button className="chat-back-btn" onClick={() => setActiveConvId(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', marginLeft: '-0.5rem', color: 'var(--slate-600)' }}>
              <ArrowLeft size={20} />
            </button>
            <Link 
              to={(activeConv.otherRole === 'farmer' || activeConv.otherFarmName) ? `/farmer/${activeConv.otherId}` : '#'} 
              style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none', color: 'inherit', cursor: (activeConv.otherRole === 'farmer' || activeConv.otherFarmName) ? 'pointer' : 'default' }}
            >
              <div className="avatar" style={{ width: 40, height: 40, fontSize: '0.875rem' }}>
                {getOtherInitials(activeConv)}
              </div>
              <div>
                <div 
                  style={{ fontWeight: 700, textDecoration: (activeConv.otherRole === 'farmer' || activeConv.otherFarmName) ? 'underline' : 'none' }}
                  onMouseEnter={e => { if(activeConv.otherRole === 'farmer' || activeConv.otherFarmName) e.target.style.color='var(--green-600)'}} 
                  onMouseLeave={e => e.target.style.color='inherit'}
                >
                  {activeConv.otherName}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                {presenceMap[activeConv.otherId]?.isTyping ? (
                  <span style={{ color: 'var(--green-600)', fontStyle: 'italic', fontWeight: 500 }}>typing...</span>
                ) : presenceMap[activeConv.otherId]?.isOnline ? (
                  <span style={{ color: 'var(--green-600)', fontWeight: 500 }}>online</span>
                ) : presenceMap[activeConv.otherId]?.lastSeen ? (
                  <span>last seen {new Date(presenceMap[activeConv.otherId].lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                ) : (
                  <span>{activeConv.otherFarmName || 'Customer'}</span>
                )}
              </div>
            </div>
          </Link>
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
                  <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', marginLeft: isMine ? 0 : 4, display: 'flex', gap: 4, alignItems: 'center' }}>
                    {formatTime(msg.timestamp)}
                    {isMine && (
                      <span style={{ color: msg.read ? 'var(--green-600)' : 'inherit', fontWeight: msg.read ? 600 : 'normal' }}>
                        {msg.read ? '✔✔ Read' : '✔ Delivered'}
                      </span>
                    )}
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
