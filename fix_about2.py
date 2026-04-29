content = open("src/app/pages/About.tsx", "r", encoding="utf-8").read()
# Remove the incorrectly placed Footer and add it properly
content = content.replace(
    "\n      <Footer />\n    </div>\n  );\n}",
    "\n    </div>\n  );\n}"
)
# Find the last </div> before ); and add footer inside it
content = content.replace(
    "\n    </div>\n  );\n}",
    "\n      <Footer />\n    </div>\n  );\n}",
    1  # only replace last occurrence
)
open("src/app/pages/About.tsx", "w", encoding="utf-8").write(content)
print("Done!")
