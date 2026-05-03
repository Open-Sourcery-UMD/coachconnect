content = open("src/app/pages/About.tsx", "r", encoding="utf-8").read()
# Remove the duplicate closing tags at the end
content = content.replace(
    "  );\n\n    </div>\n  );\n}",
    "  );\n}"
)
open("src/app/pages/About.tsx", "w", encoding="utf-8").write(content)
print("Done!")
