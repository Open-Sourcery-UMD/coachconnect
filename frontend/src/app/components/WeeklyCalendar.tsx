import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarAppointment {
  id: string;
  slot: string;      // e.g. "Monday 8am-9am"
  status: string;
  label: string;     // name to display on the card
}

interface Props {
  appointments: CalendarAppointment[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const START_HOUR = 6;   // 6 AM
const END_HOUR = 22;    // 10 PM
const HOUR_H = 64;      // px per hour
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);
const TIME_COL_W = 52;  // px for the time label column

function fmtHour(h: number) {
  if (h === 0 || h === 24) return '12 AM';
  if (h === 12) return '12 PM';
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

function parseTime(t: string): number | null {
  const m = t.trim().match(/^(\d+)(?::(\d+))?\s*(am|pm)?$/i);
  if (!m) return null;
  let h = parseInt(m[1]);
  const min = parseInt(m[2] || '0');
  const p = m[3]?.toLowerCase();
  if (p === 'pm' && h !== 12) h += 12;
  if (p === 'am' && h === 12) h = 0;
  return h + min / 60;
}

function parseSlot(slot: string): { day: string; start: number; end: number } | null {
  const day = DAYS.find(d => slot.startsWith(d));
  if (!day) return null;
  const timeStr = slot.slice(day.length).trim();
  const dash = timeStr.indexOf('-');
  if (dash === -1) return null;
  const rawStart = timeStr.slice(0, dash).trim();
  const rawEnd = timeStr.slice(dash + 1).trim();
  let start = parseTime(rawStart);
  const end = parseTime(rawEnd);
  // If start lacks am/pm but end has it, borrow the period
  if (start !== null && end !== null && !/am|pm/i.test(rawStart) && /am|pm/i.test(rawEnd)) {
    const period = rawEnd.match(/am|pm/i)![0];
    start = parseTime(rawStart + period);
  }
  if (start === null || end === null) return null;
  return { day, start, end };
}

export default function WeeklyCalendar({ appointments }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to current time on first render
  useEffect(() => {
    if (weekOffset !== 0 || !scrollRef.current) return;
    const now = new Date();
    const currentFrac = now.getHours() + now.getMinutes() / 60;
    const top = Math.max(0, (currentFrac - START_HOUR - 1) * HOUR_H);
    scrollRef.current.scrollTop = top;
  }, []);

  const today = new Date();

  const getWeekDates = () => {
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + weekOffset * 7);
    return DAYS.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();

  const weekLabel = () => {
    const s = weekDates[0];
    const e = weekDates[6];
    const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
      d.toLocaleDateString('en-US', opts);
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
      return fmt(s, { month: 'long', year: 'numeric' }) + ' · ' + s.getDate() + '–' + e.getDate();
    }
    return fmt(s, { month: 'short', day: 'numeric' }) + ' – ' + fmt(e, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const accepted = appointments.filter(a => a.status === 'accepted');

  // Group parsed appointments by day
  const byDay: Record<string, Array<CalendarAppointment & { start: number; end: number }>> = {};
  DAYS.forEach(d => { byDay[d] = []; });
  accepted.forEach(appt => {
    const p = parseSlot(appt.slot);
    if (p) byDay[p.day].push({ ...appt, start: p.start, end: p.end });
  });

  const nowFrac = today.getHours() + today.getMinutes() / 60;
  const nowTop = (nowFrac - START_HOUR) * HOUR_H;
  const todayColIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;

  const totalH = HOUR_H * HOURS.length;

  return (
    <div className='rounded-2xl overflow-hidden w-full'
      style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.2)' }}>

      {/* ── Navigation ── */}
      <div className='flex items-center justify-between px-4 py-3'
        style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
        <button onClick={() => setWeekOffset(w => w - 1)}
          className='flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all'
          style={{ background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: 'white' }}>
          <ChevronLeft className='w-4 h-4' />Prev
        </button>

        <div className='text-center'>
          <p className='text-white font-bold text-sm'>{weekLabel()}</p>
          {weekOffset !== 0 && (
            <button onClick={() => setWeekOffset(0)}
              className='text-xs underline mt-0.5'
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,210,0,0.9)' }}>
              Back to today
            </button>
          )}
        </div>

        <button onClick={() => setWeekOffset(w => w + 1)}
          className='flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all'
          style={{ background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: 'white' }}>
          Next<ChevronRight className='w-4 h-4' />
        </button>
      </div>

      {/* ── Day headers ── */}
      <div className='flex' style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ width: TIME_COL_W, flexShrink: 0 }} />
        {DAYS.map((day, i) => {
          const date = weekDates[i];
          const isToday = date.toDateString() === today.toDateString();
          const count = byDay[day].length;
          return (
            <div key={day} className='flex-1 text-center py-2' style={{ minWidth: 0 }}>
              <p className='text-xs font-bold'
                style={{ color: isToday ? '#FFD200' : 'rgba(255,255,255,0.5)' }}>
                {day.slice(0, 3).toUpperCase()}
              </p>
              <div className='w-8 h-8 rounded-full flex items-center justify-center mx-auto text-sm font-black'
                style={{
                  background: isToday ? '#FFD200' : 'transparent',
                  color: isToday ? '#1a1a1a' : 'rgba(255,255,255,0.85)',
                }}>
                {date.getDate()}
              </div>
              {count > 0 && (
                <div className='w-1.5 h-1.5 rounded-full mx-auto mt-1' style={{ background: '#E21833' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Scrollable time grid ── */}
      <div ref={scrollRef} style={{ height: 'calc(100vh - 290px)', minHeight: 320, overflowY: 'auto', overflowX: 'hidden' }}>
        <div className='flex w-full' style={{ height: totalH, position: 'relative' }}>

          {/* Time labels */}
          <div style={{ width: TIME_COL_W, flexShrink: 0, position: 'relative' }}>
            {HOURS.map(h => (
              <div key={h} style={{ height: HOUR_H, position: 'relative' }}>
                <span className='absolute text-xs font-medium select-none'
                  style={{ top: -8, right: 8, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                  {fmtHour(h)}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map((day, i) => {
            const isToday = weekDates[i].toDateString() === today.toDateString();
            const appts = byDay[day];

            return (
              <div key={day} className='flex-1 relative' style={{ minWidth: 0 }}
                style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>

                {/* Today column tint */}
                {isToday && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255,210,0,0.04)',
                    pointerEvents: 'none'
                  }} />
                )}

                {/* Hour grid lines */}
                {HOURS.map(h => (
                  <div key={h} style={{ height: HOUR_H, position: 'relative',
                    borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{
                      position: 'absolute', top: HOUR_H / 2,
                      left: 0, right: 0,
                      borderTop: '1px dashed rgba(255,255,255,0.03)'
                    }} />
                  </div>
                ))}

                {/* "Now" line — only on today column in the current week */}
                {weekOffset === 0 && i === todayColIdx && nowTop >= 0 && nowTop <= totalH && (
                  <div style={{ position: 'absolute', top: nowTop, left: -4, right: 0, zIndex: 10, pointerEvents: 'none' }}>
                    <div style={{ height: 2, background: '#FFD200', boxShadow: '0 0 6px #FFD200' }} />
                    <div style={{
                      position: 'absolute', top: -4, left: -1,
                      width: 10, height: 10, borderRadius: '50%',
                      background: '#FFD200', boxShadow: '0 0 6px #FFD200'
                    }} />
                  </div>
                )}

                {/* Appointment cards */}
                {appts.map(appt => {
                  const top = Math.max(0, (appt.start - START_HOUR) * HOUR_H);
                  const height = Math.max(22, (appt.end - appt.start) * HOUR_H - 3);
                  const short = height < 40;
                  return (
                    <div key={appt.id}
                      style={{
                        position: 'absolute', top, height,
                        left: 2, right: 2, zIndex: 5,
                        background: 'linear-gradient(135deg, #E21833, #c0102a)',
                        borderRadius: 6, padding: short ? '2px 5px' : '5px 7px',
                        overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        cursor: 'default',
                      }}>
                      <p className='text-xs font-bold text-white truncate leading-tight'>{appt.label}</p>
                      {!short && (
                        <p className='text-xs text-white/75 truncate leading-tight mt-0.5'>
                          {appt.slot.replace(day + ' ', '')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
