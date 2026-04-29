content = '''import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { LogOut, Mail, Phone, Users, SlidersHorizontal } from "lucide-react";
import { getStudents } from "../utils/api";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

interface Student {
  id: string; name: string; email: string; phone: string;
  interests: string[]; goals: string; level: string; budget: string;
  preferred_times: string[]; graduation_year: string; role: string;
}

const SPORTS = ["Soccer", "Basketball", "Tennis", "Volleyball", "Baseball", "Softball", "Swimming", "Track", "Football", "Golf"];
const LEVELS = ["beginner", "intermediate", "advanced"];

export default function MyStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [minBudget, setMinBudget] = useState<string>("");
  const coachName = auth.currentUser?.displayName || auth.currentUser?.email?.split("@")[0] || "Coach";

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try { const data = await getStudents(); setStudents(Array.isArray(data) ? data : []); } 
    catch (err) { console.error(err); setStudents([]); }
    setLoading(false);
  };

  const handleLogout = async () => { await signOut(auth); navigate("/"); };
  const toggleSport = (sport: string) => { setSelectedSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]); };

  const filteredStudents = students.filter(student => {
    if (selectedSports.length > 0 && !student.interests.some(s => selectedSports.includes(s))) return false;
    if (selectedLevel && student.level !== selectedLevel) return false;
    if (minBudget !== "" && parseFloat(student.budget || "0") < parseFloat(minBudget)) return false;
    return true;
  });

  const handleViewProfile = (student: Student) => { setSelectedStudent(student); setIsProfileOpen(true); };
  const handleContact = (student: Student) => { alert("Contact request sent to " + student.name + " at " + student.email + "!"); setIsProfileOpen(false); };

  const getLevelBadge = (level: string) => {
    if (level === "beginner") return { bg: "#E8F5E9", color: "#2E7D32", label: "Beginner" };
    if (level === "intermediate") return { bg: "#FFF3E0", color: "#E65100", label: "Intermediate" };
    if (level === "advanced") return { bg: "#FCE4EC", color: "#C62828", label: "Advanced" };
    return { bg: "#F5F5F5", color: "#333", label: level || "Unknown" };
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)" }}>
      <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-20" style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(10px)" }}>
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Apple Chancery, cursive" }}>Coach Connect</h1>
          <p className="text-white/70 text-sm">Welcome, {coachName}</p>
        </div>
        <p className="text-white/80 text-sm font-medium">{loading ? "Loading..." : filteredStudents.length + " students found"}</p>
        <Button onClick={handleLogout} className="bg-[#E21833] hover:bg-red-700 text-white border-0" style={{ cursor: "pointer" }}>
          <LogOut className="w-4 h-4 mr-2" />Logout
        </Button>
      </div>

      <div className="flex max-w-7xl mx-auto px-4 py-6 gap-6">
        <div className="w-56 flex-shrink-0">
          <div className="rounded-2xl p-5 sticky top-20 space-y-5" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.3)" }}>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-white" />
              <h2 className="font-bold text-white">Filter Students</h2>
            </div>
            <div>
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Sport</p>
              <div className="space-y-2">
                {SPORTS.map(sport => (
                  <label key={sport} className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => toggleSport(sport)} className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                      style={{ background: selectedSports.includes(sport) ? "#FFD200" : "transparent", borderColor: selectedSports.includes(sport) ? "#FFD200" : "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                    </div>
                    <span className="text-sm text-white/90">{sport}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Level</p>
              <div className="space-y-2">
                {LEVELS.map(level => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <div onClick={() => setSelectedLevel(selectedLevel === level ? "" : level)} className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{ background: selectedLevel === level ? "#FFD200" : "transparent", borderColor: selectedLevel === level ? "#FFD200" : "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                      {selectedLevel === level && <div className="w-2 h-2 rounded-full bg-black"></div>}
                    </div>
                    <span className="text-sm text-white/90 capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Min Budget ($/hr)</p>
              <input type="number" placeholder="Any budget" value={minBudget}
                onChange={e => { const val = e.target.value; if (val === "" || parseFloat(val) >= 0) setMinBudget(val); }}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", color: "white" }} />
            </div>
            {(selectedSports.length > 0 || selectedLevel || minBudget) && (
              <button onClick={() => { setSelectedSports([]); setSelectedLevel(""); setMinBudget(""); }}
                className="w-full text-sm font-bold py-2 rounded-lg"
                style={{ background: "#E21833", color: "white", cursor: "pointer", border: "none" }}>
                Clear all filters
              </button>
            )}
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64"><p className="text-white text-lg">Loading students...</p></div>
          ) : filteredStudents.length === 0 ? (
            <Alert className="border-white/20" style={{ background: "rgba(255,255,255,0.15)" }}>
              <Users className="h-4 w-4 text-white" />
              <AlertTitle className="text-white">No Students Found</AlertTitle>
              <AlertDescription className="text-white/80">No students have signed up yet or try adjusting your filters!</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
              {filteredStudents.map((student) => {
                const badge = getLevelBadge(student.level);
                return (
                  <div key={student.id} className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.3)" }}>
                    <div className="p-5">
                      <div className="flex gap-4 mb-3">
                        <div className="w-14 h-14 flex-shrink-0 rounded-full flex items-center justify-center text-white text-2xl font-black"
                          style={{ background: "linear-gradient(135deg, #E21833, #FFD200)" }}>
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{student.name}</h3>
                          <p className="text-xs text-gray-500">Class of {student.graduation_year || "N/A"}</p>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold mt-1 inline-block" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400">budget</p>
                          <p className="text-xl font-black text-gray-900">${student.budget || "0"}<span className="text-xs font-normal text-gray-400">/hr</span></p>
                        </div>
                      </div>
                      {student.goals && <p className="text-sm text-gray-600 mb-3 line-clamp-2 italic">"{student.goals}"</p>}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {student.interests.map(interest => (
                          <span key={interest} className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#FFF3F4", color: "#E21833" }}>{interest}</span>
                        ))}
                      </div>
                      <Button className="w-full font-semibold rounded-xl" style={{ background: "#E21833", color: "white", cursor: "pointer" }} onClick={() => handleViewProfile(student)}>
                        View Profile
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (() => { const badge = getLevelBadge(selectedStudent.level); return (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0 rounded-full flex items-center justify-center text-white text-3xl font-black"
                    style={{ background: "linear-gradient(135deg, #E21833, #FFD200)" }}>
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl font-bold">{selectedStudent.name}</DialogTitle>
                    <DialogDescription className="sr-only">Profile for {selectedStudent.name}</DialogDescription>
                    <p className="text-gray-500 text-sm mt-1">Class of {selectedStudent.graduation_year || "N/A"}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize mt-2 inline-block" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">budget</p>
                    <p className="text-2xl font-black" style={{ color: "#E21833" }}>${selectedStudent.budget || "0"}<span className="text-sm font-normal text-gray-500">/hr</span></p>
                  </div>
                </div>
              </DialogHeader>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Athletic Goals</h3>
                <p className="text-gray-600 text-sm italic">"{selectedStudent.goals || "No goals specified"}"</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Interested Sports</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.interests.map(interest => (
                    <span key={interest} className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: "#FFF3F4", color: "#E21833" }}>{interest}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Preferred Times</h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedStudent.preferred_times || []).map((time, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">{time}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Contact</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gray-400" /><span>{selectedStudent.email}</span></div>
                  {selectedStudent.phone && <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-400" /><span>{selectedStudent.phone}</span></div>}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="flex-1 py-5 text-base font-semibold rounded-xl" style={{ background: "#E21833", color: "white", cursor: "pointer" }} onClick={() => handleContact(selectedStudent)}>
                  Contact Student
                </Button>
                <Button variant="outline" className="rounded-xl" style={{ cursor: "pointer" }} onClick={() => setIsProfileOpen(false)}>Close</Button>
              </div>
            </div>
          ); })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
'''

with open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done!")
