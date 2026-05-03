content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

# Add sport filters between tabs and content
content = content.replace(
    "      {activeTab === 'myStudents' ? (",
    """      <div className='px-6 pb-3 flex flex-wrap gap-2'>
        {allSports.map(sport => (
          <button key={sport} onClick={() => setActiveSport(sport)}
            className='px-4 py-1.5 rounded-full text-sm font-semibold transition-all'
            style={{ background: activeSport === sport ? '#FFD200' : 'rgba(255,255,255,0.2)', color: activeSport === sport ? '#333' : 'white', cursor: 'pointer', border: 'none' }}>
            {sport}
          </button>
        ))}
      </div>

      {activeTab === 'myStudents' ? ("""
)

# Change "View Profile" to "Book Student"
content = content.replace(
    "                      <Button className='w-full font-semibold rounded-xl text-sm' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={() => handleViewProfile(student)}>\n                        View Profile\n                      </Button>",
    "                      <Button className='w-full font-semibold rounded-xl text-sm' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={() => handleViewProfile(student)}>\n                        Book Student\n                      </Button>"
)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
