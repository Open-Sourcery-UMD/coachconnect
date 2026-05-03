content = open("src/app/pages/CoachOnboarding.tsx", "r", encoding="utf-8").read()

old = "// Save coach data to backend API"
new = """// Save coach data to backend API
"""

# Add catch block after the try block
content = content.replace(
    "const newCoach = { ...formData, id: Date.now(), type: \"coach\" };",
    """const newCoach = { ...formData, id: Date.now(), type: "coach" };
          navigate("/my-students", { state: { coachId: newCoach.id } });
        } catch (error) {
          console.error("Failed to save coach:", error);
          alert("Something went wrong. Please try again.");"""
)

open("src/app/pages/CoachOnboarding.tsx", "w", encoding="utf-8").write(content)
print("Done!")
