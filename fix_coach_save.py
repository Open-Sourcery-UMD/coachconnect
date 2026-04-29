content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "          // Navigate to coach's student view\n          navigate(\"/my-students\", {",
    "          // Save to backend\n          try { await saveCoachToDB(formData); } catch(e) { console.error('Coach save error:', e); }\n\n          // Navigate to coach's student view\n          navigate(\"/my-students\", {"
)
content = content.replace(
    "const handleNext = () => {",
    "const handleNext = async () => {",
    1
)
open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Done!")
