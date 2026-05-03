content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

# Fix question mark - it's a unicode character issue
content = content.replace("'Accepted ?'", "'Accepted'")
content = content.replace('"Accepted ?"', '"Accepted"')
content = content.replace("Accepted ?", "Accepted")

# Fix tab layout - restore to horizontal pills not full width
content = content.replace(
    "      <div className='px-6 pt-4 flex flex-col gap-4'>",
    "      <div className='px-6 pt-4 flex gap-4'>"
)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
