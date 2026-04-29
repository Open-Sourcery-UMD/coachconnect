content = open("src/app/pages/About.tsx", "r", encoding="utf-8").read()

if "Footer" not in content:
    # Find first import line
    idx = content.find("import")
    end = content.find("\n", idx)
    content = content[:end+1] + "import Footer from '../components/Footer';\n" + content[end+1:]
    content = content.replace(
        "\n    </div>\n  );\n}",
        "\n      <Footer />\n    </div>\n  );\n}"
    )

open("src/app/pages/About.tsx", "w", encoding="utf-8").write(content)
print("Done!")
