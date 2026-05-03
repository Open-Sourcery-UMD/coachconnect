import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { LogOut, Users, Calendar, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getStudents, getCoachConnections, getCoachAppointments, acceptAppointment, declineAppointment } from '../utils/api';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface Student {
  id: string; auth0_id: string; name: string; email: string; phone: string;
  interests: string[]; goals: string; level: string; budget: string;
  preferred_times: string[]; graduation_year: string; role: string;
}

interface Appointment {
  id: string; coach_id: string; student_id: string;
  coach_name: string; student_name: string;
  slot: string; status: 'pending' | 'accepted' | 'declined';
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function WeeklyCalendar({ appointments }: { appointments: Appointment[] }) {
  const getWeekDates = () => {
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    return DAYS.map((_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
  };
  const weekDates = getWeekDates();
  const accepted = appointments.filter(a => a.status === 'accepted');

  return (
    <div className='grid grid-cols-7 gap-1.5'>
      {DAYS.map((day, i) => {
        const date = weekDates[i];
        const isToday = date.toDateString() === new Date().toDateString();
        const dayAppts = accepted.filter(a => a.slot.startsWith(day));
        return (
          <div key={day} className='min-h-28 rounded-xl p-2 flex flex-col'
            style={{ background: isToday ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)', border: isToday ? '2px solid white' : '1px solid rgba(255,255,255,0.2)' }}>
            <div className='text-center mb-2'>
              <p className='text-xs font-bold text-white/70'>{day.slice(0, 3).toUpperCase()}</p>
              <p className={`text-base font-black ${isToday ? 'text-white' : 'text-white/80'}`}>{date.getDate()}</p>
            </div>
            <div className='space-y-1 flex-1'>
              {dayAppts.map(appt => (
                <div key={appt.id} className='rounded-lg p-1.5 text-xs' style={{ background: '#E21833', color: 'white' }}>
                  <p className='font-bold truncate'>{appt.student_name}</p>
                  <p className='text-white/80 truncate'>{appt.slot.replace(day + ' ', '')}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function MyStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'allStudents' | 'myStudents' | 'appointments' | 'calendar'>('allStudents');
  const [myStudents, setMyStudents] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [coachSports, setCoachSports] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchUserName();
    fetchMyStudents();
  }, []);

  useEffect(() => {
    if (activeTab === 'appointments' || activeTab === 'calendar') fetchAppointments();
  }, [activeTab]);

  const fetchMyStudents = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const data = await getCoachConnections(user.uid);
      setMyStudents(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const fetchUserName = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const res = await fetch('http://localhost:8000/users/' + user.uid);
      const data = await res.json();
      if (data.name) setUserName(data.name.split(' ')[0]);
      if (data.expertise) setCoachSports(data.expertise);
      if (data.name) localStorage.setItem('cc_user_' + user.uid, data.name);
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setStudents([]);
    }
    setLoading(false);
  };

  const fetchAppointments = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setAppointmentsLoading(true);
    try {
      const data = await getCoachAppointments(user.uid);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    setAppointmentsLoading(false);
  };

  const handleAccept = async (id: string) => {
    await acceptAppointment(id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'accepted' } : a));
  };

  const handleDecline = async (id: string) => {
    await declineAppointment(id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'declined' } : a));
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };
  const sportMatchedStudents = coachSports.length === 0 ? students : students.filter(s => s.interests.some(i => coachSports.includes(i)));
  const myConnectedStudents = students.filter(s => myStudents.some(c => c.student_id === s.auth0_id));
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const acceptedAppointments = appointments.filter(a => a.status === 'accepted');

  const getLevelBadge = (level: string) => {
    if (level === 'beginner') return { bg: '#E8F5E9', color: '#2E7D32', label: 'Beginner' };
    if (level === 'intermediate') return { bg: '#FFF3E0', color: '#E65100', label: 'Intermediate' };
    if (level === 'advanced') return { bg: '#FCE4EC', color: '#C62828', label: 'Advanced' };
    return { bg: '#F5F5F5', color: '#333', label: level || 'Unknown' };
  };

  const renderStudentCard = (student: Student, showMyBadge = false) => {
    const badge = getLevelBadge(student.level);
    return (
      <div key={student.id} className='rounded-2xl overflow-hidden' style={{ background: 'rgba(255,255,255,0.95)' }}>
        <div className='p-5'>
          <div className='flex gap-3 mb-3'>
            <div className='w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xl font-black'
              style={{ background: 'linear-gradient(135deg, #E21833, #FFD200)' }}>
              {student.name.charAt(0)}
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2'>
                <h3 className='text-base font-bold text-gray-900 truncate'>{student.name}</h3>
                {showMyBadge && <span className='text-xs px-2 py-0.5 rounded-full font-bold' style={{ background: '#E8F5E9', color: '#2E7D32' }}>My Student</span>}
              </div>
              <p className='text-xs text-gray-500'>Class of {student.graduation_year || 'N/A'}</p>
              <span className='px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5 inline-block' style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
            </div>
            <div className='text-right'>
              <p className='text-xs text-gray-400'>budget</p>
              <p className='text-lg font-black text-gray-900'>${student.budget || '0'}<span className='text-xs text-gray-400'>/hr</span></p>
            </div>
          </div>
          {student.goals && <p className='text-xs text-gray-600 mb-3 line-clamp-2 italic'>{student.goals}</p>}
          <div className='flex flex-wrap gap-1 mb-3'>
            {student.interests.map((interest: string) => (
              <span key={interest} className='px-2 py-0.5 rounded-full text-xs font-semibold' style={{ background: '#FFF3F4', color: '#E21833' }}>{interest}</span>
            ))}
          </div>
          <Button className='w-full font-semibold rounded-xl text-sm' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }}
            onClick={() => { localStorage.setItem('cc_user_' + student.auth0_id, student.name); navigate('/conversation/' + student.auth0_id, { state: { userName: student.name } }); }}>
            <MessageCircle className='w-4 h-4 mr-2' />Message
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen flex flex-col' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>
      <div className='px-6 py-4 flex items-center justify-between sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
        <div>
          <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Coach Connect</h1>
          <p className='text-white/70 text-sm'>Welcome Back{userName ? ', ' + userName : ''}</p>
        </div>
        <p className='text-white/80 text-sm font-medium'>
          {loading ? 'Loading...' : (activeTab === 'allStudents' ? sportMatchedStudents.length : activeTab === 'myStudents' ? myConnectedStudents.length : '') + (activeTab === 'allStudents' || activeTab === 'myStudents' ? ' students' : '')}
        </p>
        <Button onClick={() => navigate('/messages')} className='mr-2' style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
          <MessageCircle className='w-4 h-4 mr-2' />Messages
        </Button>
        <Button onClick={handleLogout} className='bg-[#E21833] hover:bg-red-700 text-white border-0' style={{ cursor: 'pointer' }}>
          <LogOut className='w-4 h-4 mr-2' />Logout
        </Button>
      </div>

      <div className='px-6 pt-4 flex gap-3 flex-wrap'>
        <button onClick={() => setActiveTab('allStudents')}
          className='px-6 py-2 rounded-full font-bold text-sm transition-all'
          style={{ background: activeTab === 'allStudents' ? 'white' : 'rgba(255,255,255,0.2)', color: activeTab === 'allStudents' ? '#E21833' : 'white', cursor: 'pointer', border: 'none' }}>
          All Students
        </button>
        <button onClick={() => setActiveTab('myStudents')}
          className='px-6 py-2 rounded-full font-bold text-sm transition-all'
          style={{ background: activeTab === 'myStudents' ? 'white' : 'rgba(255,255,255,0.2)', color: activeTab === 'myStudents' ? '#E21833' : 'white', cursor: 'pointer', border: 'none' }}>
          My Students {myConnectedStudents.length > 0 && '(' + myConnectedStudents.length + ')'}
        </button>
        <button onClick={() => setActiveTab('appointments')}
          className='px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2'
          style={{ background: activeTab === 'appointments' ? 'white' : 'rgba(255,255,255,0.2)', color: activeTab === 'appointments' ? '#E21833' : 'white', cursor: 'pointer', border: 'none' }}>
          <Clock className='w-4 h-4' />Appointments
          {pendingAppointments.length > 0 && activeTab !== 'appointments' && (
            <span className='w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center' style={{ background: '#FFD200', color: '#333' }}>{pendingAppointments.length}</span>
          )}
        </button>
        <button onClick={() => setActiveTab('calendar')}
          className='px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2'
          style={{ background: activeTab === 'calendar' ? 'white' : 'rgba(255,255,255,0.2)', color: activeTab === 'calendar' ? '#E21833' : 'white', cursor: 'pointer', border: 'none' }}>
          <Calendar className='w-4 h-4' />Calendar
        </button>
      </div>

      {activeTab === 'allStudents' && (
        <div className='max-w-7xl mx-auto px-6 py-4'>
          {loading ? (
            <div className='flex items-center justify-center h-64'><p className='text-white text-lg'>Loading...</p></div>
          ) : sportMatchedStudents.length === 0 ? (
            <Alert className='border-white/20' style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Users className='h-4 w-4 text-white' />
              <AlertTitle className='text-white'>No Students Found</AlertTitle>
              <AlertDescription className='text-white/80'>No students match your sport yet!</AlertDescription>
            </Alert>
          ) : (
            <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {sportMatchedStudents.map((student: Student) => {
                const isConnected = myStudents.some(c => c.student_id === student.auth0_id);
                return renderStudentCard(student, isConnected);
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'myStudents' && (
        <div className='max-w-7xl mx-auto px-6 py-4'>
          {loading ? (
            <div className='flex items-center justify-center h-64'><p className='text-white text-lg'>Loading...</p></div>
          ) : myConnectedStudents.length === 0 ? (
            <Alert className='border-white/20' style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Users className='h-4 w-4 text-white' />
              <AlertTitle className='text-white'>No Students Yet</AlertTitle>
              <AlertDescription className='text-white/80'>Students you connect with will appear here.</AlertDescription>
            </Alert>
          ) : (
            <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {myConnectedStudents.map((student: Student) => renderStudentCard(student, true))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className='max-w-4xl mx-auto px-6 py-6 space-y-6'>
          {appointmentsLoading ? (
            <div className='flex items-center justify-center h-48'><p className='text-white text-lg'>Loading...</p></div>
          ) : appointments.length === 0 ? (
            <div className='rounded-2xl p-10 text-center' style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Clock className='w-14 h-14 text-white/40 mx-auto mb-3' />
              <p className='text-white font-bold text-lg'>No appointment requests yet</p>
              <p className='text-white/70 text-sm mt-1'>Students can request sessions once you are connected.</p>
            </div>
          ) : (
            <>
              {pendingAppointments.length > 0 && (
                <div>
                  <h2 className='text-xl font-black text-white mb-4 flex items-center gap-2'>
                    <Clock className='w-5 h-5' />Pending Requests ({pendingAppointments.length})
                  </h2>
                  <div className='space-y-3'>
                    {pendingAppointments.map(appt => (
                      <div key={appt.id} className='rounded-2xl p-5' style={{ background: 'rgba(255,255,255,0.95)' }}>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xl font-black'
                            style={{ background: 'linear-gradient(135deg, #E21833, #FFD200)' }}>
                            {appt.student_name.charAt(0)}
                          </div>
                          <div className='flex-1'>
                            <p className='font-bold text-gray-900'>{appt.student_name}</p>
                            <p className='text-sm text-gray-500 flex items-center gap-1'><Calendar className='w-3.5 h-3.5' />{appt.slot}</p>
                          </div>
                          <div className='flex gap-2'>
                            <button onClick={() => handleAccept(appt.id)}
                              className='flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105'
                              style={{ background: '#E8F5E9', color: '#2E7D32', border: 'none', cursor: 'pointer' }}>
                              <CheckCircle className='w-4 h-4' />Accept
                            </button>
                            <button onClick={() => handleDecline(appt.id)}
                              className='flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105'
                              style={{ background: '#FFEBEE', color: '#C62828', border: 'none', cursor: 'pointer' }}>
                              <XCircle className='w-4 h-4' />Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {appointments.filter(a => a.status !== 'pending').length > 0 && (
                <div>
                  <h2 className='text-xl font-black text-white mb-4'>Past Requests</h2>
                  <div className='space-y-3'>
                    {appointments.filter(a => a.status !== 'pending').map(appt => {
                      const isAccepted = appt.status === 'accepted';
                      return (
                        <div key={appt.id} className='rounded-2xl p-5 flex items-center gap-4 opacity-80' style={{ background: 'rgba(255,255,255,0.95)' }}>
                          <div className='w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xl font-black'
                            style={{ background: 'linear-gradient(135deg, #999, #ccc)' }}>
                            {appt.student_name.charAt(0)}
                          </div>
                          <div className='flex-1'>
                            <p className='font-bold text-gray-900'>{appt.student_name}</p>
                            <p className='text-sm text-gray-500'>{appt.slot}</p>
                          </div>
                          <span className='px-3 py-1 rounded-full text-xs font-bold'
                            style={{ background: isAccepted ? '#E8F5E9' : '#FFEBEE', color: isAccepted ? '#2E7D32' : '#C62828' }}>
                            {isAccepted ? 'Accepted' : 'Declined'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className='max-w-7xl mx-auto px-6 py-6 space-y-6'>
          <h2 className='text-xl font-black text-white flex items-center gap-2'>
            <Calendar className='w-5 h-5' />Weekly View — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          {appointmentsLoading ? (
            <div className='flex items-center justify-center h-48'><p className='text-white text-lg'>Loading...</p></div>
          ) : acceptedAppointments.length === 0 ? (
            <div className='rounded-2xl p-10 text-center' style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Calendar className='w-14 h-14 text-white/40 mx-auto mb-3' />
              <p className='text-white font-bold text-lg'>No confirmed sessions yet</p>
              <p className='text-white/70 text-sm mt-1'>Accept appointment requests to see them on your calendar.</p>
            </div>
          ) : (
            <WeeklyCalendar appointments={appointments} />
          )}
        </div>
      )}

      <div className='flex-1'></div>
      <Footer />
    </div>
  );
}