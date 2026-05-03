content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "import { useNavigate } from 'react-router';",
    "import { useNavigate } from 'react-router';"
)
# Check if it exists, if not add it
if "useNavigate" not in content:
    content = content.replace(
        "import { useState, useEffect } from 'react';",
        "import { useState, useEffect } from 'react';\nimport { useNavigate } from 'react-router';"
    )
    # Add navigate hook inside component
    content = content.replace(
        "  const [coaches, setCoaches] = useState",
        "  const navigate = useNavigate();\n  const [coaches, setCoaches] = useState"
    )
    open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
    print("Added navigate!")
else:
    print("Already has navigate")
