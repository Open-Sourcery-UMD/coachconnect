content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
idx = content.find("DialogHeader")
print(repr(content[idx:idx+500]))
