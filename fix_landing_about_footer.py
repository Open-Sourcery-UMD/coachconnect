# Fix Landing.tsx - add footer at bottom
content = open("src/app/pages/Landing.tsx", "r", encoding="utf-8").read()
if "Footer" not in content:
    content = content.replace(
        'import { useNavigate } from "react-router";',
        'import { useNavigate } from "react-router";\nimport Footer from "../components/Footer";'
    )
    content = content.replace(
        "      `}</style>\n    </div>\n  );\n}",
        "      `}</style>\n    </div>\n    <Footer />\n  );\n}"
    )
    open("src/app/pages/Landing.tsx", "w", encoding="utf-8").write(content)
    print("Landing fixed!")

# Fix About.tsx - make it flex column so footer sticks to bottom
content = open("src/app/pages/About.tsx", "r", encoding="utf-8").read()
# Find the outer div and make it flex column
content = content.replace(
    "      <Footer />\n    </div>\n  );\n}",
    "    </div>\n    <Footer />\n  );\n}"
)
open("src/app/pages/About.tsx", "w", encoding="utf-8").write(content)
print("About fixed!")
