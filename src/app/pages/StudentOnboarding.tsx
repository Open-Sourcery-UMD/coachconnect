import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function StudentOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const totalSteps = 4;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    customGender: "",
    graduationYear: "",
    interests: [] as string[],
    goals: "",
    level: "",
    budget: "",
    preferredTimes: [] as string[],
  });

  // Error state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    graduationYear: "",
    interests: "",
    level: "",
    goals: "",
    budget: "",
    preferredTimes: "",
  });

  const interestOptions = [
    "Soccer",
    "Basketball",
    "Volleyball",
    "Ultimate Frisbee",
    "Lacrosse",
    "Rugby",
    "Tennis",
    "Swimming",
    "Track and Field",
    "Baseball",
    "Softball",
    "Ice Hockey",
    "Field Hockey",
    "Martial Arts",
    "Climbing",
  ];

  const timeOptions = [
    "Weekday Mornings",
    "Weekday Afternoons",
    "Weekday Evenings",
    "Weekend Mornings",
    "Weekend Afternoons",
    "Weekend Evenings",
  ];

  // Generate time slots for each day
  const generateTimeSlots = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8am to 10pm (8-22, so 8-9, 9-10... 10-11pm)
    const slots: { day: string; times: string[] }[] = [];
    
    days.forEach(day => {
      const times = hours.map(hour => {
        const startTime = hour > 12 ? `${hour - 12}` : (hour === 12 ? "12" : `${hour}`);
        const endTime = hour + 1 > 12 ? `${hour + 1 - 12}` : (hour + 1 === 12 ? "12" : `${hour + 1}`);
        const startPeriod = hour >= 12 ? "pm" : "am";
        const endPeriod = hour + 1 >= 12 ? "pm" : "am";
        
        return `${startTime}${startPeriod}-${endTime}${endPeriod}`;
      });
      slots.push({ day, times });
    });
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const toggleTimeSlot = (day: string, time: string) => {
    const slotKey = `${day} ${time}`;
    setFormData((prev) => ({
      ...prev,
      preferredTimes: prev.preferredTimes.includes(slotKey)
        ? prev.preferredTimes.filter((item) => item !== slotKey)
        : [...prev.preferredTimes, slotKey],
    }));
  };

  const getSelectedCountForDay = (day: string) => {
    return formData.preferredTimes.filter(slot => slot.startsWith(day)).length;
  };

  const levelOptions = [
    { value: "beginner", label: "Beginner - Just starting out" },
    { value: "intermediate", label: "Intermediate - Some experience" },
    { value: "advanced", label: "Advanced - Competitive level" },
  ];

  const toggleSelection = (field: "interests" | "preferredTimes", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const isValidUMDEmail = (email: string): boolean => {
    return email.endsWith('@terpmail.umd.edu') || email.endsWith('@umd.edu');
  };

  const handleNext = () => {
    // Clear previous errors
    setErrors({
      name: "",
      email: "",
    password: "",
      gender: "",
      graduationYear: "",
      interests: "",
      level: "",
      goals: "",
      budget: "",
      preferredTimes: "",
    });

    let hasErrors = false;
    const newErrors: typeof errors = {
      name: "",
      email: "",
    password: "",
      gender: "",
      graduationYear: "",
      interests: "",
      level: "",
      goals: "",
      budget: "",
      preferredTimes: "",
    };

    // Step 1 validation
    if (step === 1) {
      if (formData.name.trim() === "") {
        newErrors.name = "Full name is required.";
        hasErrors = true;
      }
      if (formData.email.trim() === "") {
        newErrors.email = "UMD email address is required.";
        hasErrors = true;
      } else if (!isValidUMDEmail(formData.email)) {
        newErrors.email = "Must be a valid UMD email (@terpmail.umd.edu or @umd.edu).";
        hasErrors = true;
      }
      const passwordErrors = []
      if (formData.password.trim() === "") {
        passwordErrors.push("Password is required")
      } else {
        if (formData.password.length < 8) passwordErrors.push("At least 8 characters")
        if (!/[A-Z]/.test(formData.password)) passwordErrors.push("At least one uppercase letter")
        if (!/[!@#$%^&*]/.test(formData.password)) passwordErrors.push("At least one special character (!@#$%^&*)")
      }
      if (passwordErrors.length > 0) { newErrors.password = passwordErrors.join(", "); hasErrors = true; }
      if (formData.gender.trim() === "") {
        newErrors.gender = "Gender is required.";
        hasErrors = true;
      }
      if (formData.graduationYear.trim() === "") {
        newErrors.graduationYear = "Graduation year is required.";
        hasErrors = true;
      }
    }

    // Step 2 validation
    if (step === 2) {
      if (formData.interests.length === 0) {
        newErrors.interests = "Please select at least one sport.";
        hasErrors = true;
      }
      if (formData.level.trim() === "") {
        newErrors.level = "Please select your current skill level.";
        hasErrors = true;
      }
    }

    // Step 3 validation
    if (step === 3) {
      const goalsWords = countWords(formData.goals);
      if (formData.goals.trim() === "") {
        newErrors.goals = "Athletic goals are required.";
        hasErrors = true;
      } else if (goalsWords > 75) {
        newErrors.goals = `Exceeds 75 words (currently ${goalsWords} words).`;
        hasErrors = true;
      }

      if (formData.budget && parseFloat(formData.budget) < 0) {
        newErrors.budget = "Cannot be negative.";
        hasErrors = true;
      }

      if (formData.preferredTimes.length === 0) {
        newErrors.preferredTimes = "Please select at least one time slot.";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save student data to localStorage
      const students = JSON.parse(localStorage.getItem("students") || "[]");
      students.push({ ...formData, id: Date.now(), type: "student" });
      localStorage.setItem("students", JSON.stringify(students));
      
      // Navigate to results page with sport interests
      navigate("/results", { state: { sports: formData.interests } });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/home");
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen p-4 py-8 relative">
      {/* Shell pattern background */}
      <div className="fixed inset-0 opacity-5 -z-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="shell-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <g transform="translate(60, 60)">
                <path d="M 0,-30 Q 20,-25 25,-10 Q 28,0 25,10 Q 20,25 0,30 Q -20,25 -25,10 Q -28,0 -25,-10 Q -20,-25 0,-30 Z" 
                      fill="white" opacity="0.6"/>
                <path d="M 0,-25 L 0,25 M -15,-15 L 15,15 M 15,-15 L -15,15 M -20,0 L 20,0" 
                      stroke="white" strokeWidth="1.5" opacity="0.4"/>
                <circle cx="0" cy="0" r="5" fill="white" opacity="0.8"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shell-pattern)"/>
        </svg>
      </div>

      <div className="max-w-2xl w-full space-y-6 mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Student Registration</h1>
          <p className="text-white/90 mt-2 drop-shadow">Step {step} of {totalSteps}</p>
        </div>

        <Progress value={progress} className="w-full" />

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Personal Information"}
              {step === 2 && "Sports Interests"}
              {step === 3 && "Goals & Preferences"}
              {step === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Which club sports interest you?"}
              {step === 3 && "Help us find your perfect match"}
              {step === 4 && "Confirm your information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                  {formData.gender === "Custom" && (
                    <Input
                      id="customGender"
                      placeholder="Enter your gender"
                      value={formData.customGender}
                      onChange={(e) => setFormData({ ...formData, customGender: e.target.value })}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year *</Label>
                  <Select value={formData.graduationYear} onValueChange={(value) => setFormData({ ...formData, graduationYear: value })}>
                    <SelectTrigger id="graduationYear">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                      <SelectItem value="2029">2029</SelectItem>
                      <SelectItem value="2030">2030</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.graduationYear && <p className="text-red-500 text-xs">{errors.graduationYear}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">UMD Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@terpmail.umd.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Must end with @terpmail.umd.edu or @umd.edu</p>
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
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
                    )}
                </div>
                <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Which club sports are you interested in? *</Label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((option) => (
                      <Badge
                        key={option}
                        variant={formData.interests.includes(option) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleSelection("interests", option)}
                      >
                        {formData.interests.includes(option) && <Check className="w-3 h-3 mr-1" />}
                        {option}
                      </Badge>
                    ))}
                  </div>
                  {errors.interests && <p className="text-red-500 text-xs">{errors.interests}</p>}
                </div>
                <div className="space-y-3">
                  <Label>Current Skill Level *</Label>
                  <RadioGroup value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                    {levelOptions.map((option) => (
                      <div 
                        key={option.value} 
                        className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition-all ${
                          formData.level === option.value 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData({ ...formData, level: option.value })}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer font-normal flex-1">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.level && <p className="text-red-500 text-xs">{errors.level}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goals">Athletic Goals * (Be specific, max 75 words)</Label>
                  <Textarea
                    id="goals"
                    placeholder="What do you hope to achieve? (e.g., stay fit, compete at tournaments, learn fundamentals...)"
                    rows={4}
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">
                    {countWords(formData.goals)}/75 words
                  </p>
                  {errors.goals && <p className="text-red-500 text-xs">{errors.goals}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget for Fees (USD, if any)</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Many clubs are free or low-cost</p>
                  {errors.budget && <p className="text-red-500 text-xs">{errors.budget}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Preferred Practice Times * (Select all that work)</Label>
                  <div className="border rounded-lg divide-y">
                    {timeSlots.map((slot) => (
                      <div key={slot.day} className="overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleDay(slot.day)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-sm">
                            {slot.day}
                            {getSelectedCountForDay(slot.day) > 0 && (
                              <span className="ml-2 text-xs text-primary">
                                ({getSelectedCountForDay(slot.day)} selected)
                              </span>
                            )}
                          </span>
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              expandedDay === slot.day ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {expandedDay === slot.day && (
                          <div className="px-4 py-3 bg-gray-50 grid grid-cols-3 gap-2">
                            {slot.times.map((time) => (
                              <div
                                key={time}
                                onClick={() => toggleTimeSlot(slot.day, time)}
                                className={`px-3 py-2 rounded text-center cursor-pointer text-sm transition-colors ${
                                  formData.preferredTimes.includes(`${slot.day} ${time}`)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-white border hover:border-primary"
                                }`}
                              >
                                {formData.preferredTimes.includes(`${slot.day} ${time}`) && (
                                  <Check className="w-3 h-3 inline mr-1" />
                                )}
                                {time}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {formData.preferredTimes.length} time slot{formData.preferredTimes.length !== 1 ? 's' : ''} selected
                  </p>
                  {errors.preferredTimes && <p className="text-red-500 text-xs">{errors.preferredTimes}</p>}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{formData.name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{formData.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium">{formData.gender === "Custom" ? formData.customGender : formData.gender || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Graduation Year</p>
                    <p className="font-medium">{formData.graduationYear || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interests</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.interests.length > 0 ? (
                        formData.interests.map((interest) => (
                          <Badge key={interest} variant="secondary">{interest}</Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">None selected</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Level</p>
                    <p className="font-medium">{formData.level ? levelOptions.find(l => l.value === formData.level)?.label : "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Goals</p>
                    <p className="font-medium">{formData.goals || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-medium">{formData.budget ? `$${formData.budget}` : "No budget specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preferred Times</p>
                    <p className="text-sm text-gray-500">{formData.preferredTimes.length} time slots selected</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} style={{ cursor: 'pointer' }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} style={{ cursor: 'pointer' }}>
                {step === totalSteps ? "Find Coaches" : "Continue"}
                {step < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}









