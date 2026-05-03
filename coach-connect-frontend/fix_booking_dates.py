content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

# Replace date input with generated dates from preferred times
old_date = """            <div className='space-y-1'>
              <label className='text-sm font-bold text-gray-700'>Date</label>
              <input type='date' value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className='w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-gray-800' />
            </div>"""

new_date = """            <div className='space-y-1'>
              <label className='text-sm font-bold text-gray-700'>Select Date & Time</label>
              <div className='flex flex-wrap gap-2 max-h-48 overflow-y-auto'>
                {bookingStudent?.preferred_times && bookingStudent.preferred_times.flatMap((slot: string) => {
                  const dayMap: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
                  const dayName = slot.split(' ')[0];
                  const targetDay = dayMap[dayName];
                  if (targetDay === undefined) return [];
                  const slots = [];
                  const today = new Date();
                  for (let week = 0; week < 4; week++) {
                    const d = new Date(today);
                    const diff = (targetDay - today.getDay() + 7) % 7 + week * 7;
                    if (diff === 0 && week === 0) continue;
                    d.setDate(today.getDate() + (diff === 0 ? 7 : diff));
                    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " (" + dayName + ")";
                    const val = d.toISOString().split("T")[0] + "|" + slot.split(" ").slice(1).join(" ");
                    slots.push({ label, val, slot });
                  }
                  return slots;
                }).map((item: any) => (
                  <button key={item.val} onClick={() => { setBookingDate(item.val.split("|")[0]); setBookingTime(item.slot); }}
                    className='px-3 py-2 rounded-xl text-sm font-semibold transition-all text-left'
                    style={{ background: bookingDate === item.val.split("|")[0] && bookingTime === item.slot ? "#E21833" : "#f5f5f5", color: bookingDate === item.val.split("|")[0] && bookingTime === item.slot ? "white" : "#333", border: "1px solid #ddd", cursor: "pointer" }}>
                    {item.label}<br/><span className='text-xs opacity-70'>{item.slot.split(" ").slice(1).join(" ")}</span>
                  </button>
                ))}
              </div>
            </div>"""

if old_date in content:
    content = content.replace(old_date, new_date)
    print("Fixed!")
else:
    print("Not found - checking...")
    idx = content.find("Select Date")
    print("Already updated:", idx != -1)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
