content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix card price - add dollar sign and spacing
content = content.replace(
    "text-right flex-shrink-0'>\n                        <p className='text-xl font-black text-gray-900'>{coach.rate || '0'}/hr</p>",
    "text-right flex-shrink-0'>\n                        <p className='text-xs text-gray-400'>from</p>\n                        <p className='text-xl font-black text-gray-900'>${coach.rate || '0'}<span className=\"text-xs font-normal text-gray-400\">/hr</span></p>"
)

# Fix dialog price - move rate below name with spacing
content = content.replace(
    "                  </div>\n                  <div className='text-right'>\n                    <p className='text-3xl font-black'>${selectedCoach.rate || '0'}/hr</p>",
    "                  </div>\n                </div>\n                <div className='flex items-center gap-2 mt-2'>\n                  <p className='text-2xl font-black'>${selectedCoach.rate || '0'}<span className=\"text-sm font-normal text-gray-500\">/hr</span></p>"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
