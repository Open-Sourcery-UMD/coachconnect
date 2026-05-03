content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
idx = content.find("Accepted")
while idx != -1:
    print(repr(content[idx:idx+50]))
    print("---")
    idx = content.find("Accepted", idx+1)
