content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix handleConnect to navigate to conversation
content = content.replace(
    "  const handleConnect = (coach: Coach) => {\n    alert(`Connection request sent to ${coach.name}! They will receive your contact information.`);\n  };",
    """  const handleConnect = (coach: Coach) => {
    // Save coach name so messages page can look it up
    localStorage.setItem('cc_user_' + coach.id, coach.name);
    // Save current user name for coach to see
    if (auth.currentUser) {
      localStorage.setItem('cc_user_' + auth.currentUser.uid, auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Student');
    }
    navigate('/conversation/' + coach.id, { state: { userName: coach.name } });
  };"""
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
