content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()
idx = content.find("forgot")
while idx != -1:
    print(repr(content[idx-100:idx+100]))
    print("---")
    idx = content.find("forgot", idx+1)
