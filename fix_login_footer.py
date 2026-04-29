content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()

if "Footer" not in content:
    content = content.replace(
        "import { auth, googleProvider } from '../firebase'",
        "import { auth, googleProvider } from '../firebase'\nimport Footer from '../components/Footer'"
    )
    content = content.replace(
        "\n    </div>\n  );\n}",
        "\n      <Footer />\n    </div>\n  );\n}"
    )

open("src/app/pages/Login.tsx", "w", encoding="utf-8").write(content)
print("Done!")
