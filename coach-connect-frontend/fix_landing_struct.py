content = open("src/app/pages/Landing.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "      `}</style>\n    </div>\n    <Footer />\n    </>\n  );\n}",
    "      `}</style>\n    </div>\n    <Footer />\n  );\n}"
)
# Also fix the return to not use fragment
content = content.replace(
    "  return (\n    <>\n    <div",
    "  return (\n    <div"
)
open("src/app/pages/Landing.tsx", "w", encoding="utf-8").write(content)
print("Done!")
