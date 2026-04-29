content = open("src/app/pages/Landing.tsx", "r", encoding="utf-8").read()

# Remove the Learn More and Login buttons section at bottom
content = content.replace(
    """        <div className="pt-6 flex items-center justify-center gap-8">
          <div
            onClick={() => navigate("/about")}
            className="inline-block px-6 py-3 rounded-3xl bg-gray-200/80 shadow-sm transition-all duration-300 hover:bg-gray-300/90 hover:shadow-md cursor-pointer"
          >
            <p className="text-black/90 drop-shadow text-xl font-semibold">
              Learn More About Coach Connect
            </p>
          </div>

          <div
            onClick={() => navigate("/login")}
            className="inline-block px-6 py-3 rounded-3xl bg-gray-200/80 shadow-sm transition-all duration-300 hover:bg-gray-300/90 hover:shadow-md cursor-pointer"
          >
            <p className="text-black/90 drop-shadow text-xl">
              Already have an account?{" "}
              <span className="font-semibold text-xl">
                Login
              </span>
            </p>
          </div>
        </div>""",
    ""
)

open("src/app/pages/Landing.tsx", "w", encoding="utf-8").write(content)
print("Done!")
