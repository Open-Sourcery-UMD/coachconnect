import re
content = open("src/app/pages/StudentOnboarding.tsx", "r", encoding="utf-8").read()

if 'import { auth }' not in content:
    content = content.replace(
        'import { useNavigate } from "react-router";',
        'import { useNavigate } from "react-router";\nimport { auth } from "../firebase";'
    )

old_pattern = r'// Save student data to localStorage\s*\n\s*const students = JSON\.parse\(localStorage\.getItem\("students"\) \|\| "\[\]"\);\s*\n\s*students\.push\(\{[^}]+\}\);\s*\n\s*localStorage\.setItem\("students", JSON\.stringify\(students\)\);'

new = '''// Save student data to backend API
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to complete onboarding.");
        return;
      }
      const token = await user.getIdToken();

      await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          auth0_id: user.uid,
          email: user.email || formData.email,
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          role: "student",
          interests: formData.interests,
          level: formData.level,
          goals: formData.goals,
          budget: formData.budget,
          preferred_times: formData.preferredTimes || [],
          graduation_year: formData.graduationYear,
        })
      });'''

result = re.sub(old_pattern, new, content, flags=re.DOTALL)
if result != content:
    print("Replaced successfully!")
else:
    print("No match found")
open("src/app/pages/StudentOnboarding.tsx", "w", encoding="utf-8").write(result)
