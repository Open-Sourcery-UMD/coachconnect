files = [
    "src/app/pages/Login.tsx",
    "src/app/pages/ForgotPassword.tsx",
    "src/app/pages/About.tsx",
    "src/app/pages/Results.tsx",
    "src/app/pages/MyStudents.tsx",
]

for fname in files:
    content = open(fname, "r", encoding="utf-8").read()
    lines = content.split("\n")
    print(f"\n{fname} - last 5 lines:")
    for i, line in enumerate(lines[-5:], start=len(lines)-4):
        print(f"  {i}: {repr(line)}")
