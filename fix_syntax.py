# Fix ForgotPassword - extra </div> outside return
content = open("src/app/pages/ForgotPassword.tsx", "r", encoding="utf-8").read()
content = content.replace("  )\n\n    </div>\n  );\n}", "  )\n}")
open("src/app/pages/ForgotPassword.tsx", "w", encoding="utf-8").write(content)
print("ForgotPassword fixed!")

# Fix Login - check for duplicate );
content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()
lines = content.split("\n")
print("Login last 10 lines:")
for i, line in enumerate(lines[-10:], start=len(lines)-9):
    print(f"  {i}: {repr(line)}")
