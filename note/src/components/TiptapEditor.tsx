'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { useState, useEffect, useRef, useCallback } from 'react';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import FontFamily from './extensions/FontFamily';
import UniqueID from './extensions/UniqueID';
import BlockExplorer from './BlockExplorer';
import GlobalDragHandle from 'tiptap-extension-global-drag-handle';
import 'tippy.js/dist/tippy.css';
import '../styles/editor.css';

interface TiptapEditorProps {
  initialContent?: string;
  onChange?: (html: string) => void;
}

// 사용 가능한 폰트 목록
const FONT_FAMILIES = [
  { name: '기본 폰트', value: 'inherit' },
  { name: '맑은 고딕', value: "'Malgun Gothic', sans-serif" },
  { name: '나눔고딕', value: "'Nanum Gothic', sans-serif" },
  { name: '돋움', value: "'Dotum', sans-serif" },
  { name: '굴림', value: "'Gulim', sans-serif" },
  { name: '바탕', value: "'Batang', serif" },
  { name: '궁서', value: "'Gungsuh', serif" },
  { name: 'Arial', value: "'Arial', sans-serif" },
  { name: 'Times New Roman', value: "'Times New Roman', serif" },
  { name: 'Courier New', value: "'Courier New', monospace" },
  { name: 'Georgia', value: "'Georgia', serif" },
];

// 슬래시 커맨드 옵션 정의
interface CommandOption {
  title: string;
  description: string;
  action: (editor: ReturnType<typeof useEditor>) => void;
}

const commandOptions: CommandOption[] = [
  {
    title: '텍스트',
    description: '일반 텍스트 블록',
    action: (editor) => editor?.chain().focus().setParagraph().run(),
  },
  {
    title: '제목 1',
    description: '큰 제목',
    action: (editor) => {
      // 현재 텍스트가 선택되어 있지 않은 경우에도 작동하도록 개선
      editor?.chain().focus().clearNodes().setHeading({ level: 1 }).run();
    },
  },
  {
    title: '제목 2',
    description: '중간 제목',
    action: (editor) => {
      editor?.chain().focus().clearNodes().setHeading({ level: 2 }).run();
    },
  },
  {
    title: '제목 3',
    description: '작은 제목',
    action: (editor) => {
      editor?.chain().focus().clearNodes().setHeading({ level: 3 }).run();
    },
  },
  {
    title: '글머리 기호 목록',
    description: '간단한 글머리 기호 목록',
    action: (editor) => editor?.chain().focus().toggleBulletList().run(),
  },
  {
    title: '번호 매기기 목록',
    description: '번호가 매겨진 목록',
    action: (editor) => editor?.chain().focus().toggleOrderedList().run(),
  },
  {
    title: '코드 블록',
    description: '코드 조각을 위한 블록',
    action: (editor) => editor?.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: '인용문',
    description: '텍스트 인용하기',
    action: (editor) => editor?.chain().focus().toggleBlockquote().run(),
  },
  {
    title: '구분선',
    description: '섹션 분리를 위한 수평선',
    action: (editor) => editor?.chain().focus().setHorizontalRule().run(),
  },
  {
    title: '표 삽입',
    description: '2x3 기본 표 삽입',
    action: (editor) => editor?.chain().focus()
      .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
      .run(),
  },
];

const TiptapEditor = ({ initialContent = '', onChange }: TiptapEditorProps) => {
  const [editorContent, setEditorContent] = useState(initialContent);
  const [showCommands, setShowCommands] = useState(false);
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
  const [filterText, setFilterText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showTableWidthInput, setShowTableWidthInput] = useState(false);
  const [tableWidthValue, setTableWidthValue] = useState('100%');
  const [tableColumnWidthValue, setTableColumnWidthValue] = useState('');
  
  const editorRef = useRef<HTMLDivElement>(null);
  const editorContentRef = useRef<HTMLDivElement>(null);
  const commandsContainerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  
  // 폰트 관련 상태 추가
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FONT_FAMILIES[0]);
  const fontSelectorRef = useRef<HTMLDivElement>(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      // TextStyle 확장 필요 (폰트 설정에 필요)
      TextStyle,
      // 폰트 패밀리 확장 추가
      FontFamily,
      // 표 관련 확장 추가
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      // 블록 ID 확장 추가
      UniqueID,
      // 글로벌 드래그 핸들 추가
      GlobalDragHandle.configure({
        dragHandleWidth: 24,
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorContent(html);
      onChange?.(html);
    },
    onSelectionUpdate: ({ editor }) => {
      // 현재 커서 위치 확인
      const { from } = editor.state.selection;
      const currentPosition = editor.view.coordsAtPos(from);
      
      // 현재 텍스트 확인 (슬래시 감지용)
      const { doc, selection } = editor.state;
      const { from: selectionFrom } = selection;
      
      // 커서 위치 바로 전의 문자 확인
      const textBefore = doc.textBetween(Math.max(0, selectionFrom - 2), selectionFrom, '');
      
      if (textBefore.endsWith('/') && !showCommands) {
        // 슬래시 입력 감지됨 (메뉴가 아직 열리지 않은 경우에만)
        // 에디터 컨텐츠 영역의 위치 기준으로 상대적인 위치 계산
        if (editorContentRef.current) {
          const editorRect = editorContentRef.current.getBoundingClientRect();
          setSlashPosition({
            top: currentPosition.bottom - editorRect.top,
            left: currentPosition.left - editorRect.left,
          });
        }
        setShowCommands(true);
        setFilterText('');
        setSelectedIndex(0);
      } else if (showCommands) {
        // 슬래시 이후의 텍스트를 필터링에 사용
        const match = doc.textBetween(Math.max(0, selectionFrom - 20), selectionFrom, '').match(/\/([^/]*)$/);
        if (match) {
          setFilterText(match[1]);
        } else {
          // 슬래시 커맨드가 더 이상 존재하지 않으면 메뉴 닫기
          setShowCommands(false);
        }
      }
    },
  });

  // 필터링된 명령어 옵션 계산
  const filteredCommands = commandOptions.filter(
    option => 
      filterText === '' || 
      option.title.toLowerCase().includes(filterText.toLowerCase()) ||
      option.description.toLowerCase().includes(filterText.toLowerCase())
  );

  // 명령어 실행 함수 (코드 중복 방지를 위해 분리)
  const executeCommand = useCallback((command: CommandOption) => {
    if (editor) {
      command.action(editor);
      
      // 슬래시 명령어 텍스트 삭제
      const { from } = editor.state.selection;
      const { doc } = editor.state;
      const match = doc.textBetween(Math.max(0, from - 20), from, '').match(/\/([^/]*)$/);
      if (match) {
        const slashPos = from - match[0].length;
        editor.chain().focus().deleteRange({ from: slashPos, to: from }).run();
      }
      
      setShowCommands(false);
    }
  }, [editor]);

  // 키보드 이벤트 핸들러 (화살표 위/아래, Enter, Escape)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 슬래시 명령어 메뉴가 표시되지 않을 때는 모든 키 이벤트가 정상 처리되도록 종료
    if (!showCommands) return;
    
    // 아래 키들만 처리하고, 나머지는 기본 동작 유지
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    }
    else if (e.key === 'Enter' && filteredCommands.length > 0) {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        // 선택된 명령 실행
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
    else if (e.key === 'Escape') {
      e.preventDefault();
      setShowCommands(false);
    }
  }, [showCommands, filteredCommands, selectedIndex, executeCommand]);

  // 명령어 클릭 핸들러
  const handleCommandClick = (command: CommandOption) => {
    executeCommand(command);
  };

  // 선택된 항목으로 스크롤 조정
  useEffect(() => {
    if (selectedItemRef.current && commandsContainerRef.current) {
      const container = commandsContainerRef.current;
      const selectedItem = selectedItemRef.current;
      
      // 선택된 항목의 위치 정보
      const itemTop = selectedItem.offsetTop;
      const itemHeight = selectedItem.offsetHeight;
      
      // 컨테이너의 스크롤 정보
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      
      // 항목이 컨테이너 위에 있는 경우 위로 스크롤
      if (itemTop < scrollTop) {
        container.scrollTop = itemTop;
      }
      // 항목이 컨테이너 아래에 있는 경우 아래로 스크롤
      else if (itemTop + itemHeight > scrollTop + containerHeight) {
        container.scrollTop = itemTop + itemHeight - containerHeight;
      }
    }
  }, [selectedIndex, filteredCommands]);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    if (!editor) return;
    
    // 에디터 뷰에 직접 이벤트 리스너 등록
    const editorDom = editor.view.dom;
    
    const keyHandler = (e: KeyboardEvent) => handleKeyDown(e);
    editorDom.addEventListener('keydown', keyHandler, true); // capture 단계에서 이벤트 처리
    
    return () => {
      editorDom.removeEventListener('keydown', keyHandler, true);
    };
  }, [editor, handleKeyDown]);

  // 컴포넌트가 마운트될 때 초기 content 업데이트
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);
  
  // 에디터 외부 클릭 시 명령어 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        setShowCommands(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 표 너비 설정 함수
  const setTableWidth = useCallback(() => {
    if (!editor) return;
    
    // 표 선택 확인
    if (!editor.isActive('table')) {
      alert('표를 선택한 상태에서 너비를 설정해주세요.');
      return;
    }
    
    try {
      // 너비 값이 유효한지 확인
      let widthValue = tableWidthValue;
      if (!widthValue.includes('%') && !widthValue.includes('px')) {
        widthValue += 'px';
      }
      
      // 표의 DOM 요소 찾기 및 스타일 적용
      const tableElement = editor.view.dom.querySelector('table');
      if (tableElement) {
        editor.chain().focus().run();
        // HTML 속성으로 표 너비 설정
        editor.chain().focus().updateAttributes('table', { 
          style: `width: ${widthValue}; table-layout: fixed;` 
        }).run();
        
        setShowTableWidthInput(false);
      }
    } catch (error) {
      console.error('표 너비 설정 오류:', error);
    }
  }, [editor, tableWidthValue]);
  
  // 열 너비 설정 함수
  const setColumnWidth = useCallback(() => {
    if (!editor) return;
    
    // 셀 선택 확인
    if (!editor.isActive('tableCell') && !editor.isActive('tableHeader')) {
      alert('표의 셀을 선택한 상태에서 열 너비를 설정해주세요.');
      return;
    }
    
    try {
      // 너비 값이 유효한지 확인
      let widthValue = tableColumnWidthValue;
      if (!widthValue.includes('%') && !widthValue.includes('px')) {
        widthValue += 'px';
      }
      
      // 선택된 셀에 스타일 적용
      if (editor.isActive('tableCell')) {
        editor.chain().focus().updateAttributes('tableCell', { 
          style: `width: ${widthValue};` 
        }).run();
      } else if (editor.isActive('tableHeader')) {
        editor.chain().focus().updateAttributes('tableHeader', { 
          style: `width: ${widthValue};` 
        }).run();
      }
      
      setShowTableWidthInput(false);
    } catch (error) {
      console.error('열 너비 설정 오류:', error);
    }
  }, [editor, tableColumnWidthValue]);

  // 폰트 변경 함수
  const changeFont = useCallback((font: typeof FONT_FAMILIES[0]) => {
    if (!editor) return;
    
    setSelectedFont(font);
    
    if (font.value === 'inherit') {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(font.value).run();
    }
    
    setShowFontSelector(false);
  }, [editor]);
  
  // 폰트 선택기 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fontSelectorRef.current && !fontSelectorRef.current.contains(e.target as Node)) {
        setShowFontSelector(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 블록 클릭 시 해당 블록으로 이동하는 함수 추가
  const scrollToBlock = useCallback((blockId: string) => {
    if (!editor) return;
    
    // 문서 내에서 해당 ID를 가진 블록을 찾기
    const { doc } = editor.state;
    let blockPosition = -1;
    
    doc.descendants((node, pos) => {
      if (node.attrs.id === blockId) {
        blockPosition = pos;
        return false; // 찾았으므로 순회 중단
      }
    });
    
    if (blockPosition >= 0) {
      // 해당 위치로 스크롤하고 커서 이동
      editor.chain().focus().setNodeSelection(blockPosition).scrollIntoView().run();
      
      // 시각적으로 강조 효과 (깜빡임)
      const element = document.querySelector(`[data-id="${blockId}"]`);
      if (element) {
        element.classList.add('block-highlight');
        setTimeout(() => {
          element.classList.remove('block-highlight');
        }, 1000);
      }
    }
  }, [editor]);

  // 노션 스타일 드래그 핸들 클릭 핸들러 설정
  useEffect(() => {
    if (!editor || !editorContentRef.current) return;

    const handleDragHandleClick = (e: MouseEvent) => {
      // 클릭된 요소가 드래그 핸들인지 확인
      if ((e.target as HTMLElement).closest('.notion-drag-handle')) {
        e.preventDefault();
        e.stopPropagation();
        
        // 연결된 블록 찾기
        const block = (e.target as HTMLElement).closest('p, h1, h2, h3, ul, ol, blockquote, pre');
        if (block) {
          // 블록 선택
          const nodePos = editor.view.posAtDOM(block as HTMLElement, 0);
          if (nodePos !== undefined) {
            editor.chain().focus().setNodeSelection(nodePos).run();
          }
        }
      }
    };

    // 이벤트 리스너 추가
    const editorElement = editorContentRef.current;
    editorElement.addEventListener('mousedown', handleDragHandleClick);

    return () => {
      editorElement.removeEventListener('mousedown', handleDragHandleClick);
    };
  }, [editor]);

  // 블록 사이 + 버튼 클릭 핸들러 추가
  useEffect(() => {
    if (!editor || !editorContentRef.current) return;

    const handlePlusButtonClick = (e: MouseEvent) => {
      // 타겟이 + 버튼인지 확인 (::after 가상 요소를 직접 선택할 수 없으므로 위치로 판단)
      const target = e.target as HTMLElement;
      const targetRect = target.getBoundingClientRect();
      
      // 클릭 위치가 + 버튼 영역인지 확인 (왼쪽 여백 -36px 부근)
      if (e.clientX < targetRect.left && e.clientX > targetRect.left - 40) {
        if (!editorContentRef.current) return;
        
        const blocks = editorContentRef.current.querySelectorAll('.ProseMirror p, .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror ul, .ProseMirror ol, .ProseMirror blockquote, .ProseMirror pre');
        
        // 클릭 위치에 가장 가까운 블록 찾기
        let targetBlock: Element | null = null;
        let minDistance = Number.MAX_VALUE;
        
        blocks.forEach(block => {
          const rect = block.getBoundingClientRect();
          const distance = Math.abs(e.clientY - (rect.top - 10)); // 블록 위 여백 고려
          
          if (distance < minDistance) {
            minDistance = distance;
            targetBlock = block;
          }
        });
        
        if (targetBlock && minDistance < 20) { // 20px 이내일 때만 반응
          // 블록 위치 찾기
          const pos = editor.view.posAtDOM(targetBlock, 0);
          
          if (pos !== undefined) {
            // 현재 블록 앞에 새 문단 삽입
            editor.chain()
              .focus()
              .insertContentAt(pos, '<p></p>')
              .run();
          }
        }
      }
    };
    
    // 에디터 영역에 클릭 이벤트 리스너 추가
    const editorArea = editorContentRef.current;
    editorArea.addEventListener('click', handlePlusButtonClick);
    
    return () => {
      editorArea.removeEventListener('click', handlePlusButtonClick);
    };
  }, [editor]);

  if (!editor) {
    return <div>에디터 로딩 중...</div>;
  }

  return (
    <div className="tiptap-editor" ref={editorRef}>
      <div className="tiptap-toolbar flex flex-wrap gap-1 p-2 bg-gray-50 rounded-md mb-2">
        {/* 폰트 선택 드롭다운 추가 */}
        <div className="relative mr-2" ref={fontSelectorRef}>
          <button
            onClick={() => setShowFontSelector(!showFontSelector)}
            className="px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1"
            title="폰트 선택"
          >
            <span className="text-sm">{selectedFont.name}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showFontSelector && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg border border-gray-100 z-10 w-52 max-h-60 overflow-y-auto">
              {FONT_FAMILIES.map((font, index) => (
                <button
                  key={index}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                    selectedFont.value === font.value ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                  onClick={() => changeFont(font)}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <span className="mx-1 border-r border-gray-300 h-6 self-center"></span>
        
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : ''}`}
          title="굵게"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : ''}`}
          title="기울임"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : ''}`}
          title="취소선"
        >
          S
        </button>
        <span className="mx-1 border-r border-gray-300"></span>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('paragraph') ? 'bg-blue-100 text-blue-700' : ''}`}
          title="본문"
        >
          P
        </button>
        <button
          onClick={() => editor.chain().focus().clearNodes().setHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : ''}`}
          title="제목 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().clearNodes().setHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : ''}`}
          title="제목 2"
        >
          H2
        </button>
        <span className="mx-1 border-r border-gray-300"></span>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''}`}
          title="목록"
        >
          •
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''}`}
          title="번호 목록"
        >
          1.
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-700' : ''}`}
          title="코드 블록"
        >
          &lt;/&gt;
        </button>
        <span className="mx-1 border-r border-gray-300"></span>
        {/* 표 관련 버튼 추가 */}
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run()}
          className={`px-2 py-1 rounded hover:bg-gray-200`}
          title="표 삽입"
        >
          표
        </button>
        <button
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200`}
          title="열 앞에 추가"
          disabled={!editor?.can().addColumnBefore()}
        >
          +←
        </button>
        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200`}
          title="열 뒤에 추가"
          disabled={!editor?.can().addColumnAfter()}
        >
          →+
        </button>
        <button
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200`}
          title="행 위에 추가"
          disabled={!editor?.can().addRowBefore()}
        >
          +↑
        </button>
        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200`}
          title="행 아래 추가"
          disabled={!editor?.can().addRowAfter()}
        >
          ↓+
        </button>
        <button
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 text-red-500`}
          title="열 삭제"
          disabled={!editor?.can().deleteColumn()}
        >
          -|
        </button>
        <button
          onClick={() => editor.chain().focus().deleteRow().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 text-red-500`}
          title="행 삭제"
          disabled={!editor?.can().deleteRow()}
        >
          -—
        </button>
        <button
          onClick={() => editor.chain().focus().deleteTable().run()}
          className={`px-2 py-1 rounded hover:bg-gray-200 text-red-500`}
          title="표 삭제"
          disabled={!editor?.can().deleteTable()}
        >
          ✕
        </button>
        {/* 표 관련 버튼 끝 */}
        
        {/* 표 너비 설정 버튼 추가 */}
        <button
          onClick={() => setShowTableWidthInput(true)}
          className={`px-2 py-1 rounded hover:bg-gray-200`}
          title="표 너비 설정"
          disabled={!editor?.isActive('table')}
        >
          📏
        </button>

        {/* 블록 탐색기 추가 */}
        <div className="ml-auto hidden">
          <BlockExplorer editor={editor} onBlockClick={scrollToBlock} />
        </div>
      </div>
      
      {/* 표 너비 설정 모달 */}
      {showTableWidthInput && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-medium mb-3">표 너비 설정</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">표 전체 너비</label>
              <div className="flex">
                <input
                  type="text"
                  value={tableWidthValue}
                  onChange={(e) => setTableWidthValue(e.target.value)}
                  placeholder="예: 500px 또는 100%"
                  className="flex-1 px-3 py-2 border rounded-l"
                />
                <button 
                  onClick={setTableWidth}
                  className="bg-blue-500 text-white px-3 py-2 rounded-r"
                >
                  적용
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">값에 단위(px 또는 %)를 포함해주세요</p>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">열 너비 (선택된 셀)</label>
              <div className="flex">
                <input
                  type="text"
                  value={tableColumnWidthValue}
                  onChange={(e) => setTableColumnWidthValue(e.target.value)}
                  placeholder="예: 200px 또는 50%"
                  className="flex-1 px-3 py-2 border rounded-l"
                />
                <button 
                  onClick={setColumnWidth}
                  className="bg-blue-500 text-white px-3 py-2 rounded-r"
                >
                  적용
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">현재 선택된 셀의 열 너비를 설정합니다</p>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={() => setShowTableWidthInput(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="editor-container relative">
        <div ref={editorContentRef} className="editor-content-wrapper">
          <EditorContent 
            editor={editor} 
            className="tiptap-content p-4 min-h-[200px] focus-within:ring-1 focus-within:ring-blue-200"
          />
        </div>
        
        {/* 슬래시 명령어 메뉴 */}
        {showCommands && (
          <div 
            className="slash-commands absolute z-10 bg-white rounded-md shadow-lg overflow-hidden max-h-80 w-72"
            style={{ 
              top: `${slashPosition.top}px`, 
              left: `${slashPosition.left}px`,
              position: 'absolute'
            }}
          >
            <div className="p-2 bg-gray-50 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">기본 블록</h3>
            </div>
            <div ref={commandsContainerRef} className="command-list overflow-y-auto" style={{ maxHeight: '250px' }}>
              {filteredCommands.length > 0 ? (
                <div className="py-1">
                  {filteredCommands.map((option, index) => (
                    <div
                      key={option.title}
                      ref={index === selectedIndex ? selectedItemRef : null}
                      className={`px-3 py-2 cursor-pointer flex items-start hover:bg-gray-100 ${
                        index === selectedIndex ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleCommandClick(option)}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium">{option.title}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-sm text-gray-500">일치하는 명령어가 없습니다</div>
              )}
            </div>
          </div>
        )}
        
        <div className="editor-hint text-xs text-gray-400 mt-2 flex justify-between">
          <span>팁: &apos;/&apos;를 입력하여 명령어 메뉴를 열 수 있습니다.</span>
          <span>블록 앞의 점 6개를 드래그하거나 + 버튼을 클릭하여 블록을 관리할 수 있습니다.</span>
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor; 