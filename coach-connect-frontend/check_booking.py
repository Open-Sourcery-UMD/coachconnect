content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
idx = content.find("isBookingOpen")
print(repr(content[idx:idx+500]))
