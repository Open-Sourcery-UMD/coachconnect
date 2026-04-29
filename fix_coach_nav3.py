content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()

content = content.replace(
    'navigate("/"); //\n                state: { coachId: newCoach.id },\n              });',
    'navigate("/");'
)

open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Done!")
