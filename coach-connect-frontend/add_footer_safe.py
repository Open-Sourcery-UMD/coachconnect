files = {
    "src/app/pages/Results.tsx": "    </div>\n  );\n}",
    "src/app/pages/MyStudents.tsx": "    </div>\n  );\n}",
    "src/app/pages/Login.tsx": "    </div>\n  );\n}",
    "src/app/pages/ForgotPassword.tsx": "    </div>\n  )\n}",
    "src/app/pages/About.tsx": "    </div>\n  );\n}",
}

footer_import = "import Footer from '../components/Footer';\n"
footer_tag = "      <Footer />\n"

for fname, closing in files.items():
    content = open(fname, "r", encoding="utf-8").read()
    
    if "Footer" in content:
        print(f"Already has footer: {fname}")
        continue
    
    # Add import after first import line
    first_import_end = content.find("\n") 
    content = content[:first_import_end+1] + footer_import + content[first_import_end+1:]
    
    # Add footer before closing
    new_closing = footer_tag + closing
    if closing in content:
        content = content.replace(closing, new_closing, 1)
        open(fname, "w", encoding="utf-8").write(content)
        print(f"Fixed: {fname}")
    else:
        print(f"Could not find closing in: {fname}")
