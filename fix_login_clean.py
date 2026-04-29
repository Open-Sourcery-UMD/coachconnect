content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()
# Remove all Footer references
content = content.replace("import Footer from '../components/Footer'\n", "")
content = content.replace("      <Footer />\n", "")
content = content.replace("    <Footer />\n", "")
open("src/app/pages/Login.tsx", "w", encoding="utf-8").write(content)
print("Done!")
