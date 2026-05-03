content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "      </Dialog>\n      </div>\n    );\n  }",
    "      </Dialog>\n    </div>\n  );\n}"
)
open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
