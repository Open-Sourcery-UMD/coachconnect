import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Send } from 'lucide-react';
import { auth } from '../firebase';
import { createConnection, getUserProfile, getConversationHistory, markMessagesRead, WS_URL } from '../utils/api';

interface Message {
  id: string; sender_id: string; receiver_id: string;
  text: string; timestamp: number; read: boolean;
}

export default function Conversation() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const { userName } = location.state || { userName: 'User' };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [wsReady, setWsReady] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const currentUserId = auth.currentUser?.uid || '';

  // Identify role and persist own name
  useEffect(() => {
    const init = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const profile = await getUserProfile(user.uid);
      if (profile?.role === 'coach') setIsCoach(true);
    };
    init();
  }, []);

  // Load history + open WebSocket whenever the conversation partner changes
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !userId) return;

    const uid = user.uid;

    // Fetch message history from DB
    getConversationHistory(uid, userId).then((data: Message[]) => {
      if (Array.isArray(data)) setMessages(data);
    });

    // Mark messages from this partner as read
    markMessagesRead(userId, uid);

    // Open WebSocket
    const socket = new WebSocket(WS_URL + '/messages/ws/' + uid);
    wsRef.current = socket;

    socket.onopen = () => setWsReady(true);

    socket.onmessage = (event) => {
      const msg: Message = JSON.parse(event.data);
      // Only add if relevant to this conversation
      const isOurs =
        (msg.sender_id === uid && msg.receiver_id === userId) ||
        (msg.sender_id === userId && msg.receiver_id === uid);
      if (!isOurs) return;
      setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
      // Mark incoming messages as read immediately
      if (msg.sender_id === userId) markMessagesRead(userId, uid);
    };

    socket.onclose = () => setWsReady(false);
    socket.onerror = () => setWsReady(false);

    return () => {
      socket.close();
      wsRef.current = null;
      setWsReady(false);
    };
  }, [userId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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

  const handleSend = () => {
    const ws = wsRef.current;
    if (!newMessage.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({
      sender_id: currentUserId,
      receiver_id: userId,
      text: newMessage.trim(),
    }));
    setNewMessage('');
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
    return new Date(messages[index].timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();
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
        <div className='flex-1'>
          <h2 className='text-lg font-bold text-white'>{userName}</h2>
          <p className='text-xs text-white/70'>{wsReady ? 'Online' : 'Connecting...'}</p>
        </div>
        {isCoach && (
          <button onClick={handleAccept} disabled={accepted}
            className='text-xs px-3 py-2 rounded-full font-bold'
            style={{ background: accepted ? 'rgba(255,255,255,0.3)' : '#FFD200', color: accepted ? 'white' : '#333', border: 'none', cursor: accepted ? 'default' : 'pointer' }}>
            {accepted ? 'Accepted' : 'Accept Student'}
          </button>
        )}
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
            <div className={'flex ' + (msg.sender_id === currentUserId ? 'justify-end' : 'justify-start')}>
              <div className={'max-w-[70%] rounded-2xl px-4 py-2 ' + (msg.sender_id === currentUserId ? 'rounded-br-none text-white' : 'rounded-bl-none text-gray-900 bg-white border border-gray-200')}
                style={{ background: msg.sender_id === currentUserId ? '#E21833' : undefined }}>
                <p className='text-sm break-words'>{msg.text}</p>
                <p className={'text-xs mt-1 ' + (msg.sender_id === currentUserId ? 'text-red-100' : 'text-gray-400')}>{formatTime(msg.timestamp)}</p>
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
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            className='flex-1 rounded-full px-5 py-3 text-sm focus:outline-none'
            style={{ border: '2px solid #e5e7eb', background: '#f9f9f9' }} />
          <button onClick={handleSend} disabled={!newMessage.trim() || !wsReady}
            className='w-12 h-12 rounded-full flex items-center justify-center text-white'
            style={{ background: newMessage.trim() && wsReady ? '#E21833' : '#ccc', border: 'none', cursor: newMessage.trim() && wsReady ? 'pointer' : 'not-allowed' }}>
            <Send className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  );
}
