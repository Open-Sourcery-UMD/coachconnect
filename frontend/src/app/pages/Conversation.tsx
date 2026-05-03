import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Send } from 'lucide-react';
import { auth } from '../firebase';
import { createConnection, getUserProfile } from '../utils/api';

interface Message {
  id: string; senderId: string; receiverId: string;
  text: string; timestamp: number; read: boolean;
}

export default function Conversation() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const { userName } = location.state || { userName: 'User' };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = auth.currentUser?.uid || '';
  const [isCoach, setIsCoach] = useState(false);
  const [accepted, setAccepted] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
  
    useEffect(() => {
      const websocket = new WebSocket("ws://localhost:8000/ws");
      wsRef.current = websocket;
  
      websocket.onopen = () => console.log("Connected to WebSocket server");
      websocket.onmessage = (event) => {
        const incoming: Message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, incoming]);
      };
      websocket.onclose = () => console.log("Disconnected from WebSocket server");
  
      // Cleanup on unmount
      return () =>  {
       if (websocket.readyState === WebSocket.OPEN) websocket.close();
      }
    }, []);

  useEffect(() => {
    const init = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const profile = await getUserProfile(user.uid);
      if (profile?.role === 'coach') setIsCoach(true);
      // Persist own name so the other party can display it in their Messages list
      if (profile?.name) localStorage.setItem('cc_user_' + user.uid, profile.name);
    };
    init();
  }, []);

  // Persist the conversation partner's name whenever we open a new conversation
  useEffect(() => {
    if (userId && userName) localStorage.setItem('cc_user_' + userId, userName);
  }, [userId, userName]);

  const handleAccept = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const coachProfile = await getUserProfile(user.uid);
    const studentProfile = await getUserProfile(userId!);
    await createConnection({
      coach_id: user.uid,
      student_id: userId,
      coach_name: coachProfile?.name || 'Coach',
      student_name: studentProfile?.name || userName,
      student_email: studentProfile?.email || '',
      sport: coachProfile?.expertise?.[0] || null
    });
    setAccepted(true);
    alert(userName + ' has been added to My Students!');
  };

  useEffect(() => { loadMessages(); markAsRead(); }, [userId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadMessages = () => {
    const all = JSON.parse(localStorage.getItem('cc_messages') || '[]') as Message[];
    const conv = all.filter(m =>
      (m.senderId === currentUserId && m.receiverId === userId) ||
      (m.senderId === userId && m.receiverId === currentUserId)
    ).sort((a, b) => a.timestamp - b.timestamp);
    setMessages(conv);
  };

  const markAsRead = () => {
    const all = JSON.parse(localStorage.getItem('cc_messages') || '[]') as Message[];
    const updated = all.map(m => m.senderId === userId && m.receiverId === currentUserId && !m.read ? { ...m, read: true } : m);
    localStorage.setItem('cc_messages', JSON.stringify(updated));
  };

const handleSend = () => {
  if (!newMessage.trim()) return;
  const msg: Message = { 
    id: Date.now().toString(), senderId: currentUserId, 
    receiverId: userId!, text: newMessage.trim(), 
    timestamp: Date.now(), read: false 
  };
  
  // save locally
  const all = JSON.parse(localStorage.getItem('cc_messages') || '[]') as Message[];
  all.push(msg);
  localStorage.setItem('cc_messages', JSON.stringify(all));
  
  // also send over WebSocket so the other person gets it
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    wsRef.current.send(JSON.stringify(msg)); // ← add this
  }

  setNewMessage('');
}

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const formatDate = (ts: number) => {
    const date = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const showDateDivider = (index: number) => {
    if (index === 0) return true;
    return new Date(messages[index].timestamp).toDateString() !== new Date(messages[index-1].timestamp).toDateString();
  };

  return (
    <div className='h-screen flex flex-col'>
      <div className='px-4 py-4 flex items-center gap-4 shadow-sm' style={{ background: 'linear-gradient(135deg, #E21833, #FF6B35)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <button onClick={() => navigate('/messages', { replace: true })} className='p-2 rounded-full hover:bg-white/20'
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
          <ArrowLeft className='w-6 h-6' />
        </button>
        <div className='w-10 h-10 rounded-full flex items-center justify-center text-white font-black'
          style={{ background: 'rgba(255,255,255,0.3)' }}>
          {userName.charAt(0)}
        </div>
        <div>
          <h2 className='text-lg font-bold text-white'>{userName}</h2>
          {isCoach && (
            <button onClick={handleAccept} disabled={accepted}
              className='text-xs px-3 py-1 rounded-full font-bold'
              style={{ background: accepted ? 'rgba(255,255,255,0.3)' : '#FFD200', color: accepted ? 'white' : '#333', border: 'none', cursor: accepted ? 'default' : 'pointer' }}>
              {accepted ? 'Accepted' : 'Accept Student'}
            </button>
          )}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-3' style={{ background: '#f5f5f5' }}>
        {messages.length === 0 ? (
          <div className='h-full flex items-center justify-center'>
            <p className='text-gray-400'>Send a message to start the conversation!</p>
          </div>
        ) : messages.map((msg, idx) => (
          <div key={msg.id}>
            {showDateDivider(idx) && (
              <div className='flex justify-center my-3'>
                <span className='bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600 font-semibold'>{formatDate(msg.timestamp)}</span>
              </div>
            )}
            <div className={'flex ' + (msg.senderId === currentUserId ? 'justify-end' : 'justify-start')}>
              <div className={'max-w-[70%] rounded-2xl px-4 py-2 ' + (msg.senderId === currentUserId ? 'rounded-br-none text-white' : 'rounded-bl-none text-gray-900 bg-white border border-gray-200')}
                style={{ background: msg.senderId === currentUserId ? '#E21833' : undefined }}>
                <p className='text-sm break-words'>{msg.text}</p>
                <p className={'text-xs mt-1 ' + (msg.senderId === currentUserId ? 'text-red-100' : 'text-gray-400')}>{formatTime(msg.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='p-4 bg-white border-t border-gray-200'>
        <div className='flex items-center gap-3'>
          <input type='text' placeholder='Type a message...' value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={e => { if (e.key === 'Enter') handleSend(); }}
            className='flex-1 rounded-full px-5 py-3 text-sm focus:outline-none'
            style={{ border: '2px solid #e5e7eb', background: '#f9f9f9' }} />
          <button onClick={handleSend} disabled={!newMessage.trim()}
            className='w-12 h-12 rounded-full flex items-center justify-center text-white'
            style={{ background: newMessage.trim() ? '#E21833' : '#ccc', border: 'none', cursor: newMessage.trim() ? 'pointer' : 'not-allowed' }}>
            <Send className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  );
}
