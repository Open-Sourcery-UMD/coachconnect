content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()

old = "        // Navigate to coach's student view"
new = "        // Save to backend\n          try { await saveCoachToDB(formData); } catch(e) { console.error('Coach save error:', e); }\n\n          // Navigate to coach's student view"

if old in content:
    content = content.replace(old, new, 1)
    print("Replaced successfully!")
else:
    print("Not found - checking...")
    idx = content.find("Navigate to coach")
    print("Found at index:", idx)
    print("Context:", repr(content[idx-50:idx+50]))

open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write(content)
