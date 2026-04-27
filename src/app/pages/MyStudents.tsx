import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, LogOut, Mail, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  interests: string[];
  goals: string;
  level: string;
  budget: string;
  preferredTimes: string[];
  type: string;
}

export default function MyStudents() {
  const navigate = useNavigate();
  const location = useLocation();
  const coachId = location.state?.coachId;
  const [myStudents, setMyStudents] = useState<Student[]>([]);
  const [coach, setCoach] = useState<any>(null);

  useEffect(() => {
    // Load coach data
    const coaches = JSON.parse(localStorage.getItem("coaches") || "[]");
    const foundCoach = coaches.find((c: any) => c.id === coachId);
    setCoach(foundCoach);

    // Load all students and filter by matching sports
    const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
    
    if (foundCoach) {
      // Find students whose interests overlap with coach's expertise
      const matched = allStudents.filter((student: Student) =>
        student.interests.some((interest) => foundCoach.expertise.includes(interest))
      );
      setMyStudents(matched);
    }
  }, [coachId]);

  const handleContact = (student: Student) => {
    alert(`You can now contact ${student.name} at ${student.email}`);
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #FF6B7A 0%, #FFE680 100%)'
    }}>
      {/* Shell pattern background */}
      <div className="absolute inset-0 opacity-5">
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

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">My Students</h1>
            {coach && (
              <p className="text-white/90 mt-1 drop-shadow">
                Students interested in: {coach.expertise.join(", ")}
              </p>
            )}
          </div>
          <Button variant="destructive" onClick={() => navigate("/")} className="bg-red-600 hover:bg-red-700" style={{ cursor: 'pointer' }}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {myStudents.length === 0 ? (
          <Alert className="bg-white/90">
            <Users className="h-4 w-4" />
            <AlertTitle>No Students Yet</AlertTitle>
            <AlertDescription>
              No students have signed up for your sports yet. Check back later as more students join the platform!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-white/90 drop-shadow">
              {myStudents.length} {myStudents.length === 1 ? "student" : "students"} interested in your coaching
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {myStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow bg-white/95">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{student.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1 capitalize">
                          {student.level} Level
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Athletic Goals:</p>
                      <p className="text-sm text-gray-600 line-clamp-3">{student.goals}</p>
                    </div>

                    <div className="space-y-2">
                      {student.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{student.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Interested Sports:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.interests.map((interest) => {
                          const isMatch = coach?.expertise.includes(interest);
                          return (
                            <Badge 
                              key={interest} 
                              variant={isMatch ? "default" : "secondary"}
                            >
                              {interest}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {student.preferredTimes.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Preferred Times:</p>
                        <div className="flex flex-wrap gap-1">
                          {student.preferredTimes.map((time) => (
                            <Badge key={time} variant="outline">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button className="w-full" style={{ cursor: 'pointer' }} onClick={() => handleContact(student)}>
                      Contact Student
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}