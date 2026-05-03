content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "\n      <Dialog open={isProfileOpen}",
    "\n      </div>\n      <Dialog open={isProfileOpen}"
)
open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
