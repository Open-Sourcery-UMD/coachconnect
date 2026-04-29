content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()

content = content.replace(
    "import { auth, googleProvider } from '../firebase'",
    "import { auth, googleProvider } from '../firebase'\nimport { getUserProfile } from '../utils/api'"
)

content = content.replace(
    "await signInWithEmailAndPassword(auth, email, password)\n      navigate('/results')",
    """const cred = await signInWithEmailAndPassword(auth, email, password)
      const profile = await getUserProfile(cred.user.uid)
      if (profile) { navigate('/results') } else { navigate('/home') }"""
)

content = content.replace(
    "await signInWithPopup(auth, googleProvider)\n      navigate('/results')",
    """const result = await signInWithPopup(auth, googleProvider)
      const profile = await getUserProfile(result.user.uid)
      if (profile) { navigate('/results') } else { navigate('/home') }"""
)

open("src/app/pages/Login.tsx", "w", encoding="utf-8").write(content)
print("Done!")
