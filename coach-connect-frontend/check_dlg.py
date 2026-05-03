content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
idx = content.find("text-right")
while idx != -1:
    if "rate" in content[idx:idx+150] or "font-black" in content[idx:idx+150]:
        print(repr(content[idx:idx+150]))
        print("---")
    idx = content.find("text-right", idx+1)
