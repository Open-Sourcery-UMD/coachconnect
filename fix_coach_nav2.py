content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()

# Fix first navigate - remove the leftover state lines
content = content.replace(
    'navigate("/"); //\n          state: { coachId: newCoach.id },\n        });',
    'navigate("/");'
)

open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Done!")
