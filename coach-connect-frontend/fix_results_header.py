content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix header - move welcome back to left side like coach page
content = content.replace(
    "      <div className='bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>\n        <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Coach Connect</h1>\n        <p className='text-white/70 text-sm'>Welcome Back{userName ? ', ' + userName : ''}</p>\n        <p className='text-white/80 text-sm font-medium'>{loading ? 'Loading...' : filteredCoaches.length + ' coaches found'}</p>",
    "      <div className='bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-20' style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>\n        <div>\n          <h1 className='text-2xl font-black text-white' style={{ fontFamily: 'Apple Chancery, cursive' }}>Coach Connect</h1>\n          <p className='text-white/70 text-sm'>Welcome Back{userName ? ', ' + userName : ''}</p>\n        </div>\n        <p className='text-white/80 text-sm font-medium'>{loading ? 'Loading...' : filteredCoaches.length + ' coaches found'}</p>"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
