import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'
import { auth, googleProvider } from '../firebase'
import { getUserProfile } from '../utils/api'
import { getStudents } from '../utils/api'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'

export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'student' | 'coach'>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [authError, setAuthError] = useState('')

  const isUMDEmail = (value: string) =>
    value.endsWith('@umd.edu') || value.endsWith('@terpmail.umd.edu')

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
    if (tab === 'student' && !isUMDEmail(value)) return 'Students must use a UMD email (@umd.edu or @terpmail.umd.edu)'
    return ''
  }

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'Password must be at least 8 characters'
    return ''
  }

  const handleLogin = async () => {
    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)
    setEmailError(emailErr)
    setPasswordError(passwordErr)
    setAuthError('')
    if (emailErr || passwordErr) return
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const profile = await getUserProfile(cred.user.uid)
      if (profile) {
        if (profile.role === 'coach') { navigate('/my-students') }
        else { navigate('/results') }
      } else { navigate('/home') }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password')
      } else {
        setAuthError('Something went wrong. Please try again.')
      }
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const profile = await getUserProfile(result.user.uid)
      if (profile) {
        if (profile.role === 'coach') { navigate('/my-students') }
        else { navigate('/results') }
      } else { navigate('/home') }
    } catch (err) {
      setAuthError('Google sign in failed. Please try again.')
    }
  }

  const handleTabSwitch = (newTab: 'student' | 'coach') => {
    setTab(newTab)
    setEmail('')
    setPassword('')
    setEmailError('')
    setPasswordError('')
    setAuthError('')
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
        <div className='text-center'>
          <h1 className='text-4xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>
            Welcome Back
          </h1>
        </div>

        <div className='flex rounded-xl overflow-hidden border border-white/20'>
          <button
            onClick={() => handleTabSwitch('student')}
            className='flex-1 py-3 font-bold text-sm transition-all'
            style={{
              background: tab === 'student' ? '#E21833' : 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Student Log In
          </button>
          <button
            onClick={() => handleTabSwitch('coach')}
            className='flex-1 py-3 font-bold text-sm transition-all'
            style={{
              background: tab === 'coach' ? '#E21833' : 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Coach Log In
          </button>
        </div>

        {tab === 'student' && (
          <p className='text-white/60 text-sm text-center -mt-2'>
            UMD email required (@umd.edu or @terpmail.umd.edu)
          </p>
        )}

        {authError && (
          <div className='bg-red-500/20 border border-red-400 rounded-xl px-4 py-3'>
            <p className='text-red-400 text-sm font-medium'>{authError}</p>
          </div>
        )}

        <div className='space-y-4'>
          <div className='space-y-1'>
            <label className='text-white font-bold'>Email</label>
            <input
              type='email'
              placeholder={tab === 'student' ? 'username@umd.edu' : 'you@example.com'}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
              className='w-full px-4 py-3 rounded-xl text-white placeholder-white/40 border focus:outline-none'
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderColor: emailError ? '#ff4444' : 'rgba(255,255,255,0.3)'
              }}
            />
            {emailError && <p className='text-red-400 text-sm font-medium'>{emailError}</p>}
          </div>

          <div className='space-y-1'>
            <div className='flex justify-between items-center'>
              <label className='text-white font-bold'>Password</label>
              <button
                type='button'
                onClick={() => navigate('/forgot-password')}
                className='text-[#FFD200] text-sm font-semibold hover:underline'
              >
                Forgot password?
              </button>
            </div>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Min. 8 characters'
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
                className='w-full px-4 py-3 rounded-xl text-white placeholder-white/40 border focus:outline-none'
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  paddingRight: '3rem',
                  borderColor: passwordError ? '#ff4444' : 'rgba(255,255,255,0.3)'
                }}
                autoComplete='current-password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white'
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <p className='text-red-400 text-sm font-medium'>{passwordError}</p>}
          </div>
        </div>

        <button
          onClick={handleLogin}
          className='w-full py-4 rounded-xl font-bold text-lg text-black transition-all hover:scale-105 hover:shadow-lg'
          style={{ background: '#FFD200' }}
        >
          Sign In
        </button>

        <div className='flex items-center gap-3'>
          <div className='flex-1 h-px bg-white/30'></div>
          <span className='text-white/70 text-sm font-semibold'>OR CONTINUE WITH</span>
          <div className='flex-1 h-px bg-white/30'></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className='w-full py-4 rounded-xl font-bold text-gray-800 bg-white transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3'
        >
          <svg width='20' height='20' viewBox='0 0 48 48'>
            <path fill='#EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/>
            <path fill='#4285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/>
            <path fill='#FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/>
            <path fill='#34A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/>
          </svg>
          Sign in with Google
        </button>

        <p className='text-center text-white font-semibold'>
          Don't have an account?{' '}
          <button
            type='button'
            onClick={() => navigate('/home')}
            className='text-[#FFD200] font-bold hover:underline'
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}


