content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
idx = content.find("Accept")
while idx != -1:
    print(repr(content[idx:idx+80]))
    print("---")
    idx = content.find("Accept", idx+1)
