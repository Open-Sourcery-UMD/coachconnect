def fix_file(filename):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace(
        'if (passwordErrors.length > 0) newErrors.password = passwordErrors.join(", ")',
        'if (passwordErrors.length > 0) { newErrors.password = passwordErrors.join(", "); hasErrors = true; }'
    )
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed " + filename)

fix_file("src/app/pages/CoachOnboarding.tsx")
fix_file("src/app/pages/StudentOnboarding.tsx")
