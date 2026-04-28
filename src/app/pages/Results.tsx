import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { LogOut, Mail, Phone, Star, AlertCircle, Calendar, SlidersHorizontal } from 'lucide-react';
import { getCoaches } from '../utils/api';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface Coach {
  id: string; name: string; email: string; phone: string;
  expertise: string[]; coaching_style: string; rate: string;
  availability: string[]; role: string; gender?: string; competition_level?: string[];
}

const SPORTS = ['Soccer', 'Basketball', 'Tennis', 'Volleyball', 'Baseball', 'Softball', 'Swimming', 'Track', 'Football', 'Golf'];
const LEVELS = ['Recreational', 'Competitive', 'Elite'];

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const sports = useMemo(() => (location.state?.sports as string[]) || [], [location.state?.sports]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSports, setSelectedSports] = useState<string[]>(sports);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [maxRate, setMaxRate] = useState<string>('');

  useEffect(() => { fetchCoaches(); }, []);

  const fetchCoaches = async () => {
    setLoading(true);
    try { const data = await getCoaches(); setCoaches(data); } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };
  const toggleSport = (sport: string) => { setSelectedSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]); };

  const filteredCoaches = coaches.filter(coach => {
    if (selectedSports.length > 0 && !coach.expertise.some(s => selectedSports.includes(s))) return false;
    if (selectedLevel && !(coach.competition_level || []).includes(selectedLevel)) return false;
    if (maxRate && parseFloat(coach.rate || '0') > parseFloat(maxRate)) return false;
    return true;
  });

  const handleViewProfile = (coach: Coach) => { setSelectedCoach(coach); setIsProfileOpen(true); };
  const handleConnect = (coach: Coach) => { alert('Connection request sent to ' + coach.name + '!'); setIsProfileOpen(false); };

  const getScheduleByDay = (availability: string[]) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule: Record<string, string[]> = {};
    days.forEach(day => { schedule[day] = availability.filter(slot => slot.startsWith(day)).map(slot => slot.replace(day + ' ', '')); });
    return schedule;
  };

  return (
    <div className='min-h-screen' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>
      <div className='px-6 py-4 flex items-center justify-between sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
        <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Coach Connect</h1>
        <p className='text-white/80 text-sm font-medium'>{loading ? 'Loading...' : filteredCoaches.length + ' coaches found'}</p>
        <Button variant='outline' onClick={handleLogout} className='bg-[#E21833] text-white hover:bg-red-700 border-0' style={{ cursor: 'pointer' }}>
          <LogOut className='w-4 h-4 mr-2' />Logout
        </Button>
      </div>

      <div className='flex max-w-7xl mx-auto px-4 py-6 gap-6'>
        <div className='w-56 flex-shrink-0'>
          <div className='rounded-2xl p-5 sticky top-20 space-y-5' style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}>
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
                      style={{ background: selectedSports.includes(sport) ? '#E21833' : 'white', borderColor: selectedSports.includes(sport) ? '#E21833' : '#ddd', cursor: 'pointer' }}>
                      {selectedSports.includes(sport) && <span className='text-white text-xs font-bold'>v</span>}
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
              <input type='number' placeholder='Any rate' value={maxRate} onChange={e => setMaxRate(e.target.value)}
                className='w-full rounded-lg px-3 py-2 text-sm focus:outline-none' style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }} />
            </div>
            {(selectedSports.length > 0 || selectedLevel || maxRate) && (
              <button onClick={() => { setSelectedSports([]); setSelectedLevel(''); setMaxRate(''); }}
                className='w-full text-sm text-red-500 hover:text-red-700 font-semibold' style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
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
                <div key={coach.id} className='bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100'>
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
                        <p className='text-xl font-black text-gray-900'></p>
                        <p className='text-xs text-gray-500'>/hour</p>
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
                    <p className='text-3xl font-black'></p>
                    <p className='text-sm text-gray-500'>/hour</p>
                  </div>
                </div>
              </DialogHeader>
              <div>
                <h3 className='font-bold text-gray-800 mb-1'>About</h3>
                <p className='text-gray-600 text-sm'>{selectedCoach.coaching_style || 'Passionate coach.'}</p>
              </div>
              <div>
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
                <Button className='flex-1 py-5 text-base font-semibold rounded-xl' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={() => handleConnect(selectedCoach)}>Connect with Coach</Button>
                <Button variant='outline' className='rounded-xl' style={{ cursor: 'pointer' }} onClick={() => setIsProfileOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
