content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Find and replace using index
old = "<p className='text-xl font-black text-gray-900'></p>"
new = "<p className='text-xl font-black text-gray-900'>{coach.rate || '0'}/hr</p>"

if old in content:
    content = content.replace(old, new)
    print("Rate card fixed!")
else:
    print("Not found, checking...")
    idx = content.find("text-xl font-black text-gray-900")
    print(repr(content[idx:idx+60]))

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
