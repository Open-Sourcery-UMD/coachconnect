content = open("src/app/pages/StudentOnboarding.tsx", "r", encoding="utf-8").read()

# Add import
if "saveStudentToDB" not in content:
    content = content.replace(
        'import { useNavigate } from "react-router";',
        'import { useNavigate } from "react-router";\nimport { saveStudentToDB } from "../utils/api";'
    )

# Add API call before navigate
content = content.replace(
    'navigate("/results", { state: { sports: formData.interests } });',
    'try { await saveStudentToDB(formData); } catch(e) { console.error(e); }\n        navigate("/results", { state: { sports: formData.interests } });'
)

# Make handleNext async
content = content.replace(
    "const handleNext = () => {",
    "const handleNext = async () => {",
    1
)

open("src/app/pages/StudentOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Done!")
