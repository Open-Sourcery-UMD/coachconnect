content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()

# Add import
if "saveCoachToDB" not in content:
    content = content.replace(
        'import { useNavigate } from "react-router";',
        'import { useNavigate } from "react-router";\nimport { saveCoachToDB } from "../utils/api";'
    )

# Add API call before navigate
content = content.replace(
    '// Navigate to coach\'s student view\n          navigate("/my-students", {',
    '// Save to backend\n          try { await saveCoachToDB(formData); } catch(e) { console.error(e); }\n\n          // Navigate to coach\'s student view\n          navigate("/my-students", {'
)

# Make handleNext async
content = content.replace(
    "const handleNext = () => {",
    "const handleNext = async () => {",
    1
)

open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Done!")
