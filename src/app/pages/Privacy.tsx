import { useNavigate } from 'react-router';
import Footer from '../components/Footer';

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <>
    <div className='min-h-screen' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>
      <div className='px-6 py-4 flex items-center gap-6 sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} className='flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-gray-100 transition-all' style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer' }}><span style={{ fontSize: '18px' }}>&#8592;</span> Back</button>
        <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Privacy Policy</h1>
      </div>
      <div className='max-w-3xl mx-auto px-6 py-8'>
        <div className='rounded-2xl p-8 space-y-6' style={{ background: 'rgba(255,255,255,0.95)' }}>
          <p className='text-gray-500 text-sm'>Last updated: April 2026</p>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>1. Information We Collect</h2>
            <p className='text-gray-700'>We collect information you provide during registration including name, email, phone number, and profile details. We also collect usage data to improve the platform.</p>
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>2. How We Use Your Information</h2>
            <p className='text-gray-700'>Your information is used to match students with coaches, facilitate connections, and improve our services. We do not sell your data to third parties.</p>
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>3. Data Security</h2>
            <p className='text-gray-700'>We use Firebase Authentication and MongoDB Atlas with industry-standard security practices to protect your data.</p>
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>4. Profile Visibility</h2>
            <p className='text-gray-700'>Coach profiles are visible to all registered students. Student profiles are visible to registered coaches. Contact information is only shared upon connection.</p>
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>5. Your Rights</h2>
            <p className='text-gray-700'>You may request deletion of your account and associated data at any time by contacting us.</p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
