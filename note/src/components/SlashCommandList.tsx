'use client';

import { useState, useEffect, forwardRef } from 'react';
import { SuggestionProps, SlashCommandItem } from './types';

const commandItems: SlashCommandItem[] = [
  {
    title: '텍스트',
    description: '일반 텍스트 블록',
    command: ({ editor }) => {
      editor.chain().focus().setParagraph().run();
    },
  },
  {
    title: '제목 1',
    description: '큰 제목',
    command: ({ editor }) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
  },
  {
    title: '제목 2',
    description: '중간 제목',
    command: ({ editor }) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
  },
  {
    title: '제목 3',
    description: '작은 제목',
    command: ({ editor }) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    },
  },
  {
    title: '글머리 기호 목록',
    description: '간단한 글머리 기호 목록',
    command: ({ editor }) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  {
    title: '번호 매기기 목록',
    description: '번호가 매겨진 목록',
    command: ({ editor }) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },
  {
    title: '코드 블록',
    description: '코드 조각을 위한 블록',
    command: ({ editor }) => {
      editor.chain().focus().toggleCodeBlock().run();
    },
  },
  {
    title: '인용문',
    description: '텍스트 인용하기',
    command: ({ editor }) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
  {
    title: '구분선',
    description: '섹션 분리를 위한 수평선',
    command: ({ editor }) => {
      editor.chain().focus().setHorizontalRule().run();
    },
  },
];

const SlashCommandList = forwardRef<HTMLDivElement, SuggestionProps>((props, ref) => {
  const { query, onCommand } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredItems, setFilteredItems] = useState<SlashCommandItem[]>(commandItems);

  // 쿼리가 변경되면 목록 필터링
  useEffect(() => {
    if (query) {
      const filtered = commandItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredItems(filtered);
      setSelectedIndex(0);
    } else {
      setFilteredItems(commandItems);
    }
  }, [query]);

  // 키보드 네비게이션 (화살표 위/아래, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((selectedIndex + 1) % filteredItems.length);
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((selectedIndex - 1 + filteredItems.length) % filteredItems.length);
      }
      
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onCommand(filteredItems[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, filteredItems, onCommand]);

  return (
    <div 
      ref={ref} 
      className="slash-command-list bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden max-h-80 overflow-y-auto w-72"
    >
      <div className="p-2 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">기본 블록</h3>
      </div>
      {filteredItems.length > 0 ? (
        <div className="py-1">
          {filteredItems.map((item, index) => (
            <div
              key={item.title}
              className={`px-3 py-2 cursor-pointer flex items-start hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
              onClick={() => onCommand(item)}
            >
              <div className="flex-1">
                <div className="text-sm font-medium">{item.title}</div>
                {item.description && (
                  <div className="text-xs text-gray-500">{item.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 text-sm text-gray-500">일치하는 명령어가 없습니다</div>
      )}
    </div>
  );
});

SlashCommandList.displayName = 'SlashCommandList';

export default SlashCommandList; 