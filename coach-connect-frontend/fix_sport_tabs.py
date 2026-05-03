content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

# Change allSports to use coach profile sports instead of student sports
content = content.replace(
    "  const allSports = ['All', ...Array.from(new Set(students.flatMap(s => s.interests)))];",
    """  const [coachSports, setCoachSports] = useState<string[]>([]);

  useEffect(() => {
    const fetchCoachProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const res = await fetch('http://localhost:8000/users/' + user.uid);
        const data = await res.json();
        if (data.expertise && data.expertise.length > 0) {
          setCoachSports(data.expertise);
        }
      } catch (err) { console.error(err); }
    };
    fetchCoachProfile();
  }, []);

  const allSports = ['All', ...coachSports];"""
)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
