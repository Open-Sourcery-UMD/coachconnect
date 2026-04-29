content = open("src/app/pages/ForgotPassword.tsx", "r", encoding="utf-8").read()
content = content.replace(
    """    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else {
        setError('Something went wrong. Please try again.')
      }
    }""",
    """    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
      console.log('Reset email sent successfully to', email)
    } catch (err: any) {
      console.error('Reset email error:', err.code, err.message)
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else {
        setError('Error: ' + err.message)
      }
    }"""
)
open("src/app/pages/ForgotPassword.tsx", "w", encoding="utf-8").write(content)
print("Done!")
