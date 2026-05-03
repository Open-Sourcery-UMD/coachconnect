import re

def fix_file(filename):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    if "Eye, EyeOff" not in content:
        content = content.replace(
            'import { useState } from "react";',
            'import { useState } from "react";\nimport { Eye, EyeOff } from "lucide-react";'
        )

    if "showPassword" not in content:
        content = content.replace(
            "const [step, setStep] = useState(1);",
            "const [step, setStep] = useState(1);\n  const [showPassword, setShowPassword] = useState(false);"
        )

    old_pattern = r'<Label htmlFor="password">Password \*</Label>\s*<Input\s*id="password"\s*type="password"\s*placeholder="Min\. 8 chars, 1 uppercase, 1 special character"\s*value=\{formData\.password\}\s*onChange=\{\(e\) => setFormData\(\{ \.\.\.formData, password: e\.target\.value \}\)\}\s*/>\s*\{errors\.password && <p className="text-red-500 text-sm">\{errors\.password\}</p>\}'

    new_field = '''<Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 chars, 1 uppercase, 1 special character"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{ paddingRight: "3rem" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="mt-1 space-y-1">
                        {errors.password.split(", ").map((err, i) => (
                          <p key={i} className="text-red-500 text-sm flex items-center gap-1">
                            <span>*</span> {err}
                          </p>
                        ))}
                      </div>
                    )}'''

    content = re.sub(old_pattern, new_field, content, flags=re.DOTALL)

    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed " + filename)

fix_file("src/app/pages/CoachOnboarding.tsx")
fix_file("src/app/pages/StudentOnboarding.tsx")
