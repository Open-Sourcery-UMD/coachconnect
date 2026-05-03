content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()
import re
# Remove the entire forgot password button block
content = re.sub(
    r"<button\s+type='button'\s+onClick=\{.*?forgot-password.*?\}[\s\S]*?</button>",
    "",
    content
)
open("src/app/pages/Login.tsx", "w", encoding="utf-8").write(content)
print("Done!")
