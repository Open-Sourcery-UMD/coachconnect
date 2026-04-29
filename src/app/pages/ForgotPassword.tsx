import { useState } from 'react'
import Footer from '../components/Footer';
import { useNavigate } from 'react-router'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (!email) return
    try {
      await fetch('https://dev-u7jwbk7yci1yhpo6.us.auth0.com/dbconnections/change_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: 'xzi96Sek348796zgPxMjRxPzU1KDEwjQ',
          email: email,
          connection: 'Username-Password-Authentication'
        })
      })
      setSent(true)
    } catch (err) {
      setSent(true)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div
        className='w-full max-w-md p-8 rounded-3xl space-y-6'
        style={{
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}
      >
        {!sent ? (
          <>
            <div className='text-center space-y-2'>
              <h1 className='text-4xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>
                Reset Password
              </h1>
              <p className='text-white/80 font-medium'>
                Enter your email to receive a password reset link
              </p>
            </div>

            <div className='space-y-2'>
              <label className='text-white font-bold'>Email</label>
              <input
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 rounded-xl text-white placeholder-white/40 border border-white/30 focus:outline-none focus:border-white/80'
                style={{ background: 'rgba(255,255,255,0.15)' }}
              />
            </div>

            <button
              onClick={handleSubmit}
              className='w-full py-4 rounded-xl font-bold text-lg text-black transition-all hover:scale-105'
              style={{ background: '#FFD200' }}
            >
              Send Reset Link
            </button>

            <p className='text-center'>
              <button
                onClick={() => navigate('/')}
                className='text-[#FFD200] font-bold hover:underline'
              >
                Back to sign in
              </button>
            </p>
          </>
        ) : (
          <div className='text-center space-y-6'>
            <h1 className='text-4xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>
              Check Your Email
            </h1>
            <p className='text-white/80 font-medium'>
              We sent a password reset link to <span className='text-[#FFD200] font-bold'>{email}</span>
            </p>
            <button
              onClick={() => navigate('/')}
              className='w-full py-4 rounded-xl font-bold text-lg text-black transition-all hover:scale-105'
              style={{ background: '#FFD200' }}
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}