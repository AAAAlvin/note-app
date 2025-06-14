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
    <div className="bg-white rounded shadow p-4 flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-400">{note.date} {note.time}</div>
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
  );
} 