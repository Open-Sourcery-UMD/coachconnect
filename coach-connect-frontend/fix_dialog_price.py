content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Find and fix the dialog header to add rate below name
old = "                  <div className='text-right'>\n                    <p className='text-xs text-gray-400'>from</p>\n                    <p className='text-2xl font-black'>${selectedCoach.rate || '0'}<span className=\"text-sm font-normal text-gray-500\">/hr</span></p>\n                  </div>"

new = "                  <div className='text-right'>\n                    <p className='text-xs text-gray-400 mb-1'>pricing</p>\n                    <p className='text-2xl font-black' style={{ color: \"#E21833\" }}>${selectedCoach.rate || \"0\"}<span className='text-sm font-normal text-gray-500'>/hr</span></p>\n                  </div>"

if old in content:
    content = content.replace(old, new)
    print("Fixed!")
else:
    # Try to find what is there
    idx = content.find("text-right")
    while idx != -1:
        snippet = content[idx:idx+200]
        if "rate" in snippet or "font-black" in snippet:
            print("Found at:", idx)
            print(repr(snippet))
            break
        idx = content.find("text-right", idx+1)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
