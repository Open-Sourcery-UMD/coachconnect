content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "\n      <Footer />\n    </div>\n  );\n}",
    "\n    </div>\n  );\n}"
)
content = content.replace(
    "\n    </div>\n  );\n}",
    "\n      <Footer />\n    </div>\n  );\n}",
    1
)
open("src/app/pages/Login.tsx", "w", encoding="utf-8").write(content)
print("Done!")
