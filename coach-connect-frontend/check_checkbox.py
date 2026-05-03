content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
idx = content.find("toggleSport(sport)")
print(repr(content[idx-50:idx+300]))
