import { useState } from 'react';
import NoteSection from '../components/NoteSection';

const allNotes = [
  {
    id: 1,
    title: 'Wego ERP 진행사항 등',
    desc: '수동등록 확인에 대한 내 확정일: 5/12 완료 예정',
    tags: ['#IE', '#WegoERP', '#진행중', '#새사업전략회의'],
    time: '12:00PM',
    date: '05/03',
    signals: [true, true, true],
    important: true,
  },
  {
    id: 2,
    title: '중요 미팅 준비',
    desc: '회의 자료 준비 및 참석자 확인',
    tags: ['#미팅', '#중요', '#진행중'],
    time: '10:00AM',
    date: '05/08',
    signals: [true, false, true],
    important: false,
  },
  {
    id: 3,
    title: '프로젝트 킥오프',
    desc: 'Kickoff 미팅 및 역할 분담',
    tags: ['#프로젝트', '#진행중'],
    time: '2:00PM',
    date: '05/03',
    signals: [false, true, true],
    important: true,
  },
  // ...더미 노트 추가 가능
];

// 모든 태그 집합 추출
// const allTags = Array.from(
//   new Set(allNotes.flatMap(note => note.tags))
// );

export default function MainDashboard() {
  const [view, setView] = useState<'all' | 'important'>('all');
  // const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 필터링
  const filteredNotes = allNotes.filter(note => {
    if (view === 'important' && !note.important) return false;
    // if (selectedTags.length > 0 && !selectedTags.every(tag => note.tags.includes(tag))) return false;
    return true;
  });

  // 태그 토글
  // const toggleTag = (tag: string) => {
  //   setSelectedTags(prev =>
  //     prev.includes(tag)
  //       ? prev.filter(t => t !== tag)
  //       : [...prev, tag]
  //   );
  // };

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      {/* 상단 필터 */}
      <div className="flex items-center gap-4 mb-6">
        {/* 전체/중요 토글 */}
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition ${
              view === 'all'
                ? 'bg-[#2c3136] text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
            onClick={() => setView('all')}
          >
            전체
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition ${
              view === 'important'
                ? 'bg-[#2c3136] text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
            onClick={() => setView('important')}
          >
            중요 노트
          </button>
        </div>
        {/* 태그 필터 */}
        {/* <div className="flex gap-2 flex-wrap ml-6">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full border transition text-sm ${
                selectedTags.includes(tag)
                  ? 'bg-blue-100 border-blue-400 text-blue-700 font-bold'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-blue-50'
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div> */}
      </div>
      {/* 노트 리스트 */}
      <NoteSection title={view === 'all' ? '전체 노트' : '중요 노트'} notes={filteredNotes} />
    </main>
  );
} 