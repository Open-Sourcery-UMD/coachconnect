content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix level filter - competition_level is an array
content = content.replace(
    "if (selectedLevel && !(coach.competition_level || []).includes(selectedLevel)) return false;",
    "if (selectedLevel && !(coach.competition_level || []).some((l: string) => l.toLowerCase() === selectedLevel.toLowerCase())) return false;"
)

# Fix card background to be more distinct
content = content.replace(
    "className='bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100'",
    "className='rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden' style={{ background: 'rgba(255,255,255,0.92)', border: '2px solid rgba(255,255,255,0.6)' }}"
)

# Fix sidebar background to be more distinct
content = content.replace(
    "className='rounded-2xl p-5 sticky top-20 space-y-5' style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}",
    "className='rounded-2xl p-5 sticky top-20 space-y-5' style={{ background: 'rgba(150,0,0,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)' }}"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
