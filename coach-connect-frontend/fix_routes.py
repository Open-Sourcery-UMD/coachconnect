content = open("src/app/routes.ts", "r", encoding="utf-8").read()
content = content.replace(
    "import About from './pages/About'",
    "import About from './pages/About'\nimport Terms from './pages/Terms'\nimport Privacy from './pages/Privacy'\nimport Contact from './pages/Contact'"
)
content = content.replace(
    "  { path: '/about', Component: About },",
    "  { path: '/about', Component: About },\n  { path: '/terms', Component: Terms },\n  { path: '/privacy', Component: Privacy },\n  { path: '/contact', Component: Contact },"
)
open("src/app/routes.ts", "w", encoding="utf-8").write(content)
print("Done!")
