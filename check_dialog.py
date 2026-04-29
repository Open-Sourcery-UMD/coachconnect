content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
idx = content.find("text-3xl font-black")
print(repr(content[idx:idx+150]))
