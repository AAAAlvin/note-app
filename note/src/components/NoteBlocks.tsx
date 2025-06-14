'use client';

import { useState, useEffect } from 'react';
import TiptapEditor from './TiptapEditor';

interface Block {
  id: string;
  content: string;
  type: 'editor';
}

const LOCAL_STORAGE_KEY = 'noteBlocks';

const NoteBlocks = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', content: '', type: 'editor' },
  ]);
  
  // 로컬 스토리지에서 블록 데이터 불러오기
  useEffect(() => {
    const savedBlocks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedBlocks) {
      try {
        const parsedBlocks = JSON.parse(savedBlocks);
        if (Array.isArray(parsedBlocks) && parsedBlocks.length > 0) {
          setBlocks(parsedBlocks);
        }
      } catch (error) {
        console.error('블록 데이터를 불러오는 중 오류가 발생했습니다:', error);
      }
    }
  }, []);
  
  // 블록 데이터 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blocks));
  }, [blocks]);

  const addBlock = (afterId: string) => {
    const newBlockId = Date.now().toString();
    const index = blocks.findIndex(block => block.id === afterId);
    
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, { 
      id: newBlockId, 
      content: '', 
      type: 'editor' 
    });
    
    setBlocks(newBlocks);
  };

  const removeBlock = (id: string) => {
    // 최소 1개의 블록은 유지
    if (blocks.length <= 1) return;
    
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlockUp = (id: string) => {
    const index = blocks.findIndex(block => block.id === id);
    if (index <= 0) return;
    
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index - 1];
    newBlocks[index - 1] = temp;
    
    setBlocks(newBlocks);
  };

  const moveBlockDown = (id: string) => {
    const index = blocks.findIndex(block => block.id === id);
    if (index >= blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1];
    newBlocks[index + 1] = temp;
    
    setBlocks(newBlocks);
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };
  
  // 모든 블록 내용 초기화
  const clearAllBlocks = () => {
    if (confirm('모든 블록 내용을 초기화하시겠습니까?')) {
      setBlocks([{ id: '1', content: '', type: 'editor' }]);
    }
  };

  return (
    <div className="note-blocks">
      <div className="controls mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">내 노트</h2>
        <div className="actions">
          <button 
            onClick={clearAllBlocks}
            className="px-3 py-1 bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100 text-sm"
          >
            모두 지우기
          </button>
        </div>
      </div>
      
      <div className="blocks-container space-y-6">
        {blocks.map((block, index) => (
          <div key={block.id} className="block-container rounded-lg p-2 bg-white">
            <div className="block-controls flex justify-between mb-2 bg-gray-50 p-2 rounded">
              <div className="block-number font-medium">블록 {index + 1}</div>
              <div className="block-actions flex gap-2">
                <button 
                  onClick={() => moveBlockUp(block.id)}
                  className="p-1 bg-white rounded text-sm shadow-sm disabled:opacity-50"
                  disabled={index === 0}
                  title="위로 이동"
                >
                  ↑
                </button>
                <button 
                  onClick={() => moveBlockDown(block.id)}
                  className="p-1 bg-white rounded text-sm shadow-sm disabled:opacity-50"
                  disabled={index === blocks.length - 1}
                  title="아래로 이동"
                >
                  ↓
                </button>
                <button 
                  onClick={() => removeBlock(block.id)}
                  className="p-1 bg-white rounded text-sm text-red-500 shadow-sm disabled:opacity-50"
                  disabled={blocks.length <= 1}
                  title="삭제"
                >
                  ✕
                </button>
                <button 
                  onClick={() => addBlock(block.id)}
                  className="p-1 bg-white rounded text-sm text-blue-500 shadow-sm"
                  title="아래에 추가"
                >
                  +
                </button>
              </div>
            </div>
            
            <TiptapEditor 
              initialContent={block.content}
              onChange={(html) => updateBlockContent(block.id, html)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteBlocks; 