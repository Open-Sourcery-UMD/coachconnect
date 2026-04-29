for fname in ["src/app/pages/Landing.tsx", "src/app/pages/About.tsx"]:
    content = open(fname, "r", encoding="utf-8").read()
    
    # Wrap return in fragment if Footer is outside root div
    if "<Footer />\n  );\n}" in content and "  return (\n    <>" not in content:
        content = content.replace("  return (\n    <div", "  return (\n    <>\n    <div")
        content = content.replace("    <Footer />\n  );\n}", "    <Footer />\n    </>\n  );\n}")
        open(fname, "w", encoding="utf-8").write(content)
        print(f"Fixed {fname}")
    else:
        print(f"Skipped {fname}")
