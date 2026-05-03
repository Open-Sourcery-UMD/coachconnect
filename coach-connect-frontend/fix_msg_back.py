content = open("src/app/pages/Messages.tsx", "r", encoding="utf-8").read()

# Import getUserProfile
content = content.replace(
    "import { auth } from '../firebase';",
    "import { auth } from '../firebase';\nimport { getUserProfile } from '../utils/api';"
)

# Fix back button to check role
content = content.replace(
    "onClick={() => navigate('/results')}",
    """onClick={async () => {
          const user = auth.currentUser;
          if (user) {
            const profile = await getUserProfile(user.uid);
            if (profile?.role === 'coach') { navigate('/my-students'); return; }
          }
          navigate('/results');
        }}"""
)

open("src/app/pages/Messages.tsx", "w", encoding="utf-8").write(content)
print("Done!")
