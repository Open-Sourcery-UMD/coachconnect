content = open("src/app/pages/Landing.tsx", "r", encoding="utf-8").read()
lines = content.split("\n")
for i, line in enumerate(lines[188:205], start=189):
    print(f"{i}: {repr(line)}")
