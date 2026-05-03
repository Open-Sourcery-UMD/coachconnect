content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix card rate display - add dollar sign and move to separate line below name
content = content.replace(
    "                        <div className='text-right flex-shrink-0'>\n                          <p className='text-xl font-black text-gray-900'>{coach.rate || '0'}/hr</p>",
    "                        <div className='text-right flex-shrink-0'>\n                          <p className='text-xs text-gray-400 mb-0.5'>from</p>\n                          <p className='text-xl font-black text-gray-900'>${coach.rate || '0'}<span className=\"text-xs font-normal text-gray-500\">/hr</span></p>"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
