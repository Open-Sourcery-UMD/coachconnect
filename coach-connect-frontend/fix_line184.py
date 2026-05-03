content = open("src/app/pages/Landing.tsx", "r", encoding="utf-8").read()
lines = content.split("\n")
# Remove line 184 (index 183) which has the bad </div>
if lines[183].strip() == "</div>":
    lines.pop(183)
    print("Removed bad line!")
else:
    print("Line content:", repr(lines[183]))
open("src/app/pages/Landing.tsx", "w", encoding="utf-8").write("\n".join(lines))
