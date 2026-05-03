content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
idx = content.find("/hour")
while idx != -1:
    print(repr(content[idx-100:idx+50]))
    print("---")
    idx = content.find("/hour", idx+1)
