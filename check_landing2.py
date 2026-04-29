content = open("src/app/pages/Landing.tsx", "r", encoding="utf-8").read()
lines = content.split("\n")
for i, line in enumerate(lines[180:202], start=181):
    print(f"{i}: {repr(line)}")
