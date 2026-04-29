content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "const data = await getStudents(); setStudents(data);",
    "const data = await getStudents(); setStudents(Array.isArray(data) ? data : []);"
)
open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
