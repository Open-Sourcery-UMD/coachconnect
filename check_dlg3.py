content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
idx = content.find("pricing")
print(repr(content[idx:idx+200]))
