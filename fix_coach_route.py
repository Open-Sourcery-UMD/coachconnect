content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()

content = content.replace(
    "import { getUserProfile } from '../utils/api'",
    "import { getUserProfile } from '../utils/api'\nimport { getStudents } from '../utils/api'"
)

content = content.replace(
    """const cred = await signInWithEmailAndPassword(auth, email, password)
      const profile = await getUserProfile(cred.user.uid)
      if (profile) { navigate('/results') } else { navigate('/home') }""",
    """const cred = await signInWithEmailAndPassword(auth, email, password)
      const profile = await getUserProfile(cred.user.uid)
      if (profile) {
        if (profile.role === 'coach') { navigate('/my-students') }
        else { navigate('/results') }
      } else { navigate('/home') }"""
)

content = content.replace(
    """const result = await signInWithPopup(auth, googleProvider)
      const profile = await getUserProfile(result.user.uid)
      if (profile) { navigate('/results') } else { navigate('/home') }""",
    """const result = await signInWithPopup(auth, googleProvider)
      const profile = await getUserProfile(result.user.uid)
      if (profile) {
        if (profile.role === 'coach') { navigate('/my-students') }
        else { navigate('/results') }
      } else { navigate('/home') }"""
)

open("src/app/pages/Login.tsx", "w", encoding="utf-8").write(content)
print("Done!")
