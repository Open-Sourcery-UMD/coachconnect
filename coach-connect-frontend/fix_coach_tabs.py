content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

# Remove Interested Students tab button
content = content.replace(
    """        <button onClick={() => setActiveTab('interested')}
          className='px-6 py-2 rounded-full font-bold text-sm transition-all'
          style={{ background: activeTab === 'interested' ? 'white' : 'rgba(255,255,255,0.2)', color: activeTab === 'interested' ? '#E21833' : 'white', cursor: 'pointer', border: 'none' }}>
          Interested Students
        </button>""",
    ""
)

# Change default tab to myStudents
content = content.replace(
    "  const [activeTab, setActiveTab] = useState<'interested' | 'myStudents' | 'calendar'>('interested');",
    "  const [activeTab, setActiveTab] = useState<'myStudents' | 'calendar'>('myStudents');"
)

# Move sport filter tabs inside myStudents section and show all students with sport filter
# Replace myStudents content to include sport filter + all students
content = content.replace(
    """      ) : activeTab === 'myStudents' ? (
        <div className='max-w-7xl mx-auto px-6 py-4'>
          {myStudents.length === 0 ? (
            <div className='rounded-2xl p-8 text-center' style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <p className='text-white text-lg'>No accepted students yet.</p>
              <p className='text-white/70 text-sm mt-1'>Accept students from conversations to see them here.</p>
            </div>
          ) : (
            <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {myStudents.map((conn) => (
                <div key={conn.id} className='rounded-2xl p-5' style={{ background: 'rgba(255,255,255,0.95)' }}>
                  <div className='flex gap-3 mb-3'>
                    <div className='w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-black'
                      style={{ background: 'linear-gradient(135deg, #E21833, #FFD200)' }}>
                      {conn.student_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className='font-bold text-gray-900'>{conn.student_name}</h3>
                      <p className='text-xs text-gray-500'>{conn.student_email}</p>
                      {conn.sport && <span className='px-2 py-0.5 rounded-full text-xs font-semibold' style={{ background: '#FFF3F4', color: '#E21833' }}>{conn.sport}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>""",
    """      ) : activeTab === 'myStudents' ? (
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
          )}
          {loading ? (
            <div className='flex items-center justify-center h-64'><p className='text-white text-lg'>Loading...</p></div>
          ) : filteredStudents.length === 0 ? (
            <Alert className='border-white/20' style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Users className='h-4 w-4 text-white' />
              <AlertTitle className='text-white'>No Students Found</AlertTitle>
              <AlertDescription className='text-white/80'>No students have signed up yet!</AlertDescription>
            </Alert>
          ) : (
            <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {filteredStudents.map((student) => {
                const badge = getLevelBadge(student.level);
                const isAccepted = myStudents.some(c => c.student_id === student.auth0_id);
                return (
                  <div key={student.id} className='rounded-2xl overflow-hidden' style={{ background: 'rgba(255,255,255,0.95)' }}>
                    <div className='p-5'>
                      <div className='flex gap-3 mb-3'>
                        <div className='w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xl font-black'
                          style={{ background: 'linear-gradient(135deg, #E21833, #FFD200)' }}>
                          {student.name.charAt(0)}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2'>
                            <h3 className='text-base font-bold text-gray-900 truncate'>{student.name}</h3>
                            {isAccepted && <span className='text-xs px-2 py-0.5 rounded-full font-bold' style={{ background: '#E8F5E9', color: '#2E7D32' }}>My Student</span>}
                          </div>
                          <p className='text-xs text-gray-500'>Class of {student.graduation_year || 'N/A'}</p>
                          <span className='px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5 inline-block' style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
                        </div>
                        <div className='text-right'>
                          <p className='text-xs text-gray-400'>budget</p>
                          <p className='text-lg font-black text-gray-900'>${student.budget || '0'}<span className='text-xs text-gray-400'>/hr</span></p>
                        </div>
                      </div>
                      {student.goals && <p className='text-xs text-gray-600 mb-3 line-clamp-2 italic'>{student.goals}</p>}
                      <div className='flex flex-wrap gap-1 mb-3'>
                        {student.interests.map((interest: string) => (
                          <span key={interest} className='px-2 py-0.5 rounded-full text-xs font-semibold' style={{ background: '#FFF3F4', color: '#E21833' }}>{interest}</span>
                        ))}
                      </div>
                      <Button className='w-full font-semibold rounded-xl text-sm' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={() => handleViewProfile(student)}>
                        View Profile
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>"""
)

# Remove the old Interested Students tab content
content = content.replace(
    "      {activeTab === 'interested' ? (\n        <div className='max-w-7xl mx-auto px-6 py-4'>\n          {!loading && allSports.length > 1 && (\n            <div className='flex flex-wrap gap-2 mb-6'>\n              {allSports.map(sport => (\n                <button key={sport} onClick={() => setActiveSport(sport)}\n                  className='px-4 py-1.5 rounded-full text-sm font-semibold transition-all'\n                  style={{ background: activeSport === sport ? '#FFD200' : 'rgba(255,255,255,0.2)', color: activeSport === sport ? '#333' : 'white', cursor: 'pointer', border: 'none' }}>\n                  {sport}\n                </button>\n              ))}\n            </div>\n          )}\n          {loading ? (\n            <div className='flex items-center justify-center h-64'><p className='text-white text-lg'>Loading students...</p></div>\n          ) : filteredStudents.length === 0 ? (\n            <Alert className='border-white/20' style={{ background: 'rgba(255,255,255,0.15)' }}>\n              <Users className='h-4 w-4 text-white' />\n              <AlertTitle className='text-white'>No Students Found</AlertTitle>\n              <AlertDescription className='text-white/80'>No students have signed up yet!</AlertDescription>\n            </Alert>\n          ) : (\n            <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>\n              {filteredStudents.map((student) => {\n                const badge = getLevelBadge(student.level);\n                return (\n                  <div key={student.id} className='rounded-2xl overflow-hidden' style={{ background: 'rgba(255,255,255,0.95)' }}>\n                    <div className='p-5'>\n                      <div className='flex gap-3 mb-3'>\n                        <div className='w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xl font-black'\n                          style={{ background: 'linear-gradient(135deg, #E21833, #FFD200)' }}>\n                          {student.name.charAt(0)}\n                        </div>\n                        <div className='flex-1 min-w-0'>\n                          <h3 className='text-base font-bold text-gray-900 truncate'>{student.name}</h3>\n                          <p className='text-xs text-gray-500'>Class of {student.graduation_year || 'N/A'}</p>\n                          <span className='px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5 inline-block' style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>\n                        </div>\n                        <div className='text-right'>\n                          <p className='text-xs text-gray-400'>budget</p>\n                          <p className='text-lg font-black text-gray-900'>${student.budget || '0'}<span className='text-xs text-gray-400'>/hr</span></p>\n                        </div>\n                      </div>\n                      {student.goals && <p className='text-xs text-gray-600 mb-3 line-clamp-2 italic'>{student.goals}</p>}\n                      <div className='flex flex-wrap gap-1 mb-3'>\n                        {student.interests.map(interest => (\n                          <span key={interest} className='px-2 py-0.5 rounded-full text-xs font-semibold' style={{ background: '#FFF3F4', color: '#E21833' }}>{interest}</span>\n                        ))}\n                      </div>\n                      <Button className='w-full font-semibold rounded-xl text-sm' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={() => handleViewProfile(student)}>\n                        View Profile\n                      </Button>\n                    </div>\n                  </div>\n                );\n              })}\n            </div>\n          )}\n        </div>\n      ) : activeTab === 'myStudents' ?",
    "      {activeTab === 'myStudents' ?"
)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
