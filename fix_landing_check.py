content = open("src/app/pages/Landing.tsx", "r", encoding="utf-8").read()

# Add imports
content = content.replace(
    'import { useNavigate } from "react-router";',
    'import { useNavigate } from "react-router";\nimport { auth } from "../firebase";\nimport { getUserProfile } from "../utils/api";'
)

# Add profile check before navigating to coach onboarding
content = content.replace(
    'onClick={() => navigate("/coach/onboarding")}',
    '''onClick={async () => {
                  const user = auth.currentUser;
                  if (user) {
                    const profile = await getUserProfile(user.uid);
                    if (profile) { navigate("/results"); return; }
                  }
                  navigate("/coach/onboarding");
                }}'''
)

# Add profile check before navigating to student onboarding
content = content.replace(
    'onClick={() => navigate("/student/onboarding")}',
    '''onClick={async () => {
                  const user = auth.currentUser;
                  if (user) {
                    const profile = await getUserProfile(user.uid);
                    if (profile) { navigate("/results"); return; }
                  }
                  navigate("/student/onboarding");
                }}'''
)

open("src/app/pages/Landing.tsx", "w", encoding="utf-8").write(content)
print("Done!")
