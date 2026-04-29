content = """import { useState } from 'react'
import { useNavigate } from 'react-router'
import { auth } from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email) { setError('Email is required'); return; }
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='w-full max-w-md p-8 rounded-3xl space-y-6'
        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.25)' }}>
        {!sent ? (
          <>
            <div className='text-center space-y-2'>
              <h1 className='text-4xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Reset Password</h1>
              <p className='text-white/80'>Enter your email to receive a reset link</p>
            </div>
            <div className='space-y-1'>
              <label className='text-white font-bold'>Email</label>
              <input type='email' placeholder='you@example.com' value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                className='w-full px-4 py-3 rounded-xl text-white placeholder-white/40 border focus:outline-none'
                style={{ background: 'rgba(255,255,255,0.15)', borderColor: error ? '#ff4444' : 'rgba(255,255,255,0.3)' }} />
              {error && <p className='text-red-400 text-sm font-medium'>{error}</p>}
            </div>
            <button onClick={handleSubmit}
              className='w-full py-4 rounded-xl font-bold text-lg text-black transition-all hover:scale-105'
              style={{ background: '#FFD200', cursor: 'pointer' }}>
              Send Reset Link
            </button>
            <p className='text-center'>
              <button onClick={() => navigate('/')} className='text-[#FFD200] font-bold hover:underline'
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Back to sign in
              </button>
            </p>
          </>
        ) : (
          <div className='text-center space-y-6'>
            <h1 className='text-4xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Check Your Email</h1>
            <p className='text-white/80'>We sent a reset link to <span className='text-[#FFD200] font-bold'>{email}</span></p>
            <button onClick={() => navigate('/')}
              className='w-full py-4 rounded-xl font-bold text-lg text-black transition-all hover:scale-105'
              style={{ background: '#FFD200', cursor: 'pointer' }}>
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  )
}"""

open("src/app/pages/ForgotPassword.tsx", "w", encoding="utf-8").write(content)
print("Done!")
