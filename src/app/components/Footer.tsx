export default function Footer() {
  return (
    <footer style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.1)' }} className='mt-8 px-6 py-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-6'>
          <div>
            <h3 className='text-white font-black text-lg mb-3' style={{ fontFamily: 'Apple Chancery, cursive' }}>Coach Connect</h3>
            <p className='text-white/60 text-sm'>Connecting UMD students with coaches for private lessons.</p>
          </div>
          <div>
            <h4 className='text-white font-bold mb-3 text-sm uppercase tracking-wider'>Platform</h4>
            <div className='space-y-2'>
              <a href='/home' className='block text-white/70 text-sm hover:text-white transition-colors'>Sign Up</a>
              <a href='/about' className='block text-white/70 text-sm hover:text-white transition-colors'>About</a>
              <a href='/' className='block text-white/70 text-sm hover:text-white transition-colors'>Sign In</a>
            </div>
          </div>
          <div>
            <h4 className='text-white font-bold mb-3 text-sm uppercase tracking-wider'>Features</h4>
            <div className='space-y-2'>
              <span className='block text-white/70 text-sm'>Find Coaches</span>
              <span className='block text-white/70 text-sm'>Find Students</span>
              <span className='block text-white/70 text-sm'>Private Lessons</span>
              <span className='block text-white/70 text-sm'>IM Leagues</span>
            </div>
          </div>
          <div>
            <h4 className='text-white font-bold mb-3 text-sm uppercase tracking-wider'>Legal</h4>
            <div className='space-y-2'>
              <a href='/terms' className='block text-white/70 text-sm hover:text-white transition-colors'>Terms of Service</a>
              <a href='/privacy' className='block text-white/70 text-sm hover:text-white transition-colors'>Privacy Policy</a>
              <a href='/contact' className='block text-white/70 text-sm hover:text-white transition-colors'>Contact Us</a>
            </div>
          </div>
        </div>
        <div className='border-t border-white/10 pt-4 text-center'>
          <p className='text-white/50 text-xs'> 2026 Coach Connect. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
