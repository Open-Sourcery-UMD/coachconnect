content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# 1. Fix sport checkbox to gold
import re
content = re.sub(
    r"background: selectedSports\.includes\(sport\) \? '#E21833' : 'white', borderColor: selectedSports\.includes\(sport\) \? '#E21833' : '#ddd'",
    "background: selectedSports.includes(sport) ? '#FFD200' : 'transparent', borderColor: selectedSports.includes(sport) ? '#FFD200' : 'rgba(255,255,255,0.4)'",
    content
)

# 2. Fix rate filter
content = content.replace(
    "if (maxRate && parseFloat(coach.rate || '0') > parseFloat(maxRate)) return false;",
    "if (maxRate !== '' && parseFloat(coach.rate || '0') > parseFloat(maxRate)) return false;"
)

# 3. Fix clear button visibility
content = content.replace(
    "className='w-full text-sm text-red-500 hover:text-red-700 font-semibold'",
    "className='w-full text-sm font-bold py-2 rounded-lg' style={{ background: '#E21833', color: 'white', cursor: 'pointer', border: 'none' }}"
)

# 4. Fix rate display in card - find exact text
idx = content.find("text-right flex-shrink-0")
if idx != -1:
    snippet = content[idx:idx+200]
    print("Card rate area:", repr(snippet[:150]))

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
