import { useNavigate } from 'react-router';
import Footer from '../components/Footer';

export default function Terms() {
  const navigate = useNavigate();
  return (
    <>
    <div className='min-h-screen' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>
      <div className='px-6 py-4 flex items-center gap-6 sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} className='flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-gray-100 transition-all' style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer' }}><span style={{ fontSize: '18px' }}>&#8592;</span> Back</button>
        <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Terms of Service</h1>
      </div>
      <div className='max-w-3xl mx-auto px-6 py-8'>
        <div className='rounded-2xl p-8 space-y-6' style={{ background: 'rgba(255,255,255,0.95)' }}>
          <p className='text-gray-500 text-sm'>Last updated: April 2026</p>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>1. Acceptance of Terms</h2>
            <p className='text-gray-700'>By using Coach Connect, you agree to these Terms of Service. Coach Connect is a platform connecting UMD students with coaches for private lessons and intramural league support.</p>
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>2. Eligibility</h2>
            <p className='text-gray-700'>Students must have a valid UMD email address (@umd.edu or @terpmail.umd.edu). Coaches may register with any valid email address.</p>
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>3. User Responsibilities</h2>
            <p className='text-gray-700'>Users are responsible for providing accurate information in their profiles. Any misrepresentation may result in account termination.</p>
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>4. Coaching Sessions</h2>
            <p className='text-gray-700'>Coach Connect facilitates connections between students and coaches. All session arrangements, pricing, and scheduling are between the coach and student directly.</p>
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>5. Prohibited Conduct</h2>
            <p className='text-gray-700'>Users may not harass, spam, or misuse the platform. Violations will result in immediate account suspension.</p>
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>6. Changes to Terms</h2>
            <p className='text-gray-700'>We reserve the right to update these terms at any time. Continued use of the platform constitutes acceptance of updated terms.</p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
