import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  X,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  RadioGroup,
  RadioGroupItem,
} from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function CoachOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const totalSteps = 4;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password: "",
    phone: "",
    gender: "",
    customGender: "",
    profilePicture: "",
    expertise: [] as string[],
    sportDetails: {} as Record<
      string,
      {
        videoFile: string;
        videoFileName: string;
        coachingYears: string;
        playingYears: string;
        achievements: string;
      }
    >,
    coachingStyle: "",
    teamSize: "",
    competitionLevel: [] as string[], // Changed to array for multiple selection
    certification: "",
    rate: "",
    availability: [] as string[],
  });

  // Error state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    expertise: "",
    coachingStyle: "",
    sportDetails: {} as Record<
      string,
      {
        videoFile: string;
        coachingYears: string;
        playingYears: string;
        achievements: string;
      }
    >,
    competitionLevel: "",
    rate: "",
    availability: "",
  });

  const expertiseOptions = [
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

  const availabilityOptions = [
    "Weekday Mornings",
    "Weekday Afternoons",
    "Weekday Evenings",
    "Weekend Mornings",
    "Weekend Afternoons",
    "Weekend Evenings",
  ];

  // Generate time slots for each day
  const generateTimeSlots = () => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8am to 10pm (8-22, so 8-9, 9-10... 10-11pm)
    const slots: { day: string; times: string[] }[] = [];

    days.forEach((day) => {
      const times = hours.map((hour) => {
        const startTime =
          hour > 12
            ? `${hour - 12}`
            : hour === 12
              ? "12"
              : `${hour}`;
        const endTime =
          hour + 1 > 12
            ? `${hour + 1 - 12}`
            : hour + 1 === 12
              ? "12"
              : `${hour + 1}`;
        const startPeriod = hour >= 12 ? "pm" : "am";
        const endPeriod = hour + 1 >= 12 ? "pm" : "am";

        return `${startTime}${startPeriod}-${endTime}${endPeriod}`;
      });
      slots.push({ day, times });
    });

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const [expandedDay, setExpandedDay] = useState<string | null>(
    null,
  );

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const toggleTimeSlot = (day: string, time: string) => {
    const slotKey = `${day} ${time}`;
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(slotKey)
        ? prev.availability.filter((item) => item !== slotKey)
        : [...prev.availability, slotKey],
    }));
  };

  const getSelectedCountForDay = (day: string) => {
    return formData.availability.filter((slot) =>
      slot.startsWith(day),
    ).length;
  };

  const competitionLevelOptions = [
    {
      value: "recreational",
      label: "Recreational - Fun and fitness focused",
    },
    {
      value: "competitive",
      label: "Competitive - Regular tournaments",
    },
    { value: "elite", label: "Elite - High-level competition" },
  ];

  const toggleSelection = (
    field: "expertise" | "availability" | "competitionLevel",
    value: string,
  ) => {
    if (field === "expertise") {
      setFormData((prev) => {
        const newExpertise = prev.expertise.includes(value)
          ? prev.expertise.filter((item) => item !== value)
          : [...prev.expertise, value];

        // Initialize or remove sport details
        const newSportDetails = { ...prev.sportDetails };
        if (
          newExpertise.includes(value) &&
          !newSportDetails[value]
        ) {
          newSportDetails[value] = {
            videoFile: "",
            videoFileName: "",
            coachingYears: "",
            playingYears: "",
            achievements: "",
          };
        } else if (!newExpertise.includes(value)) {
          delete newSportDetails[value];
        }

        return {
          ...prev,
          expertise: newExpertise,
          sportDetails: newSportDetails,
        };
      });
    } else if (field === "competitionLevel") {
      setFormData((prev) => ({
        ...prev,
        competitionLevel: prev.competitionLevel.includes(value)
          ? prev.competitionLevel.filter(
              (item) => item !== value,
            )
          : [...prev.competitionLevel, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      }));
    }
  };

  const updateSportDetail = (
    sport: string,
    field: keyof (typeof formData.sportDetails)[string],
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      sportDetails: {
        ...prev.sportDetails,
        [sport]: {
          ...prev.sportDetails[sport],
          [field]: value,
        },
      },
    }));
  };

  const countWords = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Use Object URL instead of base64 to avoid localStorage quota issues
      const objectUrl = URL.createObjectURL(file);
      setFormData({ ...formData, profilePicture: objectUrl });
    }
  };

  const removeProfilePicture = () => {
    // Revoke the object URL to free memory
    if (formData.profilePicture.startsWith("blob:")) {
      URL.revokeObjectURL(formData.profilePicture);
    }
    setFormData({ ...formData, profilePicture: "" });
  };

  const handleVideoUpload = (
    sport: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validVideoTypes = [
        "video/mp4",
        "video/quicktime",
        "video/webm",
        "video/x-msvideo",
        "video/avi",
      ];
      if (!validVideoTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          sportDetails: {
            ...prev.sportDetails,
            [sport]: {
              ...prev.sportDetails[sport],
              videoFile:
                "Please upload a valid video file (MP4, MOV, WebM, or AVI)",
            },
          },
        }));
        return;
      }

      // Validate file size (max 50MB)
      const maxSize = 16 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          sportDetails: {
            ...prev.sportDetails,
            [sport]: {
              ...prev.sportDetails[sport],
              videoFile:
                "Video file size must be less than 16MB",
            },
          },
        }));
        return;
      }

      // Clear any previous errors
      setErrors((prev) => ({
        ...prev,
        sportDetails: {
          ...prev.sportDetails,
          [sport]: {
            ...prev.sportDetails[sport],
            videoFile: "",
          },
        },
      }));

      // Use Object URL instead of base64 to avoid localStorage quota issues
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        sportDetails: {
          ...prev.sportDetails,
          [sport]: {
            ...prev.sportDetails[sport],
            videoFile: objectUrl,
            videoFileName: file.name,
          },
        },
      }));
    }
  };

  const removeVideo = (sport: string) => {
    // Revoke the object URL to free memory
    const videoFile = formData.sportDetails[sport]?.videoFile;
    if (videoFile && videoFile.startsWith("blob:")) {
      URL.revokeObjectURL(videoFile);
    }
    setFormData((prev) => ({
      ...prev,
      sportDetails: {
        ...prev.sportDetails,
        [sport]: {
          ...prev.sportDetails[sport],
          videoFile: "",
          videoFileName: "",
        },
      },
    }));
  };

  const handleNext = () => {
    // Clear previous errors
    setErrors({
      name: "",
      email: "",
    password: "",
      gender: "",
      expertise: "",
      coachingStyle: "",
      sportDetails: {},
      competitionLevel: "",
      rate: "",
      availability: "",
    });

    let hasErrors = false;
    const newErrors: typeof errors = {
      name: "",
      email: "",
    password: "",
      gender: "",
      expertise: "",
      coachingStyle: "",
      sportDetails: {},
      competitionLevel: "",
      rate: "",
      availability: "",
    };

    // Step 1 validation
    if (step === 1) {
      if (formData.name.trim() === "") {
        newErrors.name = "Full name is required.";
        hasErrors = true;
      }
      if (formData.email.trim() === "") {
        newErrors.email = "Email address is required.";
        hasErrors = true;
      } else if (
        !formData.email.includes("@") ||
        !formData.email.includes(".")
      ) {
        newErrors.email = "Email format not valid.";
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
    }

    // Step 2 validation
    if (step === 2) {
      if (formData.expertise.length === 0) {
        newErrors.expertise =
          "Please select at least one sport.";
        hasErrors = true;
      }

      // Validate coaching style
      const coachingStyleWords = countWords(
        formData.coachingStyle,
      );
      if (formData.coachingStyle.trim() === "") {
        newErrors.coachingStyle = "Coaching style is required.";
        hasErrors = true;
      } else if (coachingStyleWords > 150) {
        newErrors.coachingStyle = `Exceeds 150 words (currently ${coachingStyleWords} words).`;
        hasErrors = true;
      }

      // Validate each selected sport
      for (const sport of formData.expertise) {
        const details = formData.sportDetails[sport];
        if (!details) {
          if (!newErrors.sportDetails[sport]) {
            newErrors.sportDetails[sport] = {
              videoFile: "",
              coachingYears: "",
              playingYears: "",
              achievements: "",
            };
          }
          hasErrors = true;
          continue;
        }

        if (!newErrors.sportDetails[sport]) {
          newErrors.sportDetails[sport] = {
            videoFile: "",
            coachingYears: "",
            playingYears: "",
            achievements: "",
          };
        }

        // Validate video file
        if (
          !details.videoFile ||
          details.videoFile.trim() === ""
        ) {
          newErrors.sportDetails[sport].videoFile =
            "Video file is required.";
          hasErrors = true;
        }

        // Validate coaching years
        if (details.coachingYears.trim() === "") {
          newErrors.sportDetails[sport].coachingYears =
            "Years coaching is required.";
          hasErrors = true;
        } else if (parseFloat(details.coachingYears) < 0) {
          newErrors.sportDetails[sport].coachingYears =
            "Cannot be negative.";
          hasErrors = true;
        }

        // Validate playing years
        if (details.playingYears.trim() === "") {
          newErrors.sportDetails[sport].playingYears =
            "Years playing is required.";
          hasErrors = true;
        } else if (parseFloat(details.playingYears) < 0) {
          newErrors.sportDetails[sport].playingYears =
            "Cannot be negative.";
          hasErrors = true;
        }

        // Validate achievements
        if (details.achievements.trim() === "") {
          newErrors.sportDetails[sport].achievements =
            "Achievements are required.";
          hasErrors = true;
        } else {
          const achievementsWords = countWords(
            details.achievements,
          );
          if (achievementsWords > 100) {
            newErrors.sportDetails[sport].achievements =
              `Exceeds 100 words (currently ${achievementsWords} words).`;
            hasErrors = true;
          }
        }
      }
    }

    // Step 3 validation
    if (step === 3) {
      if (formData.competitionLevel.length === 0) {
        newErrors.competitionLevel =
          "Please select a competition level.";
        hasErrors = true;
      }

      if (formData.rate.trim() === "") {
        newErrors.rate = "Fee per lesson is required.";
        hasErrors = true;
      } else if (parseFloat(formData.rate) < 0) {
        newErrors.rate = "Cannot be negative.";
        hasErrors = true;
      }

      if (formData.availability.length === 0) {
        newErrors.availability =
          "Please select at least one time slot.";
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
      // Save coach data to localStorage (without file data to avoid quota issues)
      try {
        const coaches = JSON.parse(
          localStorage.getItem("coaches") || "[]",
        );

        // Create a clean copy of sportDetails without video Object URLs
        const cleanSportDetails: typeof formData.sportDetails =
          {};
        Object.keys(formData.sportDetails).forEach((sport) => {
          cleanSportDetails[sport] = {
            ...formData.sportDetails[sport],
            videoFile: "", // Don't store video data in localStorage
            videoFileName:
              formData.sportDetails[sport].videoFileName, // Keep filename for reference
          };
        });

        const newCoach = {
          ...formData,
          profilePicture: "", // Don't store profile picture in localStorage
          sportDetails: cleanSportDetails,
          id: Date.now(),
          type: "coach",
          bio: formData.coachingStyle,
          students: [], // Initialize empty students array
        };
        coaches.push(newCoach);
        localStorage.setItem(
          "coaches",
          JSON.stringify(coaches),
        );

        // Clean up Object URLs to prevent memory leaks
        if (formData.profilePicture.startsWith("blob:")) {
          URL.revokeObjectURL(formData.profilePicture);
        }
        Object.values(formData.sportDetails).forEach(
          (details) => {
            if (
              details.videoFile &&
              details.videoFile.startsWith("blob:")
            ) {
              URL.revokeObjectURL(details.videoFile);
            }
          },
        );

        // Navigate to coach's student view
        navigate("/my-students", {
          state: { coachId: newCoach.id },
        });
      } catch (error) {
        // Handle QuotaExceededError by clearing old data and retrying
        if (
          error instanceof DOMException &&
          error.name === "QuotaExceededError"
        ) {
          console.warn(
            "localStorage quota exceeded. Clearing old data and retrying...",
          );

          // Clear existing coaches data to free up space
          localStorage.removeItem("coaches");

          // Create a clean copy of sportDetails without video Object URLs
          const cleanSportDetails: typeof formData.sportDetails =
            {};
          Object.keys(formData.sportDetails).forEach(
            (sport) => {
              cleanSportDetails[sport] = {
                ...formData.sportDetails[sport],
                videoFile: "", // Don't store video data in localStorage
                videoFileName:
                  formData.sportDetails[sport].videoFileName,
              };
            },
          );

          const newCoach = {
            ...formData,
            profilePicture: "", // Don't store profile picture in localStorage
            sportDetails: cleanSportDetails,
            id: Date.now(),
            type: "coach",
            bio: formData.coachingStyle,
            students: [],
          };

          // Try saving again with just the new coach
          try {
            localStorage.setItem(
              "coaches",
              JSON.stringify([newCoach]),
            );

            // Clean up Object URLs
            if (formData.profilePicture.startsWith("blob:")) {
              URL.revokeObjectURL(formData.profilePicture);
            }
            Object.values(formData.sportDetails).forEach(
              (details) => {
                if (
                  details.videoFile &&
                  details.videoFile.startsWith("blob:")
                ) {
                  URL.revokeObjectURL(details.videoFile);
                }
              },
            );

            navigate("/my-students", {
              state: { coachId: newCoach.id },
            });
          } catch (retryError) {
            console.error(
              "Failed to save coach data after clearing storage:",
              retryError,
            );
            alert(
              "Unable to save your profile. Please try refreshing the page and submitting again.",
            );
          }
        } else {
          console.error("Error saving coach data:", error);
          alert(
            "An error occurred while saving your profile. Please try again.",
          );
        }
      }
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
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="shell-pattern"
              x="0"
              y="0"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <g transform="translate(60, 60)">
                <path
                  d="M 0,-30 Q 20,-25 25,-10 Q 28,0 25,10 Q 20,25 0,30 Q -20,25 -25,10 Q -28,0 -25,-10 Q -20,-25 0,-30 Z"
                  fill="white"
                  opacity="0.6"
                />
                <path
                  d="M 0,-25 L 0,25 M -15,-15 L 15,15 M 15,-15 L -15,15 M -20,0 L 20,0"
                  stroke="white"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="5"
                  fill="white"
                  opacity="0.8"
                />
              </g>
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#shell-pattern)"
          />
        </svg>
      </div>

      <div className="max-w-2xl w-full space-y-6 mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Coach Registration
          </h1>
          <p className="text-white/90 mt-2 drop-shadow">
            Step {step} of {totalSteps}
          </p>
        </div>

        <Progress value={progress} className="w-full" />

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Personal Information"}
              {step === 2 && "Coaching Background"}
              {step === 3 && "Private Lessons Details"}
              {step === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Share your coaching credentials"}
              {step === 3 && "Set your lesson preferences"}
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
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        gender: value,
                      })
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">
                        Female
                      </SelectItem>
                      <SelectItem value="Non-binary">
                        Non-binary
                      </SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                      <SelectItem value="Other">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm">
                      {errors.gender}
                    </p>
                  )}
                  {formData.gender === "Other" && (
                    <div className="space-y-2 mt-2">
                      <Input
                        id="customGender"
                        placeholder="Please specify"
                        value={formData.customGender}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customGender: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email}
                    </p>
                  )}
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profilePicture">
                    Profile Picture (Optional)
                  </Label>
                  <p className="text-sm font-medium text-gray-700">
                    Click below to choose your profile picture
                  </p>
                  <div className="space-y-3">
                    {formData.profilePicture ? (
                      <div className="relative w-32 h-32 mx-auto">
                        <img
                          src={formData.profilePicture}
                          alt="Profile preview"
                          className="w-full h-full object-cover rounded-full border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors pointer-events-none">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Your profile picture will appear here
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG or GIF (MAX. 5MB)
                        </p>
                      </div>
                    )}
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload a professional photo of yourself to
                    help students recognize you
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Club Sports (Select all that apply) *
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {expertiseOptions.map((option) => (
                      <Badge
                        key={option}
                        variant={
                          formData.expertise.includes(option)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          toggleSelection("expertise", option)
                        }
                      >
                        {formData.expertise.includes(
                          option,
                        ) && <Check className="w-3 h-3 mr-1" />}
                        {option}
                      </Badge>
                    ))}
                  </div>
                  {errors.expertise && (
                    <p className="text-red-500 text-sm">
                      {errors.expertise}
                    </p>
                  )}
                </div>

                {/* Sport-specific details for each selected sport */}
                {formData.expertise.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-lg mb-3">
                        Sport-Specific Details
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Fill out the following information for
                        each sport you selected
                      </p>
                    </div>

                    {formData.expertise.map((sport) => (
                      <div
                        key={sport}
                        className="border rounded-lg p-4 space-y-4 bg-gray-50"
                      >
                        <h4 className="font-semibold text-md text-primary">
                          {sport}
                        </h4>

                        <div className="space-y-2">
                          <Label htmlFor={`${sport}-video`}>
                            Video of You Playing *
                          </Label>
                          <p className="text-sm font-medium text-gray-700">
                            Upload a video showcasing your
                            playing ability
                          </p>
                          <div className="space-y-3">
                            {formData.sportDetails[sport]
                              ?.videoFile ? (
                              <div className="relative border-2 border-green-300 rounded-lg p-4 bg-green-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-green-500 text-white rounded-full p-2">
                                      <Check className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm">
                                        Video Uploaded
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {
                                          formData.sportDetails[
                                            sport
                                          ]?.videoFileName
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeVideo(sport)
                                    }
                                    className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                {formData.sportDetails[sport]
                                  ?.videoFile && (
                                  <video
                                    src={
                                      formData.sportDetails[
                                        sport
                                      ]?.videoFile
                                    }
                                    controls
                                    className="w-full mt-3 rounded-lg max-h-48"
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors pointer-events-none">
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 mb-2">
                                  Your video will appear here
                                </p>
                                <p className="text-xs text-gray-500">
                                  MP4, MOV, WebM, or AVI (MAX.
                                  50MB)
                                </p>
                              </div>
                            )}
                            <Input
                              id={`${sport}-video`}
                              type="file"
                              accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/avi"
                              onChange={(e) =>
                                handleVideoUpload(sport, e)
                              }
                              className="cursor-pointer"
                            />
                          </div>
                          {errors.sportDetails[sport]
                            ?.videoFile && (
                            <p className="text-red-500 text-sm">
                              {
                                errors.sportDetails[sport]
                                  ?.videoFile
                              }
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor={`${sport}-coaching`}
                            >
                              Years Coaching {sport} *
                            </Label>
                            <Input
                              id={`${sport}-coaching`}
                              type="number"
                              min="0"
                              placeholder="3"
                              value={
                                formData.sportDetails[sport]
                                  ?.coachingYears || ""
                              }
                              onChange={(e) =>
                                updateSportDetail(
                                  sport,
                                  "coachingYears",
                                  e.target.value,
                                )
                              }
                            />
                            {errors.sportDetails[sport]
                              ?.coachingYears && (
                              <p className="text-red-500 text-sm">
                                {
                                  errors.sportDetails[sport]
                                    ?.coachingYears
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${sport}-playing`}>
                              Years Playing {sport} *
                            </Label>
                            <Input
                              id={`${sport}-playing`}
                              type="number"
                              min="0"
                              placeholder="10"
                              value={
                                formData.sportDetails[sport]
                                  ?.playingYears || ""
                              }
                              onChange={(e) =>
                                updateSportDetail(
                                  sport,
                                  "playingYears",
                                  e.target.value,
                                )
                              }
                            />
                            {errors.sportDetails[sport]
                              ?.playingYears && (
                              <p className="text-red-500 text-sm">
                                {
                                  errors.sportDetails[sport]
                                    ?.playingYears
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`${sport}-achievements`}
                          >
                            Key Achievements & Awards for{" "}
                            {sport} * (Max 100 words)
                          </Label>
                          <Textarea
                            id={`${sport}-achievements`}
                            placeholder={`Championships, awards, recognitions in ${sport}...`}
                            rows={3}
                            value={
                              formData.sportDetails[sport]
                                ?.achievements || ""
                            }
                            onChange={(e) =>
                              updateSportDetail(
                                sport,
                                "achievements",
                                e.target.value,
                              )
                            }
                          />
                          <p className="text-xs text-gray-500">
                            {countWords(
                              formData.sportDetails[sport]
                                ?.achievements || "",
                            )}
                            /100 words
                          </p>
                          {errors.sportDetails[sport]
                            ?.achievements && (
                            <p className="text-red-500 text-sm">
                              {
                                errors.sportDetails[sport]
                                  ?.achievements
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="coachingStyle">
                    Overall Coaching Style & Philosophy * (Max
                    150 words)
                  </Label>
                  <Textarea
                    id="coachingStyle"
                    placeholder="Describe your general approach to coaching, training methods, and philosophy..."
                    rows={4}
                    value={formData.coachingStyle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coachingStyle: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    {countWords(formData.coachingStyle)}/150
                    words
                  </p>
                  {errors.coachingStyle && (
                    <p className="text-red-500 text-sm">
                      {errors.coachingStyle}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certification">
                    Certifications
                  </Label>
                  <Input
                    id="certification"
                    placeholder="e.g., USSF License, CPR/First Aid, etc."
                    value={formData.certification}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certification: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>
                    Competition Level * (Select at least 1)
                  </Label>
                  <p className="text-sm text-gray-600">
                    Choose all competition levels you can coach
                  </p>
                  <div className="space-y-3">
                    {competitionLevelOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition-all ${
                          formData.competitionLevel.includes(
                            option.value,
                          )
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          toggleSelection(
                            "competitionLevel",
                            option.value,
                          )
                        }
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            formData.competitionLevel.includes(
                              option.value,
                            )
                              ? "bg-primary border-primary"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.competitionLevel.includes(
                            option.value,
                          ) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <Label
                          htmlFor={option.value}
                          className="cursor-pointer font-normal flex-1"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {formData.competitionLevel.length} level
                    {formData.competitionLevel.length !== 1
                      ? "s"
                      : ""}{" "}
                    selected
                  </p>
                  {errors.competitionLevel && (
                    <p className="text-red-500 text-sm">
                      {errors.competitionLevel}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">
                    Fee per Private Lesson (USD) *
                  </Label>
                  <Input
                    id="rate"
                    type="number"
                    min="0"
                    placeholder="50"
                    value={formData.rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rate: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    One-on-one private coaching session
                  </p>
                  {errors.rate && (
                    <p className="text-red-500 text-sm">
                      {errors.rate}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>
                    Lesson Availability * (Select all that work)
                  </Label>
                  <div className="border rounded-lg divide-y">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.day}
                        className="overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleDay(slot.day)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-sm">
                            {slot.day}
                            {getSelectedCountForDay(slot.day) >
                              0 && (
                              <span className="ml-2 text-xs text-primary">
                                (
                                {getSelectedCountForDay(
                                  slot.day,
                                )}{" "}
                                selected)
                              </span>
                            )}
                          </span>
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              expandedDay === slot.day
                                ? "rotate-180"
                                : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {expandedDay === slot.day && (
                          <div className="px-4 py-3 bg-gray-50 grid grid-cols-3 gap-2">
                            {slot.times.map((time) => (
                              <div
                                key={time}
                                onClick={() =>
                                  toggleTimeSlot(slot.day, time)
                                }
                                className={`px-3 py-2 rounded text-center cursor-pointer text-sm transition-colors ${
                                  formData.availability.includes(
                                    `${slot.day} ${time}`,
                                  )
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-white border hover:border-primary"
                                }`}
                              >
                                {formData.availability.includes(
                                  `${slot.day} ${time}`,
                                ) && (
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
                    {formData.availability.length} time slot
                    {formData.availability.length !== 1
                      ? "s"
                      : ""}{" "}
                    selected
                  </p>
                  {errors.availability && (
                    <p className="text-red-500 text-sm">
                      {errors.availability}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {formData.profilePicture && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={formData.profilePicture}
                        alt="Profile"
                        className="w-24 h-24 object-cover rounded-full border-2 border-primary"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">
                      Name
                    </p>
                    <p className="font-medium">
                      {formData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Email
                    </p>
                    <p className="font-medium">
                      {formData.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Gender
                    </p>
                    <p className="font-medium">
                      {formData.gender === "Other"
                        ? formData.customGender
                        : formData.gender}
                    </p>
                  </div>

                  {/* Sport-specific details */}
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm text-gray-600 font-semibold mb-2">
                      Sports & Expertise
                    </p>
                    {formData.expertise.map((sport) => {
                      const details =
                        formData.sportDetails[sport];
                      return (
                        <div
                          key={sport}
                          className="mb-4 pb-3 border-b last:border-b-0"
                        >
                          <p className="font-semibold text-primary mb-2">
                            {sport}
                          </p>
                          <div className="pl-3 space-y-2 text-sm">
                            {details?.videoFile && (
                              <div>
                                <span className="text-gray-600">
                                  Video:{" "}
                                </span>
                                <div className="mt-1">
                                  <p className="text-xs text-gray-500 mb-1">
                                    {details?.videoFileName}
                                  </p>
                                  <video
                                    src={details?.videoFile}
                                    controls
                                    className="w-full rounded-lg max-h-48"
                                  />
                                </div>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-600">
                                Coaching Experience:{" "}
                              </span>
                              <span className="font-medium">
                                {details?.coachingYears} years
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Playing Experience:{" "}
                              </span>
                              <span className="font-medium">
                                {details?.playingYears} years
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Achievements:{" "}
                              </span>
                              <span className="font-medium">
                                {details?.achievements}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">
                      Overall Coaching Style
                    </p>
                    <p className="font-medium text-sm">
                      {formData.coachingStyle}
                    </p>
                  </div>
                  {formData.certification && (
                    <div>
                      <p className="text-sm text-gray-600">
                        Certifications
                      </p>
                      <p className="font-medium text-sm">
                        {formData.certification}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">
                      Competition Level
                    </p>
                    <p className="font-medium capitalize">
                      {formData.competitionLevel
                        .map((level) => level.replace("-", " "))
                        .join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Fee per Lesson
                    </p>
                    <p className="font-medium">
                      ${formData.rate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Availability
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.availability.map((avail) => (
                        <Badge key={avail} variant="secondary">
                          {avail}
                        </Badge>
                      ))}
                    </div>
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
                {step === totalSteps ? "Submit" : "Continue"}
                {step < totalSteps && (
                  <ArrowRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}










