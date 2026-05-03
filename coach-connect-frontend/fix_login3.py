content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()
lines = content.split("\n")
# Remove lines 231-232 (index 230-231) which have Footer in wrong place
new_lines = []
skip = False
for i, line in enumerate(lines):
    if i == 230 and "<Footer />" in line:
        skip = True
    elif i == 231 and "</div>" in line and skip:
        skip = False
        continue
    elif skip:
        continue
    new_lines.append(line)

content = "\n".join(new_lines)

# Now add Footer in the right place - inside the main div before closing
content = content.replace(
    "      </div>\n    </div>\n  )\n}",
    "      </div>\n      <Footer />\n    </div>\n  )\n}"
)

open("src/app/pages/Login.tsx", "w", encoding="utf-8").write(content)
print("Done!")
