content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix sport checkbox - full gold fill when selected
content = content.replace(
    "style={{ background: selectedSports.includes(sport) ? '#FFD200' : 'transparent', borderColor: selectedSports.includes(sport) ? '#FFD200' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>\n                        {selectedSports.includes(sport) && <div className='w-2 h-2 rounded-sm' style={{ background: '#333' }}></div>}",
    "style={{ background: selectedSports.includes(sport) ? '#FFD200' : 'transparent', borderColor: selectedSports.includes(sport) ? '#FFD200' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>"
)

# Fix rate in card - the JSX expression got stripped
content = content.replace(
    "                          <p className='text-xl font-black text-gray-900'>${coach.rate || '0'}</p>",
    "                          <p className='text-xl font-black text-gray-900'>{coach.rate || '0'}</p>"
)

# Fix rate in dialog
content = content.replace(
    "                      <p className='text-3xl font-black'>${selectedCoach.rate || '0'}</p>",
    "                      <p className='text-3xl font-black'>{selectedCoach.rate || '0'}</p>"
)

# Fix clear button - bright red visible
content = content.replace(
    "style={{ background: 'rgba(220,50,50,0.4)', color: '#ffaaaa', cursor: 'pointer', border: '1px solid rgba(255,100,100,0.6)' }}",
    "style={{ background: '#E21833', color: 'white', cursor: 'pointer', border: 'none' }}"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
