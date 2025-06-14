import { Editor } from '@tiptap/react';

export interface SuggestionProps {
  editor: Editor;
  query: string;
  onCommand: (command: SlashCommandItem) => void;
}

export interface SlashCommandItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  command: ({ editor }: { editor: Editor }) => void;
} 