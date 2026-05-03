content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
idx = content.find("allSports")
while idx != -1:
    print(repr(content[idx-50:idx+100]))
    print("---")
    idx = content.find("allSports", idx+1)
