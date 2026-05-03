content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

content = content.replace(
    "import { getStudents } from '../utils/api';",
    "import { getStudents, getCoachConnections } from '../utils/api';"
)

# Add My Students tab
content = content.replace(
    "  const [activeTab, setActiveTab] = useState<'interested' | 'calendar'>('interested');",
    "  const [activeTab, setActiveTab] = useState<'interested' | 'myStudents' | 'calendar'>('interested');\n  const [myStudents, setMyStudents] = useState<any[]>([]);"
)

# Fetch connections when tab changes
content = content.replace(
    "  useEffect(() => { \n    fetchStudents(); \n    fetchUserName();\n  }, []);",
    """  useEffect(() => { 
    fetchStudents(); 
    fetchUserName();
    fetchMyStudents();
  }, []);

  const fetchMyStudents = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const data = await getCoachConnections(user.uid);
      setMyStudents(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };"""
)

# Add My Students tab button
content = content.replace(
    "        <button onClick={() => setActiveTab('calendar')}",
    """        <button onClick={() => setActiveTab('myStudents')}
          className='px-6 py-2 rounded-full font-bold text-sm transition-all'
          style={{ background: activeTab === 'myStudents' ? 'white' : 'rgba(255,255,255,0.2)', color: activeTab === 'myStudents' ? '#E21833' : 'white', cursor: 'pointer', border: 'none' }}>
          My Students {myStudents.length > 0 && '(' + myStudents.length + ')'}
        </button>
        <button onClick={() => setActiveTab('calendar')}"""
)

# Add My Students tab content before calendar tab
content = content.replace(
    "      ) : (\n        <div className='max-w-7xl mx-auto px-6 py-8'>\n          <div className='rounded-2xl p-8 text-center'",
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
        </div>
      ) : (
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='rounded-2xl p-8 text-center'"""
)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
