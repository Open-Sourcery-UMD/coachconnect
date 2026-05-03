import os

pages = [
    "src/app/pages/Login.tsx",
    "src/app/pages/ForgotPassword.tsx", 
    "src/app/pages/About.tsx",
]

for page in pages:
    content = open(page, "r", encoding="utf-8").read()
    if "Footer" not in content:
        # Add import at top
        first_import = content.find("import")
        end_of_first_import = content.find("\n", first_import)
        content = content[:end_of_first_import+1] + "import Footer from '../components/Footer';\n" + content[end_of_first_import+1:]
        # Add Footer before last closing div
        content = content.rstrip()
        if content.endswith("}"):
            # Find the last return statement closing
            content = content[:-1] + "\n      <Footer />\n    </div>\n  );\n}"
        open(page, "w", encoding="utf-8").write(content)
        print(f"Fixed {page}")
    else:
        print(f"Already has footer: {page}")
