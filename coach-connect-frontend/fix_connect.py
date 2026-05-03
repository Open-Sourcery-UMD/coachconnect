content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "  const handleConnect = (coach: Coach) => { alert('Connection request sent to ' + coach.name + '!'); setIsProfileOpen(false); };",
    """  const handleConnect = (coach: Coach) => {
    localStorage.setItem('cc_user_' + coach.id, coach.name);
    if (auth.currentUser) {
      localStorage.setItem('cc_user_' + auth.currentUser.uid, auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Student');
    }
    setIsProfileOpen(false);
    navigate('/conversation/' + coach.id, { state: { userName: coach.name } });
  };"""
)
open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
