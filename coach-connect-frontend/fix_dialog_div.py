content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix extra closing div before DialogHeader
content = content.replace(
    "                  </div>\n                  </div>\n                </div>\n              </DialogHeader>",
    "                  </div>\n                </div>\n              </DialogHeader>"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
