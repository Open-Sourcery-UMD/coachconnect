# Fix rate color in dialog - change red to gray/black
content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "style={{ color: '#E21833' }}>${selectedCoach.rate || '0'}",
    "style={{ color: '#111' }}>${selectedCoach.rate || '0'}"
)
open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Results fixed!")

# Remove forgot password link from Login
content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "            <a href='/forgot-password' className='text-[#FFD200] font-bold hover:underline text-sm'>Forgot password?</a>",
    ""
)
content = content.replace(
    "            <a href=\"/forgot-password\" className=\"text-[#FFD200] font-bold hover:underline text-sm\">Forgot password?</a>",
    ""
)
open("src/app/pages/Login.tsx", "w", encoding="utf-8").write(content)
print("Login fixed!")
