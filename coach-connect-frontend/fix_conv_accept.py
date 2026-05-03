content = open("src/app/pages/Conversation.tsx", "r", encoding="utf-8").read()

# Add import
content = content.replace(
    "import { auth } from '../firebase';",
    "import { auth } from '../firebase';\nimport { createConnection, getUserProfile } from '../utils/api';"
)

# Add state and accept handler after currentUserId
content = content.replace(
    "  const currentUserId = auth.currentUser?.uid || '';",
    """  const currentUserId = auth.currentUser?.uid || '';
  const [isCoach, setIsCoach] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const profile = await getUserProfile(user.uid);
      if (profile?.role === 'coach') setIsCoach(true);
    };
    checkRole();
  }, []);

  const handleAccept = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const coachProfile = await getUserProfile(user.uid);
    const studentProfile = await getUserProfile(userId!);
    await createConnection({
      coach_id: user.uid,
      student_id: userId,
      coach_name: coachProfile?.name || 'Coach',
      student_name: studentProfile?.name || userName,
      student_email: studentProfile?.email || '',
      sport: coachProfile?.expertise?.[0] || null
    });
    setAccepted(true);
    alert(userName + ' has been added to My Students!');
  };"""
)

# Add Accept button in header next to name
content = content.replace(
    "          <h2 className='text-lg font-bold text-white'>{userName}</h2>",
    """          <h2 className='text-lg font-bold text-white'>{userName}</h2>
          {isCoach && (
            <button onClick={handleAccept} disabled={accepted}
              className='text-xs px-3 py-1 rounded-full font-bold'
              style={{ background: accepted ? 'rgba(255,255,255,0.3)' : '#FFD200', color: accepted ? 'white' : '#333', border: 'none', cursor: accepted ? 'default' : 'pointer' }}>
              {accepted ? 'Accepted ?' : 'Accept Student'}
            </button>
          )}"""
)

open("src/app/pages/Conversation.tsx", "w", encoding="utf-8").write(content)
print("Done!")
