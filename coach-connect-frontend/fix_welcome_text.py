for fname in ["src/app/pages/MyStudents.tsx", "src/app/pages/Results.tsx"]:
    content = open(fname, "r", encoding="utf-8").read()
    content = content.replace(
        "<p className='text-white/70 text-sm'>Welcome, {coachName}</p>",
        "<p className='text-white/70 text-sm'>Welcome Back, {coachName}</p>"
    )
    open(fname, "w", encoding="utf-8").write(content)
    print(f"Fixed {fname}")
