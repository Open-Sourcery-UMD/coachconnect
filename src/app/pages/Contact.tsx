import { useState } from 'react';
import { useNavigate } from 'react-router';
import Footer from '../components/Footer';

export default function Contact() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      alert('Please fill out all fields');
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
    <div className='min-h-screen' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>
      <div className='px-6 py-4 flex items-center gap-6 sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
        <button onClick={() => navigate(-1)} className='flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-gray-100 transition-all' style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer' }}><span style={{ fontSize: '18px' }}>&#8592;</span> Back</button>
        <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Contact Us</h1>
      </div>
      <div className='max-w-2xl mx-auto px-6 py-8'>
        {submitted ? (
          <div className='rounded-2xl p-8 text-center' style={{ background: 'rgba(255,255,255,0.95)' }}>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Message Sent!</h2>
            <p className='text-gray-600 mb-6'>Thanks for reaching out. We will get back to you soon.</p>
            <button onClick={() => navigate(-1)} className='px-6 py-3 rounded-xl font-bold text-black' style={{ background: '#FFD200', cursor: 'pointer', border: 'none' }}>Go Back</button>
          </div>
        ) : (
          <div className='rounded-2xl p-8 space-y-5' style={{ background: 'rgba(255,255,255,0.95)' }}>
            <p className='text-gray-600'>Have a question or feedback? We would love to hear from you.</p>
            <div className='space-y-1'>
              <label className='text-gray-800 font-bold text-sm'>Name</label>
              <input type='text' placeholder='Your name' value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 text-gray-800' />
            </div>
            <div className='space-y-1'>
              <label className='text-gray-800 font-bold text-sm'>Email</label>
              <input type='email' placeholder='your@email.com' value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 text-gray-800' />
            </div>
            <div className='space-y-1'>
              <label className='text-gray-800 font-bold text-sm'>Message</label>
              <textarea placeholder='Your message...' rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 text-gray-800 resize-none' />
            </div>
            <button onClick={handleSubmit} className='w-full py-4 rounded-xl font-bold text-lg text-black transition-all hover:scale-105'
              style={{ background: '#FFD200', cursor: 'pointer', border: 'none' }}>
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}
