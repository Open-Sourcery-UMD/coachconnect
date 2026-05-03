content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
idx = content.find("pb-3 flex flex-wrap")
if idx != -1:
    print("Filters found in render!")
    print(repr(content[idx-50:idx+100]))
else:
    print("Filters NOT in render - checking...")
    idx = content.find("flex flex-wrap gap-2")
    while idx != -1:
        print(repr(content[idx-50:idx+100]))
        print("---")
        idx = content.find("flex flex-wrap gap-2", idx+1)
