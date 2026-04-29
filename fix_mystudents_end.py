content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
# Remove the extra closing brace at the end
content = content.rstrip()
if content.endswith("}\n}") or content.endswith("}}"):
    content = content[:-1]
open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
