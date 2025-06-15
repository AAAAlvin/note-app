'use client';
import NoteCard from '../components/NoteCard';

interface Note {
  id: number;
  title: string;
  desc: string;
  tags: string[];
  time: string;
  date: string;
  signals: boolean[];
}

interface NoteSectionProps {
  title: string;
  notes: Note[];
}

export default function NoteSection({ title, notes }: NoteSectionProps) {
  return (
    <section className="mb-8">
      <h3 className="font-bold mb-2">{title}</h3>
      <div className="space-y-4">
        {notes.map(note => <NoteCard key={note.id} note={note} />)}
      </div>
    </section>
  );
} 