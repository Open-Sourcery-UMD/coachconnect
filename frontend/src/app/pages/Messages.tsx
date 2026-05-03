import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, MessageCircle } from 'lucide-react';
import { auth } from '../firebase';
import { getUserProfile, getConversationList } from '../utils/api';

interface Conversation {
  partner_id: string; partner_name: string;
  last_message: string; last_timestamp: number; unread: number;
}

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadConversations = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const data = await getConversationList(user.uid);
      if (Array.isArray(data)) setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
    // Poll every 5 seconds for new messages / unread counts
    pollRef.current = setInterval(loadConversations, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const filtered = conversations.filter(c =>
    c.partner_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    const diff = Date.now() - ts;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (days === 1) return 'Yesterday';
    if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleBack = async () => {
    const user = auth.currentUser;
    if (user) {
      const profile = await getUserProfile(user.uid);
      if (profile?.role === 'coach') { navigate('/my-students'); return; }
    }
    navigate('/results');
  };

  return (
    <div className='min-h-screen' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>
      <div className='px-6 py-4 flex items-center justify-between sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
        <button onClick={handleBack} className='flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-gray-800'
          style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft className='w-4 h-4' /> Back
        </button>
        <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Messages</h1>
        <div className='w-20'></div>
      </div>

      <div className='max-w-3xl mx-auto px-4 py-6'>
        <div className='mb-4 relative'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input type='text' placeholder='Search conversations...' value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full pl-12 py-3 rounded-2xl text-gray-800 focus:outline-none'
            style={{ border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.95)' }} />
        </div>

        <div className='rounded-2xl overflow-hidden' style={{ background: 'rgba(255,255,255,0.95)' }}>
          {loading ? (
            <div className='p-12 text-center'>
              <p className='text-gray-400'>Loading messages...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className='p-12 text-center'>
              <MessageCircle className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <h3 className='text-xl font-bold text-gray-900 mb-2'>No Messages Yet</h3>
              <p className='text-gray-500'>{searchQuery ? 'No conversations match your search.' : 'Connect with a coach to start messaging!'}</p>
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {filtered.map(conv => (
                <div key={conv.partner_id}
                  onClick={() => navigate('/conversation/' + conv.partner_id, { state: { userName: conv.partner_name } })}
                  className='p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4'>
                  <div className='w-14 h-14 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xl font-black'
                    style={{ background: 'linear-gradient(135deg, #E21833, #FFD200)' }}>
                    {conv.partner_name.charAt(0)}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-1'>
                      <h3 className='font-bold text-gray-900 truncate'>{conv.partner_name}</h3>
                      <span className='text-xs text-gray-500 flex-shrink-0 ml-2'>{formatTime(conv.last_timestamp)}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <p className={'text-sm truncate ' + (conv.unread > 0 ? 'font-semibold text-gray-900' : 'text-gray-500')}>{conv.last_message}</p>
                      {conv.unread > 0 && (
                        <div className='w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ml-2 flex-shrink-0' style={{ background: '#E21833' }}>
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
