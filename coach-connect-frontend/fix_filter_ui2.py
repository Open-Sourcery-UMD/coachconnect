content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix checkmark - remove the checkmark character, just use filled background
content = content.replace(
    "{selectedSports.includes(sport) && <span className='text-white text-xs font-bold'>v</span>}",
    ""
)
content = content.replace(
    "{selectedSports.includes(sport) && <span className='text-white text-xs font-bold'>checkmark</span>}",
    ""
)
content = content.replace(
    "{selectedSports.includes(sport) && <span className='text-white text-xs font-bold'>?</span>}",
    ""
)

# Fix rate display to always show number
content = content.replace(
    "        <p className='text-xl font-black text-gray-900'>${coach.rate && coach.rate !== '0' ? coach.rate : 'TBD'}</p>",
    "        <p className='text-xl font-black text-gray-900'>${coach.rate || '0'}</p>"
)
content = content.replace(
    "                    <p className='text-3xl font-black'>${selectedCoach.rate && selectedCoach.rate !== '0' ? selectedCoach.rate : 'TBD'}<span className='text-lg font-normal text-gray-600'>/hour</span></p>",
    "                    <p className='text-3xl font-black'>${selectedCoach.rate || '0'}<span className='text-lg font-normal text-gray-600'>/hour</span></p>"
)

# Fix max rate filter - rate is stored as string so need proper comparison
content = content.replace(
    "if (maxRate && parseFloat(coach.rate || '0') > parseFloat(maxRate)) return false;",
    "if (maxRate && parseFloat(maxRate) > 0 && parseFloat(coach.rate || '0') > parseFloat(maxRate)) return false;"
)

# Fix clear all filters visibility
content = content.replace(
    "className='w-full text-sm text-red-500 hover:text-red-700 font-semibold'",
    "className='w-full text-sm font-bold py-2 rounded-lg' style={{ background: 'rgba(255,255,255,0.3)', color: 'white', cursor: 'pointer', border: 'none' }}"
)

# Fix max rate input to not go below 0
content = content.replace(
    "className='w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400'",
    "className='w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400' min='0'"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
