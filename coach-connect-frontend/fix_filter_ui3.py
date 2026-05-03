content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix duplicate style on clear button
content = content.replace(
    "className='w-full text-sm font-bold py-2 rounded-lg' style={{ background: 'rgba(255,255,255,0.3)', color: 'white', cursor: 'pointer', border: 'none' }} style={{ cursor: 'pointer', background: 'none', border: 'none' }}",
    "className='w-full text-sm font-bold py-2 rounded-lg' style={{ background: 'rgba(255,255,255,0.3)', color: 'white', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.5)' }}"
)

# Fix sport checkbox to match level radio style (filled circle/square)
content = content.replace(
    """                    <div onClick={() => toggleSport(sport)} className='w-4 h-4 rounded border-2 flex items-center justify-center transition-all'
                      style={{ background: selectedSports.includes(sport) ? '#E21833' : 'rgba(255,255,255,0.15)', borderColor: selectedSports.includes(sport) ? '#E21833' : 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                    </div>""",
    """                    <div onClick={() => toggleSport(sport)} className='w-4 h-4 rounded border-2 flex items-center justify-center transition-all'
                      style={{ background: selectedSports.includes(sport) ? '#FFD200' : 'transparent', borderColor: selectedSports.includes(sport) ? '#FFD200' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                      {selectedSports.includes(sport) && <div className='w-2 h-2 rounded-sm' style={{ background: '#333' }}></div>}
                    </div>"""
)

# Fix max rate input to not go below 0
content = content.replace(
    "onChange={e => setMaxRate(e.target.value)}",
    "onChange={e => { const val = e.target.value; if (val === '' || parseFloat(val) >= 0) setMaxRate(val); }}"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
