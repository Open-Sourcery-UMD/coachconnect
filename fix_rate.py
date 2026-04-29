content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "        <p className='text-xl font-black text-gray-900'>${coach.rate || '50'}</p>",
    "        <p className='text-xl font-black text-gray-900'>${coach.rate && coach.rate !== '0' ? coach.rate : 'TBD'}</p>"
)
content = content.replace(
    "                    <p className='text-3xl font-black'>${selectedCoach.rate || '50'}<span className='text-lg font-normal text-gray-600'>/hour</span></p>",
    "                    <p className='text-3xl font-black'>${selectedCoach.rate && selectedCoach.rate !== '0' ? selectedCoach.rate : 'TBD'}<span className='text-lg font-normal text-gray-600'>/hour</span></p>"
)
open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
