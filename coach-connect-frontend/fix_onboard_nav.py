# Fix student onboarding - go to login after signup
content = open("src/app/pages/StudentOnboarding.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "navigate(\"/results\", { state: { sports: formData.interests } });",
    "navigate(\"/\");"
)
open("src/app/pages/StudentOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Student fixed!")

# Fix coach onboarding - go to login after signup  
content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "navigate(\"/my-students\", {",
    "navigate(\"/\"); // "
)
open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Coach fixed!")
