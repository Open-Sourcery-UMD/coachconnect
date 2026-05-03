content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix checkmark - use a proper checkmark instead of "v"
content = content.replace(
    "{selectedSports.includes(sport) && <span className='text-white text-xs font-bold'>v</span>}",
    "{selectedSports.includes(sport) && <span className='text-white text-xs font-bold'>?</span>}"
)

# Fix sidebar background to lighter
content = content.replace(
    "style={{ background: 'rgba(150,0,0,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)' }}",
    "style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.4)' }}"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
