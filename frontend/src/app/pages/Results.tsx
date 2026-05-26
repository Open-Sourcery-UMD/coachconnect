import { useEffect, useState, useMemo } from 'react';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { LogOut, MessageCircle, Mail, Phone, Star, AlertCircle, Calendar, SlidersHorizontal, Clock } from 'lucide-react';
import { getCoaches, getStudentConnections, createAppointment, getStudentAppointments } from '../utils/api';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import WeeklyCalendar from '../components/WeeklyCalendar';
import ProfileModal from '../components/ProfileModal';

interface Coach {
  id: string; firebase_uid: string; name: string; email: string; phone: string;
  expertise: string[]; coaching_style: string; rate: string;
  availability: string[]; role: string; gender?: string; competition_level?: string[];
  sport_details?: Record<string, { coachingYears: string; playingYears: string; achievements: string; videoLink: string }>;
  certification?: string;
}

interface Appointment {
  id: string; coach_id: string; student_id: string;
  coach_name: string; student_name: string;
  slot: string; status: 'pending' | 'accepted' | 'declined';
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SPORTS = ['Soccer', 'Basketball', 'Tennis', 'Volleyball', 'Baseball', 'Softball', 'Swimming', 'Track', 'Football', 'Golf'];
const LEVELS = ['Recreational', 'Competitive', 'Elite'];

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const sports = useMemo(() => (location.state?.sports as string[]) || [], [location.state?.sports]);
  const [activeTab, setActiveTab] = useState<'findCoaches' | 'myAppointments'>('findCoaches');
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [userFullName, setUserFullName] = useState<string>('');
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>(sports);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [maxRate, setMaxRate] = useState<string>('');
  const [myCoachIds, setMyCoachIds] = useState<Set<string>>(new Set());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingCoach, setBookingCoach] = useState<Coach | null>(null);
  const [bookingSlot, setBookingSlot] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);

  useEffect(() => {
    fetchCoaches();
    fetchUserName();
    fetchMyConnections();
  }, []);

  useEffect(() => {
    if (activeTab === 'myAppointments') fetchAppointments();
  }, [activeTab]);
  useEffect(() => { if (!showProfile) fetchUserName(); }, [showProfile]);

  const fetchUserName = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const res = await fetch('http://localhost:8000/users/' + user.uid);
      const data = await res.json();
      if (data.name) {
        setUserName(data.name.split(' ')[0]);
        setUserFullName(data.name);
      }
      if (data.interests) setUserInterests(data.interests);
    } catch (err) { console.error(err); }
  };

  const fetchMyConnections = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const data = await getStudentConnections(user.uid);
      if (Array.isArray(data)) setMyCoachIds(new Set(data.map((c: any) => c.coach_id)));
    } catch (err) { console.error(err); }
  };

  const fetchCoaches = async () => {
    setLoading(true);
    try { const data = await getCoaches(); setCoaches(data); } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchAppointments = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setAppointmentsLoading(true);
    try {
      const data = await getStudentAppointments(user.uid);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    setAppointmentsLoading(false);
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };
  const toggleSport = (sport: string) => { setSelectedSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]); };

  const filteredCoaches = coaches.filter(coach => {
    if (selectedSports.length > 0 && !coach.expertise.some(s => selectedSports.includes(s))) return false;
    if (selectedLevel && !(coach.competition_level || []).some((l: string) => l.toLowerCase() === selectedLevel.toLowerCase())) return false;
    if (maxRate !== '' && Number(coach.rate || 0) > Number(maxRate)) return false;
    return true;
  });

  const handleViewProfile = (coach: Coach) => { setSelectedCoach(coach); setIsProfileOpen(true); };
  const handleConnect = (coach: Coach) => {
    localStorage.setItem('cc_user_' + coach.firebase_uid, coach.name);
    if (auth.currentUser) {
      localStorage.setItem('cc_user_' + auth.currentUser.uid, auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Student');
    }
    setIsProfileOpen(false);
    navigate('/conversation/' + coach.firebase_uid, { state: { userName: coach.name } });
  };

  const handleOpenBooking = (coach: Coach) => {
    setBookingCoach(coach);
    setBookingSlot('');
    setBookingSuccess('');
    setIsProfileOpen(false);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!bookingSlot) { alert('Please select a time slot'); return; }
    const user = auth.currentUser;
    if (!user || !bookingCoach) return;
    try {
      await createAppointment({
        coach_id: bookingCoach.firebase_uid,
        student_id: user.uid,
        coach_name: bookingCoach.name,
        student_name: userFullName || userName || user.email?.split('@')[0] || 'Student',
        slot: bookingSlot,
        status: 'pending',
      });
      setBookingSuccess(bookingSlot);
      setBookingSlot('');
    } catch (err) {
      alert('Failed to book. Please try again.');
    }
  };

  const getScheduleByDay = (availability: string[]) => {
    const schedule: Record<string, string[]> = {};
    DAYS.forEach((day: string) => { schedule[day] = availability.filter(slot => slot.startsWith(day)).map(slot => slot.replace(day + ' ', '')); });
    return schedule;
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const acceptedAppointments = appointments.filter(a => a.status === 'accepted');

  const statusBadge = (status: string) => {
    if (status === 'pending') return { bg: '#FFF3E0', color: '#E65100', label: 'Pending' };
    if (status === 'accepted') return { bg: '#E8F5E9', color: '#2E7D32', label: 'Accepted' };
    return { bg: '#FFEBEE', color: '#C62828', label: 'Declined' };
  };

  return (
    <div className='min-h-screen' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>
      <div className='px-6 py-4 flex items-center justify-between sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
        <p className='text-white font-bold text-xl'>Welcome Back{userName ? ', ' + userName : ''}</p>
        <Button onClick={() => setShowProfile(true)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', marginRight: '4px' }}>Profile</Button>
        <Button onClick={() => navigate('/messages')} className='mr-2' style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
          <MessageCircle className='w-4 h-4 mr-2' />Messages
        </Button>
        <Button variant='outline' onClick={handleLogout} className='bg-[#E21833] text-white hover:bg-red-700 border-0' style={{ cursor: 'pointer' }}>
          <LogOut className='w-4 h-4 mr-2' />Logout
        </Button>
      </div>

      <div className='px-6 pt-4 flex gap-4'>
        <button onClick={() => setActiveTab('findCoaches')}
          className='px-6 py-2 rounded-full font-bold text-sm transition-all'
          style={{ background: activeTab === 'findCoaches' ? 'white' : 'rgba(255,255,255,0.2)', color: activeTab === 'findCoaches' ? '#E21833' : 'white', cursor: 'pointer', border: 'none' }}>
          Find Coaches
        </button>
        <button onClick={() => setActiveTab('myAppointments')}
          className='px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2'
          style={{ background: activeTab === 'myAppointments' ? 'white' : 'rgba(255,255,255,0.2)', color: activeTab === 'myAppointments' ? '#E21833' : 'white', cursor: 'pointer', border: 'none' }}>
          <Calendar className='w-4 h-4' />My Appointments
          {pendingAppointments.length > 0 && activeTab !== 'myAppointments' && (
            <span className='w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center' style={{ background: '#FFD200', color: '#333' }}>{pendingAppointments.length}</span>
          )}
        </button>
      </div>

      {activeTab === 'findCoaches' ? (
        <div className='flex max-w-7xl mx-auto px-4 py-6 gap-6'>
          <div className='w-56 flex-shrink-0'>
            <div className='rounded-2xl p-5 sticky top-20 space-y-5' style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.4)' }}>
              <div className='flex items-center gap-2'>
                <SlidersHorizontal className='w-4 h-4 text-gray-600' />
                <h2 className='font-bold text-white'>Filters</h2>
              </div>
              <div>
                <p className='text-xs font-bold text-white/60 uppercase tracking-wider mb-3'>Sports</p>
                <div className='space-y-2'>
                  {SPORTS.map(sport => (
                    <label key={sport} className='flex items-center gap-2 cursor-pointer'>
                      <div onClick={() => toggleSport(sport)} className='w-4 h-4 rounded border-2 flex items-center justify-center transition-all'
                        style={{ background: selectedSports.includes(sport) ? '#FFD200' : 'transparent', borderColor: selectedSports.includes(sport) ? '#FFD200' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                      </div>
                      <span className='text-sm text-white/90'>{sport}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className='text-xs font-bold text-white/60 uppercase tracking-wider mb-3'>Level</p>
                <div className='space-y-2'>
                  {LEVELS.map(level => (
                    <label key={level} className='flex items-center gap-2 cursor-pointer'>
                      <div onClick={() => setSelectedLevel(selectedLevel === level ? '' : level)} className='w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all'
                        style={{ background: selectedLevel === level ? '#FFD200' : 'white', borderColor: selectedLevel === level ? '#FFD200' : '#ddd', cursor: 'pointer' }}>
                        {selectedLevel === level && <div className='w-2 h-2 rounded-full bg-gray-800'></div>}
                      </div>
                      <span className='text-sm text-white/90'>{level}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className='text-xs font-bold text-white/60 uppercase tracking-wider mb-2'>Max Pricing ($/hr)</p>
                <input type='number' placeholder='Any rate' value={maxRate} onChange={e => { const val = e.target.value; if (val === '' || parseFloat(val) >= 0) setMaxRate(val); }}
                  className='w-full rounded-lg px-3 py-2 text-sm focus:outline-none' style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }} />
              </div>
              {(selectedSports.length > 0 || selectedLevel || maxRate) && (
                <button onClick={() => { setSelectedSports([]); setSelectedLevel(''); setMaxRate(''); }}
                  className='w-full text-sm font-bold py-2 rounded-lg' style={{ background: '#E21833', color: 'white', cursor: 'pointer', border: 'none' }}>
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          <div className='flex-1'>
            {loading ? (
              <div className='flex items-center justify-center h-64'>
                <p className='text-gray-500 text-lg'>Loading coaches...</p>
              </div>
            ) : filteredCoaches.length === 0 ? (
              <Alert className='bg-white border-2 border-gray-200'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>No Coaches Found</AlertTitle>
                <AlertDescription>Try adjusting your filters!</AlertDescription>
              </Alert>
            ) : (
              <div className='grid gap-5 grid-cols-1 lg:grid-cols-2'>
                {filteredCoaches.map((coach) => (
                  <div key={coach.id} className='rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden' style={{ background: 'rgba(255,255,255,0.92)', border: '2px solid rgba(255,255,255,0.6)' }}>
                    <div className='p-5'>
                      <div className='flex gap-4 mb-3'>
                        <div className='w-14 h-14 flex-shrink-0 rounded-full flex items-center justify-center text-white text-2xl font-black'
                          style={{ background: 'linear-gradient(135deg, #E21833, #FFD200)' }}>
                          {coach.name.charAt(0)}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='text-lg font-bold text-gray-900 truncate'>{coach.name}</h3>
                          <div className='flex items-center gap-1 text-sm text-gray-500 mt-0.5'>
                            <Star className='w-3.5 h-3.5 fill-yellow-400 text-yellow-400' />
                            <span className='font-semibold text-gray-700'>5.0</span>
                            <span> New Coach</span>
                          </div>
                          <p className='text-xs text-gray-500 mt-0.5'>College Park, MD</p>
                        </div>
                        <div className='text-right flex-shrink-0'>
                          <p className='text-xs text-gray-400'>from</p>
                          <p className='text-xl font-black text-gray-900'>${coach.rate || '0'}<span className='text-xs font-normal text-gray-400'>/hr</span></p>
                        </div>
                      </div>
                      <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{coach.coaching_style || 'Passionate coach dedicated to helping students.'}</p>
                      <div className='flex flex-wrap gap-1.5 mb-4'>
                        {coach.expertise.map(exp => (
                          <span key={exp} className='px-2 py-0.5 rounded-full text-xs font-semibold' style={{ background: '#FFF3F4', color: '#E21833' }}>{exp}</span>
                        ))}
                      </div>
                      <Button className='w-full font-semibold rounded-xl' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={() => handleViewProfile(coach)}>
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='px-4 py-4 space-y-6'>
          {appointmentsLoading ? (
            <div className='flex items-center justify-center h-48'><p className='text-white text-lg'>Loading...</p></div>
          ) : (
            <>
              <div>
                <h2 className='text-xl font-black text-white mb-3 flex items-center gap-2'>
                  <Calendar className='w-5 h-5' />Weekly View — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                {acceptedAppointments.length === 0 ? (
                  <div className='rounded-2xl p-8 text-center' style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <Calendar className='w-12 h-12 text-white/40 mx-auto mb-3' />
                    <p className='text-white font-semibold'>No confirmed sessions yet</p>
                    <p className='text-white/70 text-sm'>Once a coach accepts your booking it will appear here.</p>
                  </div>
                ) : (
                  <WeeklyCalendar appointments={appointments.map(a => ({ ...a, label: a.coach_name }))} />
                )}
              </div>

              <div>
                <h2 className='text-xl font-black text-white mb-4 flex items-center gap-2'>
                  <Clock className='w-5 h-5' />All Appointments
                </h2>
                {appointments.length === 0 ? (
                  <div className='rounded-2xl p-8 text-center' style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <p className='text-white font-semibold'>No appointments yet</p>
                    <p className='text-white/70 text-sm'>Book a session with a connected coach to get started.</p>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {appointments.map(appt => {
                      const badge = statusBadge(appt.status);
                      return (
                        <div key={appt.id} className='rounded-2xl p-5 flex items-center gap-4' style={{ background: 'rgba(255,255,255,0.95)' }}>
                          <div className='w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xl font-black'
                            style={{ background: 'linear-gradient(135deg, #E21833, #FFD200)' }}>
                            {appt.coach_name.charAt(0)}
                          </div>
                          <div className='flex-1'>
                            <p className='font-bold text-gray-900'>{appt.coach_name}</p>
                            <p className='text-sm text-gray-500 flex items-center gap-1'><Calendar className='w-3.5 h-3.5' />{appt.slot}</p>
                          </div>
                          <span className='px-3 py-1 rounded-full text-xs font-bold' style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          {selectedCoach && (
            <div className='space-y-5'>
              <DialogHeader>
                <div className='flex gap-4'>
                  <div className='w-20 h-20 flex-shrink-0 rounded-full flex items-center justify-center text-white text-3xl font-black'
                    style={{ background: 'linear-gradient(135deg, #E21833, #FFD200)' }}>
                    {selectedCoach.name.charAt(0)}
                  </div>
                  <div className='flex-1'>
                    <DialogTitle className='text-2xl font-bold'>{selectedCoach.name}</DialogTitle>
                    <DialogDescription className='sr-only'>Profile for {selectedCoach.name}</DialogDescription>
                    <div className='flex items-center gap-1 mt-1'>
                      <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                      <span className='font-semibold'>5.0</span>
                    </div>
                    <div className='flex gap-2 flex-wrap mt-2'>
                      {selectedCoach.expertise.map(exp => (
                        <span key={exp} className='px-2 py-0.5 rounded-full text-xs font-semibold' style={{ background: '#FFF3F4', color: '#E21833' }}>{exp}</span>
                      ))}
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-xs text-gray-400 mb-1'>pricing</p>
                    <p className='text-2xl font-black' style={{ color: '#E21833' }}>${selectedCoach.rate || '0'}<span className='text-sm font-normal text-gray-500'>/hr</span></p>
                  </div>
                </div>
              </DialogHeader>
              <div>
                <h3 className='font-bold text-gray-800 mb-1'>About</h3>
                <p className='text-gray-600 text-sm'>{selectedCoach.coaching_style || 'Passionate coach.'}</p>
              </div>
              {selectedCoach.sport_details && Object.keys(selectedCoach.sport_details).length > 0 && (<div className='space-y-2'><h3 className='font-bold text-gray-800 mb-2'>Experience by Sport</h3>{Object.entries(selectedCoach.sport_details).map(([sport, d]: [string, any]) => (<div key={sport} className='rounded-xl p-3 border' style={{background:'#FAFAFA'}}><p className='font-bold text-sm mb-1' style={{color:'#E21833'}}>{sport}</p><div className='grid grid-cols-2 gap-1 text-xs text-gray-600 mb-1'><span>Coaching: {d.coachingYears} yrs</span><span>Playing: {d.playingYears} yrs</span></div>{d.achievements && <p className='text-xs text-gray-500 italic mb-1'>{d.achievements}</p>}{d.videoLink && <a href={d.videoLink} target='_blank' rel='noopener noreferrer' className='text-xs text-blue-500 underline'>Watch Video</a>}</div>))}</div>)}{selectedCoach.certification && (<div><h3 className='font-bold text-gray-800 mb-1'>Certification</h3><p className='text-sm text-gray-600'>{selectedCoach.certification}</p></div>)}<div>
                <h3 className='font-bold text-gray-800 mb-2 flex items-center gap-2'><Calendar className='w-4 h-4' />Availability</h3>
                <div className='border rounded-xl overflow-hidden text-sm'>
                  {Object.entries(getScheduleByDay(selectedCoach.availability || [])).map(([day, times]) => (
                    <div key={day} className='border-b last:border-b-0 grid grid-cols-3 gap-2 p-2.5 hover:bg-gray-50'>
                      <div className='font-semibold text-gray-700'>{day.slice(0, 3)}</div>
                      <div className='col-span-2'>
                        {times.length > 0 ? (
                          <div className='flex flex-wrap gap-1'>
                            {times.map((time, idx) => (<span key={idx} className='px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200'>{time}</span>))}
                          </div>
                        ) : <span className='text-gray-400 text-xs italic'>Not available</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className='font-bold text-gray-800 mb-2'>Contact</h3>
                <div className='space-y-1.5'>
                  <div className='flex items-center gap-2 text-sm'><Mail className='w-4 h-4 text-gray-400' /><span>{selectedCoach.email}</span></div>
                  {selectedCoach.phone && <div className='flex items-center gap-2 text-sm'><Phone className='w-4 h-4 text-gray-400' /><span>{selectedCoach.phone}</span></div>}
                </div>
              </div>
              <div className='flex gap-3 pt-2'>
                {myCoachIds.has(selectedCoach.firebase_uid) ? (
                  <Button className='flex-1 py-5 text-base font-semibold rounded-xl' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={() => handleOpenBooking(selectedCoach)}>
                    <Calendar className='w-4 h-4 mr-2' />Book Session
                  </Button>
                ) : (
                  userInterests.length === 0 || selectedCoach.expertise.some(e => userInterests.includes(e)) ? (<Button className='flex-1 py-5 text-base font-semibold rounded-xl' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={() => handleConnect(selectedCoach)}>Connect with Coach</Button>) : (<Button className='flex-1 py-5 text-base font-semibold rounded-xl' disabled style={{ background: '#ccc', color: '#888', cursor: 'not-allowed' }}>Not Available for Your Sports</Button>)
                )}
                <Button variant='outline' className='rounded-xl' style={{ cursor: 'pointer' }} onClick={() => setIsProfileOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isBookingOpen} onOpenChange={(open) => { setIsBookingOpen(open); if (!open) setBookingSuccess(''); }}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold'>Book a Session</DialogTitle>
            <DialogDescription>Select an available time slot with {bookingCoach?.name}</DialogDescription>
          </DialogHeader>
          {bookingSuccess ? (
            <div className='py-6 text-center space-y-3'>
              <div className='w-16 h-16 rounded-full flex items-center justify-center mx-auto' style={{ background: '#E8F5E9' }}>
                <span className='text-3xl'>✓</span>
              </div>
              <p className='font-bold text-gray-900'>Booking Request Sent!</p>
              <p className='text-sm text-gray-600'>Your request for <strong>{bookingSuccess}</strong> is pending. {bookingCoach?.name} will confirm shortly.</p>
              <Button className='w-full rounded-xl font-semibold' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }}
                onClick={() => { setIsBookingOpen(false); setBookingSuccess(''); setActiveTab('myAppointments'); fetchAppointments(); }}>
                View My Appointments
              </Button>
            </div>
          ) : (
            <>
              <div className='space-y-3 py-2 max-h-72 overflow-y-auto'>
                {(bookingCoach?.availability || []).length === 0 ? (
                  <p className='text-sm text-gray-500 italic'>No availability listed for this coach.</p>
                ) : (bookingCoach?.availability || []).map((slot) => (
                  <button key={slot} onClick={() => setBookingSlot(slot)}
                    className='w-full px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all'
                    style={{ background: bookingSlot === slot ? '#E21833' : '#f5f5f5', color: bookingSlot === slot ? 'white' : '#333', border: bookingSlot === slot ? 'none' : '1px solid #ddd', cursor: 'pointer' }}>
                    {slot}
                  </button>
                ))}
              </div>
              <div className='flex gap-3 pt-2'>
                <Button className='flex-1 py-4 font-semibold rounded-xl' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={handleConfirmBooking}>
                  Request Booking
                </Button>
                <Button variant='outline' className='rounded-xl' style={{ cursor: 'pointer' }} onClick={() => setIsBookingOpen(false)}>Cancel</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {showProfile && <ProfileModal role='student' onClose={() => setShowProfile(false)} />}
      <Footer />
    </div>
  );
}







