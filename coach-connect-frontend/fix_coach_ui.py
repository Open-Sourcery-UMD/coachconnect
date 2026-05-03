content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

# Remove question mark from accepted button
content = content.replace(
    "{accepted ? 'Accepted ?' : 'Accept Student'}",
    "{accepted ? 'Accepted' : 'Accept Student'}"
)

# Move sport filters above the tab content - put them right after the tab buttons
content = content.replace(
    "      <div className='px-6 pt-4 flex gap-4'>",
    "      <div className='px-6 pt-4 flex flex-col gap-4'>"
)

# Move sport filters outside the tab content to be always visible
content = content.replace(
    """      {activeTab === 'myStudents' ? (
        <div className='max-w-7xl mx-auto px-6 py-4'>
          {!loading && allSports.length > 1 && (
            <div className='flex flex-wrap gap-2 mb-6'>
              {allSports.map(sport => (
                <button key={sport} onClick={() => setActiveSport(sport)}
                  className='px-4 py-1.5 rounded-full text-sm font-semibold transition-all'
                  style={{ background: activeSport === sport ? '#FFD200' : 'rgba(255,255,255,0.2)', color: activeSport === sport ? '#333' : 'white', cursor: 'pointer', border: 'none' }}>
                  {sport}
                </button>
              ))}
            </div>
          )}""",
    """      {!loading && allSports.length > 1 && activeTab === 'myStudents' && (
        <div className='px-6 pb-2 flex flex-wrap gap-2'>
          {allSports.map(sport => (
            <button key={sport} onClick={() => setActiveSport(sport)}
              className='px-4 py-1.5 rounded-full text-sm font-semibold transition-all'
              style={{ background: activeSport === sport ? '#FFD200' : 'rgba(255,255,255,0.2)', color: activeSport === sport ? '#333' : 'white', cursor: 'pointer', border: 'none' }}>
              {sport}
            </button>
          ))}
        </div>
      )}

      {activeTab === 'myStudents' ? (
        <div className='max-w-7xl mx-auto px-6 py-4'>"""
)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
