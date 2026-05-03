content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()

# Fix the broken navigate - restore original but redirect to login
content = content.replace(
    'navigate("/"); // ',
    'navigate("/"); //'
)

# Remove leftover state object that was part of old navigate
import re
content = re.sub(r'navigate\("/"\); //\s*\{\s*state: \{[^}]+\}\s*\}', 'navigate("/");', content)

open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Done!")
