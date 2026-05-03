content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

content = content.replace(
    "                  </div>\n                </div>\n                <div className='flex items-center gap-2 mt-2'>\n                  <p className='text-2xl font-black'>${selectedCoach.rate || '0'}<span className=\"text-sm font-normal text-gray-500\">/hr</span></p>",
    "                  </div>\n                  <div className='text-right'>\n                    <p className='text-xs text-gray-400'>from</p>\n                    <p className='text-2xl font-black'>${selectedCoach.rate || '0'}<span className=\"text-sm font-normal text-gray-500\">/hr</span></p>\n                  </div>"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
