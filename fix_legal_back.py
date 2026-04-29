for fname in ["src/app/pages/Terms.tsx", "src/app/pages/Privacy.tsx", "src/app/pages/Contact.tsx"]:
    content = open(fname, "r", encoding="utf-8").read()
    
    # Fix back button style to match the reference
    old = "<button onClick={() => navigate(-1)} className='text-white font-bold flex items-center gap-1 hover:text-white/80' style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span style={{ fontSize: '20px' }}>&#8592;</span> Back</button>"
    new = "<button onClick={() => navigate(-1)} className='flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-gray-100 transition-all' style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer' }}><span style={{ fontSize: '18px' }}>&#8592;</span> Back</button>"
    content = content.replace(old, new)
    
    # Add spacing between back button and title
    content = content.replace(
        "className='px-6 py-4 flex items-center gap-4 sticky top-0 z-20'",
        "className='px-6 py-4 flex items-center gap-6 sticky top-0 z-20'"
    )
    
    open(fname, "w", encoding="utf-8").write(content)
    print(f"Fixed {fname}")
