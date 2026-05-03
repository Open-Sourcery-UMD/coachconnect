content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()
import re
content = re.sub(r"\s*<button[^>]*navigate\('/forgot-password'\)[^>]*>[\s\S]*?Forgot password\?[\s\S]*?</button>", "", content)
open("src/app/pages/Login.tsx", "w", encoding="utf-8").write(content)
print("Done!")
