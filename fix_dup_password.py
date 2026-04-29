content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()
# Find and fix duplicate password key
import re
# Replace double password entries with single one
content = re.sub(r'password: "",\s*\n\s*password: "",', 'password: "",', content)
open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Done!")
