content = open("src/app/pages/Landing.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "      `}</style>\n    </div>\n    <Footer />\n  );\n}",
    "      `}</style>\n      <Footer />\n    </div>\n  );\n}"
)
open("src/app/pages/Landing.tsx", "w", encoding="utf-8").write(content)
print("Done!")
