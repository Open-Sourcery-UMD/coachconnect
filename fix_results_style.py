content = open("src/app/pages/Results.tsx", "r", encoding="utf-8", errors="ignore").read()

content = content.replace(
    "style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}",
    "style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}"
)
content = content.replace(
    "className='bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-20'",
    "className='px-6 py-4 flex items-center justify-between sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}"
)
content = content.replace(
    "className='text-2xl font-black text-gray-900'",
    "className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}"
)
content = content.replace(
    """        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full bg-[#E21833] flex items-center justify-center'>
            <span className='text-white font-black text-sm'>CC</span>
          </div>
          <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Coach Connect</h1>
        </div>""",
    "        <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Coach Connect</h1>"
)
content = content.replace("className='text-gray-500 text-sm font-medium'", "className='text-white/80 text-sm font-medium'")
content = content.replace("className='border-red-200 text-red-600 hover:bg-red-50'", "className='border-white/30 text-white hover:bg-white/20'")
content = content.replace(
    "className='bg-white rounded-2xl shadow-sm p-5 sticky top-20 space-y-5'",
    "className='rounded-2xl p-5 sticky top-20 space-y-5' style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}"
)
content = content.replace("className='font-bold text-gray-800'", "className='font-bold text-white'")
content = content.replace("className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-3'", "className='text-xs font-bold text-white/60 uppercase tracking-wider mb-3'")
content = content.replace("className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'", "className='text-xs font-bold text-white/60 uppercase tracking-wider mb-2'")
content = content.replace("className='text-sm text-gray-700'", "className='text-sm text-white/90'")
content = content.replace("Max Rate", "Max Pricing ($/hr)")
content = content.replace(
    "className='w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400'",
    "className='w-full rounded-lg px-3 py-2 text-sm focus:outline-none' style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
