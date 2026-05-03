content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

old = """                    <div onClick={() => toggleSport(sport)} className='w-4 h-4 rounded border-2 flex items-center justify-center transition-all'
                        style={{ background: selectedSports.includes(sport) ? '#E21833' : 'white', borderColor: selectedSports.includes(sport) ? '#E21833' : '#ddd', cursor: 'pointer' }}>
                        
                      </div>"""

new = """                    <div onClick={() => toggleSport(sport)} className='w-4 h-4 rounded border-2 flex items-center justify-center transition-all'
                        style={{ background: selectedSports.includes(sport) ? '#FFD200' : 'transparent', borderColor: selectedSports.includes(sport) ? '#FFD200' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                      </div>"""

if old in content:
    content = content.replace(old, new)
    print("Sport checkbox fixed!")
else:
    print("Not found - check spacing")

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
