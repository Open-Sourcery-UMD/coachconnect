content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()
content = content.replace("const handleNext = () => {", "const handleNext = async () => {", 1)
open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Done!")
