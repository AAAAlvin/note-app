'use client';

import { useState, useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';

interface Block {
  id: string;
  content: string;
  type: string;
  level?: number;
}

interface BlockExplorerProps {
  editor: Editor | null;
  onBlockClick: (blockId: string) => void;
}

const BlockExplorer: React.FC<BlockExplorerProps> = ({ editor, onBlockClick }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 에디터 내용이 변경될 때마다 블록 목록을 업데이트
  const updateBlocks = useCallback(() => {
    if (!editor) return;

    const newBlocks: Block[] = [];
    const doc = editor.state.doc;

    doc.descendants((node) => {
      // 지원하는 블록 타입인지 확인
      if (
        ['heading', 'paragraph', 'bulletList', 'orderedList', 'blockquote', 'codeBlock'].includes(
          node.type.name
        ) &&
        node.attrs.id
      ) {
        let content = '';

        // 노드 타입에 따라 콘텐츠 추출 방식이 다름
        if (node.type.name === 'heading' || node.type.name === 'paragraph') {
          // 텍스트 콘텐츠 추출
          content = node.textContent || '내용 없음';
        } else if (['bulletList', 'orderedList'].includes(node.type.name)) {
          content = `${node.type.name === 'bulletList' ? '글머리 기호 목록' : '번호 매기기 목록'}`;
        } else if (node.type.name === 'blockquote') {
          content = '인용문';
        } else if (node.type.name === 'codeBlock') {
          content = '코드 블록';
        }

        // 최대 30자로 제한
        if (content.length > 30) {
          content = content.substring(0, 30) + '...';
        }

        newBlocks.push({
          id: node.attrs.id,
          content,
          type: node.type.name,
          level: node.type.name === 'heading' ? node.attrs.level : undefined,
        });
      }
    });

    setBlocks(newBlocks);
  }, [editor]);

  // 에디터 업데이트 및 마운트 시 블록 목록 갱신
  useEffect(() => {
    if (!editor) return;

    updateBlocks();

    // 에디터 업데이트 이벤트에 리스너 추가
    const onUpdate = () => {
      updateBlocks();
    };

    editor.on('update', onUpdate);

    return () => {
      editor.off('update', onUpdate);
    };
  }, [editor, updateBlocks]);

  // 블록 클릭 핸들러
  const handleBlockClick = (blockId: string) => {
    onBlockClick(blockId);
  };

  // 검색어에 따라 블록 필터링
  const filteredBlocks = searchTerm
    ? blocks.filter(block =>
        block.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : blocks;

  return (
    <div className="block-explorer">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
        title="블록 탐색기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10H3M21 6H3M21 14H3M21 18H3" />
        </svg>
        <span>블록 탐색기</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-3 bg-white rounded shadow-lg border border-gray-100 z-20 w-64">
          <div className="mb-2">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="블록 검색..."
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>

          {filteredBlocks.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              <ul className="space-y-1">
                {filteredBlocks.map(block => (
                  <li key={block.id}>
                    <button
                      onClick={() => handleBlockClick(block.id)}
                      className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-sm truncate block ${
                        block.type === 'heading' ? 'font-bold' : ''
                      }`}
                      style={{
                        paddingLeft: block.level ? `${block.level * 8}px` : undefined,
                      }}
                      title={block.content}
                    >
                      <span className="inline-block w-4 text-gray-400 mr-1">
                        {block.type === 'heading' ? 'H' + block.level : 
                         block.type === 'paragraph' ? '¶' :
                         block.type === 'bulletList' ? '•' :
                         block.type === 'orderedList' ? '1.' :
                         block.type === 'blockquote' ? '"' : 
                         block.type === 'codeBlock' ? '{}'
                         : ''}
                      </span>
                      {block.content}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-sm text-gray-500 py-2 text-center">
              {searchTerm ? '검색 결과가 없습니다' : '블록이 없습니다'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlockExplorer; 