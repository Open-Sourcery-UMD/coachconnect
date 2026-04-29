content = open("src/app/pages/Landing.tsx", "r", encoding="utf-8").read()

# Move footer outside the main div
content = content.replace(
    "      `}</style>\n      <Footer />\n    </div>\n  );\n}",
    "      `}</style>\n    </div>\n    <Footer />\n  );\n}"
)

# Wrap return in fragment
content = content.replace(
    "  return (\n    <div",
    "  return (\n    <>\n    <div"
)
content = content.replace(
    "    <Footer />\n  );\n}",
    "    <Footer />\n    </>\n  );\n}"
)

open("src/app/pages/Landing.tsx", "w", encoding="utf-8").write(content)
print("Done!")
