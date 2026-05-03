for fname in ["src/app/pages/Terms.tsx", "src/app/pages/Privacy.tsx", "src/app/pages/Contact.tsx"]:
    content = open(fname, "r", encoding="utf-8").read()
    content = content.replace(
        "<button onClick={() => navigate(-1)} className='text-white font-bold hover:text-white/80' style={{ background: 'none', border: 'none', cursor: 'pointer' }}>? Back</button>",
        "<button onClick={() => navigate(-1)} className='text-white font-bold flex items-center gap-1 hover:text-white/80' style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span style={{ fontSize: '20px' }}>&#8592;</span> Back</button>"
    )
    content = content.replace(
        "<button onClick={() => navigate(-1)} className='text-white font-bold' style={{ background: 'none', border: 'none', cursor: 'pointer' }}>? Back</button>",
        "<button onClick={() => navigate(-1)} className='text-white font-bold flex items-center gap-1 hover:text-white/80' style={{ background: 'none', border: 'none', cursor: 'pointer' }}><span style={{ fontSize: '20px' }}>&#8592;</span> Back</button>"
    )
    open(fname, "w", encoding="utf-8").write(content)
    print(f"Fixed {fname}")
