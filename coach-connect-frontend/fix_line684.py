content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()
lines = content.split("\n")
# Fix lines 683-685 (index 682-684)
new_lines = []
i = 0
while i < len(lines):
    if i == 682 and 'navigate("/"); //' in lines[i]:
        new_lines.append('            navigate("/");')
        i += 3  # skip the next 2 lines (state and });
    else:
        new_lines.append(lines[i])
        i += 1
open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write("\n".join(new_lines))
print("Done!")
