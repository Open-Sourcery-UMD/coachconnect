content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

# Add booking state
content = content.replace(
    "  const [isProfileOpen, setIsProfileOpen] = useState(false);",
    """  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStudent, setBookingStudent] = useState<Student | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingSport, setBookingSport] = useState('');"""
)

# Add handleBook function after handleViewProfile
content = content.replace(
    "  const handleViewProfile = (student: Student) => { setSelectedStudent(student); setIsProfileOpen(true); };",
    """  const handleViewProfile = (student: Student) => { setSelectedStudent(student); setIsProfileOpen(true); };
  const handleBook = (student: Student) => { setBookingStudent(student); setBookingSport(student.interests[0] || ''); setIsBookingOpen(true); };
  const handleConfirmBooking = () => {
    if (!bookingDate || !bookingTime) { alert('Please select a date and time'); return; }
    const sessions = JSON.parse(localStorage.getItem('cc_sessions') || '[]');
    sessions.push({
      id: Date.now().toString(),
      studentName: bookingStudent?.name,
      studentId: bookingStudent?.id,
      sport: bookingSport,
      date: bookingDate,
      time: bookingTime,
      coachId: auth.currentUser?.uid
    });
    localStorage.setItem('cc_sessions', JSON.stringify(sessions));
    setIsBookingOpen(false);
    setBookingDate('');
    setBookingTime('');
    alert('Session booked with ' + bookingStudent?.name + ' on ' + bookingDate + ' at ' + bookingTime + '!');
  };"""
)

# Change Book Student button to use handleBook
content = content.replace(
    "onClick={() => handleViewProfile(student)}>\n                        Book Student",
    "onClick={() => handleBook(student)}>\n                        Book Student"
)

# Add booking dialog before closing Dialog tag
content = content.replace(
    "    </div>\n  );\n}",
    """      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold'>Book Session</DialogTitle>
            <DialogDescription>Schedule a session with {bookingStudent?.name}</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            <div className='space-y-1'>
              <label className='text-sm font-bold text-gray-700'>Sport</label>
              <select value={bookingSport} onChange={e => setBookingSport(e.target.value)}
                className='w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-gray-800' style={{ cursor: 'pointer' }}>
                {bookingStudent?.interests.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-bold text-gray-700'>Date</label>
              <input type='date' value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className='w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-gray-800' />
            </div>
            <div className='space-y-1'>
              <label className='text-sm font-bold text-gray-700'>Time</label>
              <input type='time' value={bookingTime} onChange={e => setBookingTime(e.target.value)}
                className='w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-gray-800' />
            </div>
          </div>
          <div className='flex gap-3 pt-2'>
            <Button className='flex-1 py-4 font-semibold rounded-xl' style={{ background: '#E21833', color: 'white', cursor: 'pointer' }} onClick={handleConfirmBooking}>
              Confirm Booking
            </Button>
            <Button variant='outline' className='rounded-xl' style={{ cursor: 'pointer' }} onClick={() => setIsBookingOpen(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );\n}"""
)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
