content = open("src/app/pages/About.tsx", "r", encoding="utf-8").read()

# Find the return statement and wrap in fragment
content = content.replace(
    "  return (\n",
    "  return (\n    <>\n"
)
content = content.replace(
    "    </div>\n    <Footer />\n  );\n}",
    "    </div>\n    <Footer />\n    </>\n  );\n}"
)

open("src/app/pages/About.tsx", "w", encoding="utf-8").write(content)
print("Done!")
