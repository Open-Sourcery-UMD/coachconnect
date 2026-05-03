# Fix MyStudents - fetch name from MongoDB
content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

# Replace static coachName with state
content = content.replace(
    "  const coachName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0]?.replace('.', ' ').replace(/\\b\\w/g, (c: string) => c.toUpperCase()) || 'Coach';",
    "  const [userName, setUserName] = useState<string>('');"
)

# Add fetch in the fetchStudents or a separate useEffect
content = content.replace(
    "  useEffect(() => { fetchStudents(); }, []);",
    """  useEffect(() => { 
    fetchStudents(); 
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const res = await fetch('http://localhost:8000/users/' + user.uid);
      const data = await res.json();
      if (data.name) setUserName(data.name.split(' ')[0]);
    } catch (err) { console.error(err); }
  };"""
)

content = content.replace(
    "<p className='text-white/70 text-sm'>Welcome Back</p>",
    "<p className='text-white/70 text-sm'>Welcome Back{userName ? ', ' + userName : ''}</p>"
)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("MyStudents fixed!")

# Fix Results - add welcome back with name
content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

if "Welcome Back" not in content:
    content = content.replace(
        "<p className='text-white/80 text-sm font-medium'>{loading ? 'Loading...' : filteredCoaches.length + ' coaches found'}</p>",
        "<p className='text-white/70 text-sm'>Welcome Back{userName ? ', ' + userName : ''}</p>\n        <p className='text-white/80 text-sm font-medium'>{loading ? 'Loading...' : filteredCoaches.length + ' coaches found'}</p>"
    )

# Add userName state and fetch to Results
if "fetchUserName" not in content:
    content = content.replace(
        "  const [loading, setLoading] = useState(true);",
        "  const [loading, setLoading] = useState(true);\n  const [userName, setUserName] = useState<string>('');"
    )
    content = content.replace(
        "  useEffect(() => { fetchCoaches(); }, []);",
        """  useEffect(() => { 
    fetchCoaches();
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const res = await fetch('http://localhost:8000/users/' + user.uid);
      const data = await res.json();
      if (data.name) setUserName(data.name.split(' ')[0]);
    } catch (err) { console.error(err); }
  };"""
    )

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Results fixed!")
