content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()

# Fix Google login
content = content.replace(
    "await signInWithPopup(auth, googleProvider)\n      navigate('/home')",
    "await signInWithPopup(auth, googleProvider)\n      navigate('/results')"
)

# Fix email login
content = content.replace(
    "await signInWithEmailAndPassword(auth, email, password)\n      navigate('/home')",
    "await signInWithEmailAndPassword(auth, email, password)\n      navigate('/results')"
)

open("src/app/pages/Login.tsx", "w", encoding="utf-8").write(content)
print("Done!")
