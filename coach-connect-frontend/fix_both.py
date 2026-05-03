content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

# Fix accepted button - find the exact text
content = content.replace(
    "{accepted ? 'Accepted ?' : 'Accept Student'}",
    "{accepted ? 'Accepted' : 'Accept Student'}"
)
content = content.replace(
    '{accepted ? "Accepted ?" : "Accept Student"}',
    '{accepted ? "Accepted" : "Accept Student"}'
)

# Check what the button actually says
import re
match = re.search(r"accepted \?.*?Accept Student", content)
if match:
    print("Found:", repr(match.group()))
else:
    print("Not found, searching for button...")
    idx = content.find("Accept Student")
    if idx != -1:
        print(repr(content[idx-50:idx+50]))

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
