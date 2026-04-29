content = open("src/app/pages/Landing.tsx", "r", encoding="utf-8").read()
import re
# Remove the entire bottom buttons section
content = re.sub(r'        <div className="pt-6 flex items-center justify-center gap-8">.*?</div>\s*</div>', '</div>', content, flags=re.DOTALL)
open("src/app/pages/Landing.tsx", "w", encoding="utf-8").write(content)
print("Done!")
