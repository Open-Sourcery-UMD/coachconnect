content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
idx = content.find("text-right flex-shrink-0")
print(repr(content[idx:idx+200]))
