content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix card - remove duplicate /hour and add dollar sign
content = content.replace(
    "<p className='text-xl font-black text-gray-900'>{coach.rate || '0'}/hr</p>\n                          <p className='text-xs text-gray-500'>/hour</p>",
    "<p className='text-xl font-black text-gray-900'>${coach.rate || '0'}<span className=\"text-xs font-normal text-gray-500\">/hr</span></p>"
)

# Fix dialog - add rate display and dollar sign
content = content.replace(
    "                    <p className='text-3xl font-black'></p>\n                      <p className='text-sm text-gray-500'>/hour</p>",
    "                    <p className='text-3xl font-black'>${selectedCoach.rate || '0'}<span className=\"text-lg font-normal text-gray-500\">/hr</span></p>"
)

# Fix rate filter - coaches with rate 0 should only show when maxRate is 0 or empty
content = content.replace(
    "if (maxRate && parseFloat(maxRate) > 0 && parseFloat(coach.rate || '0') > parseFloat(maxRate)) return false;",
    "if (maxRate !== '' && parseFloat(coach.rate || '0') > parseFloat(maxRate)) return false;"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
