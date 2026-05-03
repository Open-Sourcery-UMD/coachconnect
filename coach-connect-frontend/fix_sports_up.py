content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

# Remove sport filters from inside tab content (both instances)
old_filters = """          {!loading && allSports.length > 1 && (
            <div className='flex flex-wrap gap-2 mb-6'>
              {allSports.map(sport => (
                <button key={sport} onClick={() => setActiveSport(sport)}
                  className='px-4 py-1.5 rounded-full text-sm font-semibold transition-all'
                  style={{ background: activeSport === sport ? '#FFD200' : 'rgba(255,255,255,0.2)', color: activeSport === sport ? '#333' : 'white', cursor: 'pointer', border: 'none' }}>
                  {sport}
                </button>
              ))}
            </div>
          )}"""

content = content.replace(old_filters, "", 1)
content = content.replace(old_filters, "", 1)

# Add filters between tabs and content
content = content.replace(
    "      {activeTab === 'myStudents' ? (",
    """      {!loading && allSports.length > 1 && (
        <div className='px-6 pb-3 flex flex-wrap gap-2'>
          {allSports.map(sport => (
            <button key={sport} onClick={() => setActiveSport(sport)}
              className='px-4 py-1.5 rounded-full text-sm font-semibold transition-all'
              style={{ background: activeSport === sport ? '#FFD200' : 'rgba(255,255,255,0.2)', color: activeSport === sport ? '#333' : 'white', cursor: 'pointer', border: 'none' }}>
              {sport}
            </button>
          ))}
        </div>
      )}

      {activeTab === 'myStudents' ? ("""
)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
