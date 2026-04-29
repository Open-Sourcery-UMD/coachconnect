content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
# Find the last </Dialog> and add the missing closing tags
if content.rstrip().endswith("</Dialog>"):
    content = content.rstrip() + "\n    </div>\n  );\n}"
elif content.rstrip().endswith("</Dialog>\n    </div>\n  );\n}"):
    pass  # already correct
open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done! Last 50 chars:", repr(content[-50:]))
