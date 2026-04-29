content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()
lines = content.split("\n")
for i, line in enumerate(lines[224:240], start=225):
    print(f"{i}: {repr(line)}")
