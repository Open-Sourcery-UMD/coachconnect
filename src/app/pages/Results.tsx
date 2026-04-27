import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, LogOut, Mail, Phone, DollarSign, Clock, Star, AlertCircle, X, Calendar } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";

interface Coach {
  id: number;
  name: string;
  email: string;
  phone: string;
  expertise: string[];
  bio: string;
  experience: string;
  rate: string;
  availability: string[];
  type: string;
  profilePicture?: string;
  gender?: string;
  competitionLevel?: string[];
}

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const sports = useMemo(() => (location.state?.sports as string[]) || [], [location.state?.sports]);
  const [matchedCoaches, setMatchedCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Load coaches from localStorage and filter by sports
    const storedCoaches = JSON.parse(localStorage.getItem("coaches") || "[]") as Coach[];

    // Filter coaches that have at least one matching sport
    const filtered = storedCoaches.filter((coach) =>
      coach.expertise.some((sport) => sports.includes(sport))
    );

    setMatchedCoaches(filtered);
  }, [sports]);

  const handleViewProfile = (coach: Coach) => {
    setSelectedCoach(coach);
    setIsProfileOpen(true);
  };

  const handleConnect = (coach: Coach) => {
    alert(`Connection request sent to ${coach.name}! They will receive your contact information.`);
    setIsProfileOpen(false);
  };

  // Helper to organize availability by day
  const getScheduleByDay = (availability: string[]) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const schedule: Record<string, string[]> = {};

    days.forEach(day => {
      schedule[day] = availability
        .filter(slot => slot.startsWith(day))
        .map(slot => slot.replace(`${day} `, ''));
    });

    return schedule;
  };

  return (
    <div className="min-h-screen p-4 py-8 relative overflow-hidden" style={{ fontFamily: 'Apple Chancery, cursive' }}>
      {/* Shell pattern background */}
      <div className="fixed inset-0 opacity-5 -z-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="shell-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <g transform="translate(60, 60)">
                <path d="M 0,-30 Q 20,-25 25,-10 Q 28,0 25,10 Q 20,25 0,30 Q -20,25 -25,10 Q -28,0 -25,-10 Q -20,-25 0,-30 Z"
                      fill="#666" opacity="0.3"/>
                <path d="M 0,-25 L 0,25 M -15,-15 L 15,15 M 15,-15 L -15,15 M -20,0 L 20,0"
                      stroke="#666" strokeWidth="1.5" opacity="0.2"/>
                <circle cx="0" cy="0" r="5" fill="#666" opacity="0.4"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shell-pattern)"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          <div className="flex-1 text-center">
            <h1 className="text-5xl font-black text-gray-900" style={{ fontFamily: 'Apple Chancery, cursive' }}>Your Matched Coaches</h1>
          </div>
          <div className="flex-1 flex justify-end">
            <Button variant="destructive" onClick={() => navigate("/")} className="bg-red-600 hover:bg-red-700" style={{ cursor: 'pointer' }}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {matchedCoaches.length === 0 ? (
          <Alert className="bg-white border-2 border-gray-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Coaches Available</AlertTitle>
            <AlertDescription>
              We couldn't find any coaches for the sports you selected ({sports.join(", ")}).
              <br />
              Please check back later or try selecting different sports. Coaches are constantly joining our platform!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-lg text-gray-700 font-semibold">
              Found {matchedCoaches.length} {matchedCoaches.length === 1 ? "coach" : "coaches"} matching your interests
            </p>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {matchedCoaches.map((coach) => (
                <div key={coach.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border-2 border-gray-200">
                  {/* Top Badge */}
                  <div className="bg-[#FFD200] text-black text-xs font-bold px-4 py-2 text-center">
                    ⭐ TOP PRO
                  </div>

                  <div className="p-6">
                    {/* Profile Section */}
                    <div className="flex gap-4 mb-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        {coach.profilePicture ? (
                          <img
                            src={coach.profilePicture}
                            alt={coach.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-3xl font-bold">
                            {coach.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{coach.name.toUpperCase()}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">5.0</span>
                          <span className="text-gray-400">(New Coach)</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">📍 College Park, MD</p>
                        <Badge variant="outline" className="mt-2 text-xs">NEARBY PRO</Badge>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {coach.bio || "Passionate coach dedicated to helping students achieve their athletic goals."}
                    </p>

                    {/* Teaching Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {coach.expertise.map((exp) => (
                        <Badge
                          key={exp}
                          variant="secondary"
                          className="text-xs font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200"
                        >
                          TEACHES {exp.toUpperCase()}
                        </Badge>
                      ))}
                      {coach.competitionLevel && Array.isArray(coach.competitionLevel) && coach.competitionLevel.map((level: string) => (
                        <Badge
                          key={level}
                          variant="secondary"
                          className="text-xs font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200"
                        >
                          {level.toUpperCase()}
                        </Badge>
                      ))}
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${coach.rate || "50"}<span className="text-sm font-normal text-gray-600">/hr.</span>
                        </p>
                      </div>
                      <Button
                        className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleViewProfile(coach)}
                      >
                        VIEW PROFILE
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Detail Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedCoach && (
              <div className="space-y-6">
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-32 h-32 flex-shrink-0">
                        {selectedCoach.profilePicture ? (
                          <img
                            src={selectedCoach.profilePicture}
                            alt={selectedCoach.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-5xl font-bold">
                            {selectedCoach.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <DialogTitle className="text-3xl font-bold mb-2">{selectedCoach.name.toUpperCase()}</DialogTitle>
                        <DialogDescription className="sr-only">
                          View detailed profile for {selectedCoach.name}
                        </DialogDescription>
                        <div className="flex items-center gap-2 text-lg mb-2">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">5.0</span>
                          <span className="text-gray-400">(New Coach)</span>
                        </div>
                        <p className="text-base text-gray-600 mb-2">📍 College Park, MD</p>
                        <div className="flex gap-2 flex-wrap">
                          {selectedCoach.expertise.map((exp) => (
                            <Badge key={exp} variant="secondary" className="text-sm">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                {/* About Section */}
                <div>
                  <h3 className="text-xl font-bold mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedCoach.bio}</p>
                </div>

                {/* Rate */}
                <div>
                  <h3 className="text-xl font-bold mb-2">Pricing</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    ${selectedCoach.rate || "50"}<span className="text-lg font-normal text-gray-600">/hour</span>
                  </p>
                </div>

                {/* Weekly Schedule */}
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Weekly Availability
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    {Object.entries(getScheduleByDay(selectedCoach.availability)).map(([day, times]) => (
                      <div key={day} className="border-b last:border-b-0">
                        <div className="grid grid-cols-4 gap-4 p-3 hover:bg-gray-50">
                          <div className="font-semibold text-gray-900">{day}</div>
                          <div className="col-span-3">
                            {times.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {times.map((time, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-green-50 border-green-200 text-green-700">
                                    {time}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Not available</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews Section */}
                <div>
                  <h3 className="text-xl font-bold mb-3">Reviews</h3>
                  <div className="space-y-4">
                    {/* Sample Review 1 */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="font-semibold">Sarah M.</span>
                        <span className="text-gray-400 text-sm">• 2 weeks ago</span>
                      </div>
                      <p className="text-gray-700">
                        Excellent coach! Very knowledgeable and patient. My skills have improved significantly in just a few sessions.
                      </p>
                    </div>

                    {/* Sample Review 2 */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="font-semibold">Mike T.</span>
                        <span className="text-gray-400 text-sm">• 1 month ago</span>
                      </div>
                      <p className="text-gray-700">
                        Great experience! The coach really understands how to break down complex techniques into manageable steps.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-xl font-bold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{selectedCoach.email}</span>
                    </div>
                    {selectedCoach.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{selectedCoach.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connect Button */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-black hover:bg-gray-800 text-white py-6 text-lg font-semibold"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleConnect(selectedCoach)}
                  >
                    Connect with Coach
                  </Button>
                  <Button
                    variant="outline"
                    className="px-6"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}