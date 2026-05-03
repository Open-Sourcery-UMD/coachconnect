content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

old_time = "              <label className='text-sm font-bold text-gray-700'>Time</label>\n              <input type='time' value={bookingTime} onChange={e => setBookingTime(e.target.value)}\n                className='w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none text-gray-800' />"

new_time = "              <label className='text-sm font-bold text-gray-700'>Available Times</label>\n              {bookingStudent?.preferred_times && bookingStudent.preferred_times.length > 0 ? (\n                <div className='flex flex-wrap gap-2'>\n                  {bookingStudent.preferred_times.map((time: string) => (\n                    <button key={time} onClick={() => setBookingTime(time)}\n                      className='px-3 py-2 rounded-xl text-sm font-semibold transition-all'\n                      style={{ background: bookingTime === time ? '#E21833' : '#f5f5f5', color: bookingTime === time ? 'white' : '#333', border: bookingTime === time ? 'none' : '1px solid #ddd', cursor: 'pointer' }}>\n                      {time}\n                    </button>\n                  ))}\n                </div>\n              ) : (\n                <p className='text-sm text-gray-500 italic'>No preferred times listed.</p>\n              )}"

if old_time in content:
    content = content.replace(old_time, new_time)
    print("Fixed!")
else:
    print("Not found")

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
