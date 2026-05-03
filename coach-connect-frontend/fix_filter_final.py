content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix sport checkbox to match level style
old = """                    <div onClick={() => toggleSport(sport)} className='w-4 h-4 rounded border-2 flex items-center justify-center transition-all'
                        style={{ background: selectedSports.includes(sport) ? '#E21833' : 'white', borderColor: selectedSports.includes(sport) ? '#E21833' : '#ddd', cursor: 'pointer' }}>
                        
                      </div>"""

new = """                    <div onClick={() => toggleSport(sport)} className='w-4 h-4 rounded border-2 flex items-center justify-center transition-all'
                        style={{ background: selectedSports.includes(sport) ? '#FFD200' : 'transparent', borderColor: selectedSports.includes(sport) ? '#FFD200' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                        {selectedSports.includes(sport) && <div className='w-2 h-2 rounded-sm' style={{ background: '#333' }}></div>}
                      </div>"""

content = content.replace(old, new)

# Fix clear filters button - red text, box style
old_clear = "className='w-full text-sm text-red-500 hover:text-red-700 font-semibold'"
new_clear = "className='w-full text-sm font-bold py-2 rounded-lg mt-1' style={{ background: 'transparent', color: '#ff6b6b', cursor: 'pointer', border: '1px solid rgba(255,100,100,0.5)' }}"
content = content.replace(old_clear, new_clear)

# Fix max rate no negative
content = content.replace(
    "onChange={e => setMaxRate(e.target.value)}",
    "onChange={e => { const val = e.target.value; if (val === '' || parseFloat(val) >= 0) setMaxRate(val); }}"
)

if old in content or old_clear in content:
    print("Some replacements may have failed")
else:
    print("Done!")

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
