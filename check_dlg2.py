content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
idx = content.find("text-2xl font-black")
print(repr(content[idx:idx+150]))
