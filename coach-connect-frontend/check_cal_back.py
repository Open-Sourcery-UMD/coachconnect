content = open("src/app/pages/Calendar.tsx", "r", encoding="utf-8").read()
idx = content.find("Back to Students")
print(repr(content[idx-20:idx+30]))
