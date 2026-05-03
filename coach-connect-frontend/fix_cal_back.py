content = open("src/app/pages/Calendar.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "          \u2190 Back to Students",
    "          \u2190 Back to Students"
)
# Nuclear option - replace the entire button text
import re
content = re.sub(
    r"[^>]*Back to Students",
    "? Back to Students",
    content
)
open("src/app/pages/Calendar.tsx", "w", encoding="utf-8").write(content)
print("Done!")
