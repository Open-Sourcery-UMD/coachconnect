for fname in ["src/app/pages/MyStudents.tsx", "src/app/pages/Results.tsx"]:
    content = open(fname, "r", encoding="utf-8").read()
    
    # Fix coach name display
    content = content.replace(
        "  const coachName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Coach';",
        "  const coachName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0]?.replace('.', ' ').replace(/\\b\\w/g, (c: string) => c.toUpperCase()) || 'Coach';"
    )
    
    open(fname, "w", encoding="utf-8").write(content)
    print(f"Fixed {fname}")
