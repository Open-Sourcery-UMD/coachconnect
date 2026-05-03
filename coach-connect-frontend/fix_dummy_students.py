content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

# Replace fetchStudents with dummy data
content = content.replace(
    """  const fetchStudents = async () => {
    setLoading(true);
    try { const data = await getStudents(); setStudents(Array.isArray(data) ? data : []); }
    catch (err) { console.error(err); setStudents([]); }
    setLoading(false);
  };""",
    """  const fetchStudents = async () => {
    setLoading(true);
    const dummy = [
      { id: "s1", auth0_id: "s1", name: "Alex Johnson", email: "alex@terpmail.umd.edu", phone: "301-555-0101", interests: ["Soccer", "Basketball"], goals: "Improve my shooting accuracy and ball control", level: "beginner", budget: "30", preferred_times: ["Monday 5pm-6pm", "Wednesday 5pm-6pm"], graduation_year: "2027", role: "student" },
      { id: "s2", auth0_id: "s2", name: "Maya Patel", email: "maya@umd.edu", phone: "240-555-0202", interests: ["Volleyball", "Swimming"], goals: "Train for the club volleyball team tryouts", level: "intermediate", budget: "45", preferred_times: ["Tuesday 6pm-7pm", "Saturday 10am-11am"], graduation_year: "2026", role: "student" },
      { id: "s3", auth0_id: "s3", name: "Jordan Lee", email: "jlee@terpmail.umd.edu", phone: "410-555-0303", interests: ["Soccer", "Track"], goals: "Build endurance and improve sprint times", level: "advanced", budget: "60", preferred_times: ["Friday 4pm-5pm", "Sunday 9am-10am"], graduation_year: "2025", role: "student" },
    ];
    setStudents(dummy);
    setLoading(false);
  };"""
)

# Replace fetchCoachProfile sports with hardcoded sports
content = content.replace(
    """  useEffect(() => {
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

  const allSports = ['All', ...coachSports];""",
    "  const allSports = ['All', 'Soccer', 'Basketball', 'Volleyball', 'Swimming', 'Track'];"
)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
