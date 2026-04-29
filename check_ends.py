for fname in ["src/app/pages/Landing.tsx", "src/app/pages/About.tsx"]:
    content = open(fname, "r", encoding="utf-8").read()
    lines = content.split("\n")
    print(f"\n{fname} last 8 lines:")
    for i, line in enumerate(lines[-8:], start=len(lines)-7):
        print(f"  {i}: {repr(line)}")
    print("Has Footer:", "Footer" in content)
