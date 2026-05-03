import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';

interface Session {
  id: string; studentName: string; studentId: string;
  sport: string; date: string; time: string; coachId: string;
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => { loadSessions(); }, []);

  const loadSessions = () => {
    const data = JSON.parse(localStorage.getItem('cc_sessions') || '[]');
    const coachId = auth.currentUser?.uid;
    const mySessions = data.filter((s: Session) => s.coachId === coachId)
      .sort((a: Session, b: Session) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
    setSessions(mySessions);
  };

  const handleDelete = (id: string) => {
    const data = JSON.parse(localStorage.getItem('cc_sessions') || '[]');
    const updated = data.filter((s: Session) => s.id !== id);
    localStorage.setItem('cc_sessions', JSON.stringify(updated));
    loadSessions();
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return displayHour + ':' + m + ' ' + ampm;
  };

  const isUpcoming = (dateStr: string) => {
    const sessionDate = new Date(dateStr + 'T23:59:59');
    return sessionDate >= new Date(new Date().toDateString());
  };

  const upcoming = sessions.filter(s => isUpcoming(s.date));
  const past = sessions.filter(s => !isUpcoming(s.date));

  return (
    <div className='min-h-screen flex flex-col' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>
      <div className='px-6 py-4 flex items-center justify-between sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
        <div>
          <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Coach Connect</h1>
          <p className='text-white/70 text-sm'>My Calendar</p>
        </div>
        <button onClick={() => navigate('/my-students')} className='px-4 py-2 rounded-full font-semibold text-sm text-white'
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer' }}>&#8592; Back to Students
        </button>
        <Button onClick={handleLogout} className='bg-[#E21833] hover:bg-red-700 text-white border-0' style={{ cursor: 'pointer' }}>
          <LogOut className='w-4 h-4 mr-2' />Logout
        </Button>
      </div>

      <div className='max-w-4xl mx-auto px-6 py-6 space-y-6'>
        <div>
          <h2 className='text-xl font-black text-white mb-4 flex items-center gap-2'>
            <CalendarIcon className='w-5 h-5' /> Upcoming Sessions ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <div className='rounded-2xl p-8 text-center' style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <CalendarIcon className='w-12 h-12 text-white/40 mx-auto mb-3' />
              <p className='text-white font-semibold'>No upcoming sessions</p>
              <p className='text-white/70 text-sm'>Book a session with a student to see it here!</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {upcoming.map(session => (
                <div key={session.id} className='rounded-2xl p-5 flex items-center gap-4' style={{ background: 'rgba(255,255,255,0.95)' }}>
                  <div className='w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-black flex-shrink-0'
                    style={{ background: 'linear-gradient(135deg, #E21833, #FFD200)' }}>
                    {session.studentName.charAt(0)}
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-bold text-gray-900'>{session.studentName}</h3>
                    <p className='text-sm text-gray-600'>{session.sport}</p>
                    <p className='text-sm font-semibold' style={{ color: '#E21833' }}>{formatDate(session.date)} | {session.time}</p>
                  </div>
                  <button onClick={() => handleDelete(session.id)} className='p-2 rounded-full hover:bg-red-50'
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E21833' }}>
                    <Trash2 className='w-5 h-5' />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {past.length > 0 && (
          <div>
            <h2 className='text-xl font-black text-white mb-4'>Past Sessions ({past.length})</h2>
            <div className='space-y-3'>
              {past.map(session => (
                <div key={session.id} className='rounded-2xl p-5 flex items-center gap-4 opacity-60' style={{ background: 'rgba(255,255,255,0.95)' }}>
                  <div className='w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-black flex-shrink-0'
                    style={{ background: 'linear-gradient(135deg, #999, #ccc)' }}>
                    {session.studentName.charAt(0)}
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-bold text-gray-900'>{session.studentName}</h3>
                    <p className='text-sm text-gray-600'>{session.sport}</p>
                    <p className='text-sm text-gray-500'>{formatDate(session.date)} | {session.time}</p>
                  </div>
                  <button onClick={() => handleDelete(session.id)} className='p-2 rounded-full hover:bg-gray-100'
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                    <Trash2 className='w-5 h-5' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='flex-1'></div>
      <Footer />
    </div>
  );
}
