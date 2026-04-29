import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { LogOut, Mail, Phone, Users, Calendar } from 'lucide-react';
import { getStudents } from '../utils/api';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface Student {
  id: string; name: string; email: string; phone: string;
  interests: string[]; goals: string; level: string; budget: string;
  preferred_times: string[]; graduation_year: string; role: string;
}

export default function MyStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'interested' | 'calendar'>('interested');
  const coachName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Coach';
  const allSports = ['All', ...Array.from(new Set(students.flatMap(s => s.interests)))];

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try { const data = await getStudents(); setStudents(Array.isArray(data) ? data : []); }
    catch (err) { console.error(err); setStudents([]); }
    setLoading(false);
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };
  const filteredStudents = activeSport === 'All' ? students : students.filter(s => s.interests.includes(activeSport));
  const handleViewProfile = (student: Student) => { setSelectedStudent(student); setIsProfileOpen(true); };
  const handleContact = (student: Student) => { alert('Contact request sent to ' + student.name + '!'); setIsProfileOpen(false); };

  const getLevelBadge = (level: string) => {
    if (level === 'beginner') return { bg: '#E8F5E9', color: '#2E7D32', label: 'Beginner' };
    if (level === 'intermediate') return { bg: '#FFF3E0', color: '#E65100', label: 'Intermediate' };
    if (level === 'advanced') return { bg: '#FCE4EC', color: '#C62828', label: 'Advanced' };
    return { bg: '#F5F5F5', color: '#333', label: level || 'Unknown' };
  };

  return (
    <div className='min-h-screen flex flex-col' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>
      <div className='px-6 py-4 flex items-center justify-between sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
        <div>
          <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Coach Connect</h1>
          <p className='text-white/70 text-sm'>Welcome, {coachName}</p>
        </div>
        <p className='text-white/80 text-sm font-medium'>{loading ? 'Loading...' : filteredStudents.length + ' students'}</p>
        <Button onClick={handleLogout} className='bg-[#E21833] hover:bg-red-700 text-white border-0' style={{ cursor: 'pointer' }}>
          <LogOut className='w-4 h-4 mr-2' />Logout
        </Button>
      </div>

      <div className='px-6 pt-4 flex gap-4'>
        <button onClick={() => setActiveTab('interested')}
          className='px-6 py-2 rounded-full font-bold text-sm transition-all'
          style={{ background: activeTab === 'interested' ? 'white' : 'rgba(255,255,255,0.2)', color: activeTab === 'interested' ? '#E21833' : 'white', cursor: 'pointer', border: 'none' }}>
          Interested Students
        </button>
        <button onClick={() => setActiveTab('calendar')}
          className='px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2'
          style={{ background: activeTab === 'calendar' ? 'white' : 'rgba(255,255,255,0.2)', color: activeTab === 'calendar' ? '#E21833' : 'white', cursor: 'pointer', border: 'none' }}>
          <Calendar className='w-4 h-4' />Calendar
        </button>
      </div>

      {activeTab === 'interested' ? (
        <div className='max-w-7xl mx-auto px-6 py-4'>
          {!loading && allSports.length > 1 && (
            <div className='flex flex-wrap gap-2 mb-6'>
              {allSports.map(sport => (
                <button key={sport} onClick={() => setActiveSport(sport)}
                  className='px-4 py-1.5 rounded-full text-sm font-semibold transition-all'
                  style={{ background: activeSport === sport ? '#FFD200' : 'rgba(255,255,255,0.2)', color: activeSport === sport ? '#333' : 'white', cursor: 'pointer', border: 'none' }}>
                  {sport}
                </button>
              ))}
            </div>
          )}
          {loading ? (
            <div className='flex items-center justify-center h-64'><p className='text-white text-lg'>Loading students...</p></div>
          ) : filteredStudents.length === 0 ? (
            <Alert className='border-white/20' style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Users className='h-4 w-4 text-white' />
              <AlertTitle className='text-white'>No Students Found</AlertTitle>
              <AlertDescription className='text-white/80'>No students have signed up yet!</AlertDescription>
            </Alert>
          ) : (
            <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {filteredStudents.map((student) => {
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
                          <h3 className='text-base font-bold text-gray-900 truncate'>{student.name}</h3>
                          <p className='text-xs text-gray-500'>Class of {student.graduation_year || 'N/A'}</p>
                          <span className='px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5 inline-block' style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
                        </div>
                        <div className='text-right'>
                          <p className='text-xs text-gray-400'>budget</p>
                          <p className='text-lg font-black text-gray-900'><span className='text-xs text-gray-400'>/hr</span></p>
                        </div>
                      </div>
                      {student.goals && <p className='text-xs text-gray-600 mb-3 line-clamp-2 italic'>{student.goals}</p>}
                      <div className='flex flex-wrap gap-1 mb-3'>
                        {student.interests.map(interest => (
                          <span key={interest} className='px-2 py-0.5 rounded-full text-xs font-semibold' style={{ background: '#FFF3F4', color: '#E21833' }}>{interest}</span>
                        ))}
                      </div>
                      <Button className='w-full font-semibold rounded-xl text-sm' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={() => handleViewProfile(student)}>
                        View Profile
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='rounded-2xl p-8 text-center' style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <Calendar className='w-16 h-16 text-white/50 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-white mb-2'>Calendar Coming Soon</h2>
            <p className='text-white/70'>Your upcoming sessions with students will appear here.</p>
          </div>
        </div>
      )}

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          {selectedStudent && (
            <div className='space-y-5'>
              <DialogHeader>
                <div className='flex gap-4'>
                  <div className='w-20 h-20 flex-shrink-0 rounded-full flex items-center justify-center text-white text-3xl font-black'
                    style={{ background: 'linear-gradient(135deg, #E21833, #FFD200)' }}>
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div className='flex-1'>
                    <DialogTitle className='text-2xl font-bold'>{selectedStudent.name}</DialogTitle>
                    <DialogDescription className='sr-only'>Profile for {selectedStudent.name}</DialogDescription>
                    <p className='text-gray-500 text-sm mt-1'>Class of {selectedStudent.graduation_year || 'N/A'}</p>
                    <span className='px-2 py-0.5 rounded-full text-xs font-semibold capitalize mt-2 inline-block'
                      style={{ background: getLevelBadge(selectedStudent.level).bg, color: getLevelBadge(selectedStudent.level).color }}>
                      {getLevelBadge(selectedStudent.level).label}
                    </span>
                  </div>
                  <div className='text-right'>
                    <p className='text-xs text-gray-400'>budget</p>
                    <p className='text-2xl font-black' style={{ color: '#E21833' }}><span className='text-sm font-normal text-gray-500'>/hr</span></p>
                  </div>
                </div>
              </DialogHeader>
              <div>
                <h3 className='font-bold text-gray-800 mb-1'>Athletic Goals</h3>
                <p className='text-gray-600 text-sm italic'>{selectedStudent.goals || 'No goals specified'}</p>
              </div>
              <div>
                <h3 className='font-bold text-gray-800 mb-2'>Interested Sports</h3>
                <div className='flex flex-wrap gap-2'>
                  {selectedStudent.interests.map(interest => (
                    <span key={interest} className='px-3 py-1 rounded-full text-sm font-semibold' style={{ background: '#FFF3F4', color: '#E21833' }}>{interest}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className='font-bold text-gray-800 mb-2'>Preferred Times</h3>
                <div className='flex flex-wrap gap-2'>
                  {(selectedStudent.preferred_times || []).map((time, idx) => (
                    <span key={idx} className='px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700'>{time}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className='font-bold text-gray-800 mb-2'>Contact</h3>
                <div className='space-y-1.5'>
                  <div className='flex items-center gap-2 text-sm'><Mail className='w-4 h-4 text-gray-400' /><span>{selectedStudent.email}</span></div>
                  {selectedStudent.phone && <div className='flex items-center gap-2 text-sm'><Phone className='w-4 h-4 text-gray-400' /><span>{selectedStudent.phone}</span></div>}
                </div>
              </div>
              <div className='flex gap-3 pt-2'>
                <Button className='flex-1 py-5 text-base font-semibold rounded-xl' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={() => handleContact(selectedStudent)}>
                  Contact Student
                </Button>
                <Button variant='outline' className='rounded-xl' style={{ cursor: 'pointer' }} onClick={() => setIsProfileOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className='flex-1'></div>
      <Footer />
    </div>
  );
}
