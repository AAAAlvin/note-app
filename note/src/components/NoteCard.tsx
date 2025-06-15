'use client';
import Link from "next/link";

interface Note {
  id: number;
  title: string;
  desc: string;
  tags: string[];
  time: string;
  date: string;
  signals: boolean[];
}

export default function NoteCard({ note }: { note: Note }) {  
  return (
    <>
      <Link href={`/docs/${note.id}`} className="w-full">
        <div className="bg-white rounded shadow p-4 flex items-center justify-between">
        <div className="flex flex-col items-center justify-center w-16 mr-4">
          <div className="text-xs text-gray-400">
            {(() => {
              if (!note.date) return '';
              const dateObj = new Date(note.date);
              if (!isNaN(dateObj.getTime())) {
                return dateObj.toLocaleDateString('ko-KR', { weekday: 'short' });
              }
              return note.date.split(' ')[0];
            })()}
          </div>
          <div className="text-2xl font-bold text-gray-700">
            {(() => {
              if (!note.date) return '';
              const dateObj = new Date(note.date);
              if (!isNaN(dateObj.getTime())) {
                return String(dateObj.getDate()).padStart(2, '0');
              }
              return note.date.split(' ')[1] || '';
            })()}
          </div>
          <div className="text-xs text-gray-400">
            {(() => {
              if (!note.date) return '';
              const dateObj = new Date(note.date);
              if (!isNaN(dateObj.getTime())) {
                return note.time;
              }
              return note.time;
            })()}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-bold">{note.title}</div>
          <div className="text-sm text-gray-600">{note.desc}</div>
          <div className="flex gap-1 mt-1">
            {note.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-xs px-2 py-0.5 rounded">{tag}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      </div>
      </Link>
    </>
  );
} 