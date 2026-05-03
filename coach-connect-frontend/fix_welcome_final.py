for fname in ["src/app/pages/MyStudents.tsx", "src/app/pages/Results.tsx"]:
    content = open(fname, "r", encoding="utf-8").read()
    
    # Fix welcome text - remove comma
    content = content.replace(
        "<p className='text-white/70 text-sm'>Welcome Back, {coachName}</p>",
        "<p className='text-white/70 text-sm'>Welcome Back</p>"
    )
    content = content.replace(
        "<p className='text-white/80 text-sm font-medium'>Welcome Back, {coachName}</p>",
        "<p className='text-white/70 text-sm'>Welcome Back</p>"
    )
    
    open(fname, "w", encoding="utf-8").write(content)
    print(f"Fixed {fname}")
