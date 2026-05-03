content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix rate in card
content = content.replace(
    "                          <p className='text-xl font-black text-gray-900'></p>\n                          <p className='text-xs text-gray-500'>/hour</p>",
    "                          <p className='text-xl font-black text-gray-900'>${coach.rate || '0'}</p>\n                          <p className='text-xs text-gray-500'>/hour</p>"
)

# Fix rate in dialog
content = content.replace(
    "                      <p className='text-3xl font-black'></p>\n                      <p className='text-sm text-gray-500'>/hour</p>",
    "                      <p className='text-3xl font-black'>${selectedCoach.rate || '0'}</p>\n                      <p className='text-sm text-gray-500'>/hour</p>"
)

# Fix clear button to be more visible - red box
content = content.replace(
    "style={{ background: 'rgba(255,255,255,0.3)', color: 'white', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.5)' }}",
    "style={{ background: 'rgba(220,50,50,0.4)', color: '#ffaaaa', cursor: 'pointer', border: '1px solid rgba(255,100,100,0.6)' }}"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
