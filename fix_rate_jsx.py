content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix rate in card
content = content.replace(
    "                          <p className='text-xl font-black text-gray-900'></p>\n                          <p className='text-xs text-gray-500'>/hour</p>",
    "                          <p className='text-xl font-black text-gray-900'>{coach.rate || '0'}/hr</p>"
)

# Fix rate in dialog  
content = content.replace(
    "                      <p className='text-3xl font-black'></p>\n                      <p className='text-sm text-gray-500'>/hour</p>",
    "                      <p className='text-3xl font-black'>{selectedCoach.rate || '0'}<span className='text-lg font-normal text-gray-500'>/hr</span></p>"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
