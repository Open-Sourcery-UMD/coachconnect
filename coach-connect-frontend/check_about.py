content = open("src/app/pages/About.tsx", "r", encoding="utf-8").read()
lines = content.split("\n")
for i, line in enumerate(lines[205:218], start=206):
    print(f"{i}: {repr(line)}")
