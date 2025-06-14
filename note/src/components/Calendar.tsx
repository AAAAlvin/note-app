'use client';
import { useState } from 'react';

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfWeek = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// dotDays와 events를 YYYY-MM-DD로 관리
const dotDays = ['2025-05-01', '2025-05-03', '2025-05-08'];
const events: Record<string, string[]> = {
  '2025-05-01': ['ERP 회의', '문서 마감'],
  '2025-05-03': ['프로젝트 킥오프'],
  '2025-05-08': ['중요 미팅'],
};

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(4); // 0-indexed (May)
  const [selected, setSelected] = useState<number | null>(3);
  const [hovered, setHovered] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // 6주(42칸) 배열 생성
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  while (calendarDays.length < 42) calendarDays.push(null);

  // 월/연도 변경 핸들러
  const handleMonthChange = (diff: number) => {
    let newMonth = month + diff;
    let newYear = year;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div className="bg-[#23282d] rounded p-3 w-full relative">
      {/* 상단 네비 */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => handleMonthChange(-1)} className="text-gray-300 px-2 py-1 rounded hover:bg-[#2c3136]">&lt;</button>
        <button
          className="text-white font-semibold px-2 py-1 rounded hover:bg-[#2c3136]"
          onClick={() => {
            setYear(today.getFullYear());
            setMonth(today.getMonth());
            setSelected(today.getDate());
          }}
        >
          Today
        </button>
        <div className="flex gap-2">
          <select
            className="bg-[#23282d] text-white border-none focus:ring-0"
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>{m.slice(0, 3)}</option>
            ))}
          </select>
          <select
            className="bg-[#23282d] text-white border-none focus:ring-0"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => year - 5 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button onClick={() => handleMonthChange(1)} className="text-gray-300 px-2 py-1 rounded hover:bg-[#2c3136]">&gt;</button>
      </div>
      {/* 요일 */}
      <div className="grid grid-cols-7 text-xs text-gray-400 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>
      {/* 날짜 */}
      <div className="grid grid-cols-7 text-center text-sm">
        {calendarDays.map((d, i) => {
          const dateStr = d
            ? `${year}-${pad(month + 1)}-${pad(d)}`
            : '';
          const isToday =
            d === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const isSelected = d === selected;
          const isDot = dotDays.includes(dateStr);

          return (
            <div
              key={i}
              className={`
                h-8 w-8 mx-auto flex items-center justify-center
                rounded-full
                ${d
                  ? isSelected
                    ? 'bg-white text-black font-bold'
                    : isToday
                    ? 'bg-gray-600 text-white font-bold'
                    : 'text-white hover:bg-[#2c3136] cursor-pointer transition'
                  : ''
                }
              `}
              style={{ position: 'relative' }}
              onClick={() => d && setSelected(d)}
              onMouseEnter={() => d && setHovered(dateStr)}
              onMouseLeave={() => setHovered(null)}
            >
              {d}
              {/* dot 표시 */}
              {isDot && d && (
                <span
                  className={`
                    absolute right-1 top-1 w-1.5 h-1.5 rounded-full
                    ${isSelected || isToday ? 'bg-red-500' : 'bg-red-400'}
                  `}
                />
              )}
              {/* 이벤트 툴팁 */}
              {hovered === dateStr && events[dateStr] && (
                <div className="absolute z-20 left-1/2 -translate-x-1/2 top-9 min-w-[120px] bg-white text-black text-xs rounded shadow-lg p-2">
                  <ul>
                    {events[dateStr].map((ev, idx) => (
                      <li key={idx} className="py-0.5">{ev}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 