'use client';

import Calendar from './Calendar';
import { useState } from 'react';

const folders = [
  { name: '할 일', color: '#bdbdbd', count: 0 },
  { name: 'Business', color: '#2196f3', count: 1 },
  { name: 'Entertainment', color: '#9c27b0', count: 1 },
  { name: 'Friends', color: '#4caf50', count: 0 },
  { name: 'Love', color: '#f44336', count: 0 },
  { name: 'Vacations', color: '#ff9800', count: 0 },
  { name: 'No folder', color: '#607d8b', count: 2 },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="w-80 bg-[#232323] text-white flex flex-col p-4">

      {/* 프로필 */}
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-2" />
        <div className="text-center font-bold">유영현</div>
        <div className="text-center font-bold">IT 프로젝트팀</div>
      </div>
      {/* 검색/정렬 */}
      <div className="mb-4">
        <input className="w-full p-2 rounded bg-[#23282d] text-white" placeholder="검색" />
      </div>
      {/* 달력 */}
      <div className="mb-6">
        <Calendar />
      </div>

      {/* 폴더 헤더 */}
      <div className="bg-cyan-950 rounded-t flex items-center px-2 py-1 text-white font-bold mb-1">
        <span className="mr-2">📁</span>
        <span className="flex-1 cursor-pointer" onClick={() => setExpanded(e => !e)}>
          Folders {expanded ? '▼' : '▶'}
        </span>
        <button className="mx-1">+</button>
        <button>⋮</button>
      </div>
      {/* 폴더 리스트 */}
      {expanded && (
        <ul className="bg-white rounded-b divide-y divide-gray-100">
          {folders.map(folder => (
            <li key={folder.name} className="flex items-center px-2 py-1 hover:bg-blue-50 group">
              <span className="w-2 h-4 rounded mr-2" style={{ background: folder.color }} />
              <span className="flex-1 text-gray-800 text-sm">{folder.name}</span>
              <span className="text-xs text-gray-500 mr-2">{folder.count}</span>
              <button className="text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition">⋮</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
} 