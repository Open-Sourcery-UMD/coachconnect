import re

for fname in ["src/app/pages/Login.tsx", "src/app/pages/ForgotPassword.tsx"]:
    content = open(fname, "r", encoding="utf-8").read()
    content = content.replace("import Footer from '../components/Footer'\n", "")
    content = content.replace("import Footer from '../components/Footer';\n", "")
    content = content.replace("      <Footer />\n", "")
    content = content.replace("    <Footer />\n", "")
    content = content.replace("  );\n\n  );\n}", "  );\n}")
    content = content.replace("  )\n\n  );\n}", "  );\n}")
    open(fname, "w", encoding="utf-8").write(content)
    print(f"Cleaned {fname}")
