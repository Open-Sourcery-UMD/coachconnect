content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()
lines = content.split("\n")
for i, line in enumerate(lines[678:692], start=679):
    print(f"{i}: {repr(line)}")
