content = open("src/app/pages/ForgotPassword.tsx", "r", encoding="utf-8").read()

if "Footer" not in content:
    content = content.replace(
        "import { useState } from 'react'",
        "import { useState } from 'react'\nimport Footer from '../components/Footer'"
    )
    content = content.replace(
        "\n    </div>\n  )\n}",
        "\n      <Footer />\n    </div>\n  )\n}"
    )

open("src/app/pages/ForgotPassword.tsx", "w", encoding="utf-8").write(content)
print("Done!")
