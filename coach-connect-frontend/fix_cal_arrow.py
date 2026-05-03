content = open("src/app/pages/Calendar.tsx", "r", encoding="utf-8").read()
content = content.replace("? Back to Students", "<- Back to Students")
open("src/app/pages/Calendar.tsx", "w", encoding="utf-8").write(content)
print("Done!")
