content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()

if 'import { auth }' not in content:
    content = content.replace(
        'import { useNavigate } from "react-router";',
        'import { useNavigate } from "react-router";\nimport { auth } from "../firebase";'
    )

old = '// Save coach data to localStorage (without file data to avoid quota issues)'
new = '''// Save coach data to backend API
        try {
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
              role: "coach",
              expertise: formData.expertise,
              coaching_style: formData.coachingStyle,
              competition_level: formData.competitionLevel || [],
              certification: formData.certification || "",
              rate: formData.rate || "",
              availability: formData.availability || [],
            })
          });

          const newCoach = { ...formData, id: Date.now(), type: "coach" };
'''

content = content.replace(old, new, 1)
open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Done!")
