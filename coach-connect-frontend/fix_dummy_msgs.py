content = open("src/app/pages/Messages.tsx", "r", encoding="utf-8").read()

# Add dummy data initialization
content = content.replace(
    "  useEffect(() => { loadConversations(); }, []);",
    """  useEffect(() => { 
    initDummyData();
    loadConversations(); 
  }, []);

  const initDummyData = () => {
    const existing = localStorage.getItem('cc_messages');
    if (existing && JSON.parse(existing).length > 0) return;
    const uid = auth.currentUser?.uid || 'student1';
    const dummy = [
      { id: 'dm1', senderId: uid, receiverId: 'coach_james', text: 'Hi James! I am interested in soccer coaching. Do you have availability this week?', timestamp: Date.now() - 7200000, read: true },
      { id: 'dm2', senderId: 'coach_james', receiverId: uid, text: 'Hi! Yes I have slots available Monday and Wednesday. What is your current skill level?', timestamp: Date.now() - 6900000, read: true },
      { id: 'dm3', senderId: uid, receiverId: 'coach_james', text: 'I am intermediate level, been playing for 3 years.', timestamp: Date.now() - 3600000, read: true },
      { id: 'dm4', senderId: 'coach_james', receiverId: uid, text: 'Perfect! Monday at 9am works great. See you then!', timestamp: Date.now() - 900000, read: false },
      { id: 'dm5', senderId: 'coach_sarah', receiverId: uid, text: 'Hey! I noticed you are interested in Tennis coaching. I have some great drills for beginners!', timestamp: Date.now() - 300000, read: false },
    ];
    localStorage.setItem('cc_messages', JSON.stringify(dummy));
    localStorage.setItem('cc_user_coach_james', 'James Smith');
    localStorage.setItem('cc_user_coach_sarah', 'Sarah Jones');
  };"""
)

open("src/app/pages/Messages.tsx", "w", encoding="utf-8").write(content)
print("Done!")
