content = open("src/app/pages/ForgotPassword.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "\n      <Footer />\n    </div>\n  )\n}",
    "\n    </div>\n  )\n}"
)
content = content.replace(
    "\n    </div>\n  )\n}",
    "\n      <Footer />\n    </div>\n  )\n}"
)
open("src/app/pages/ForgotPassword.tsx", "w", encoding="utf-8").write(content)
print("Done!")
