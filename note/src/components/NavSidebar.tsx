'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 문서 타입 정의
interface Document {
  id: string;
  title: string;
  emoji?: string; // 이모지 아이콘 (선택적)
  parentId?: string | null; // 상위 문서 ID (계층 구조용)
}

// 섹션 타입 정의
interface Section {
  id: string;
  title: string;
  documents: Document[];
  isExpanded: boolean;
}

// 임시 데이터 (실제로는 API 호출이나 상태 관리 라이브러리를 통해 가져올 것)
const INITIAL_SECTIONS: Section[] = [
  {
    id: 'private',
    title: 'Private',
    isExpanded: true,
    documents: [
      { id: 'xoffice', title: 'Xoffice 문서', emoji: '🚀' },
    ]
  }
];

export default function NavSidebar() {
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSections, setFilteredSections] = useState<Section[]>(sections);
  const pathname = usePathname();
  
  // 검색 기능
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSections(sections);
      return;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    
    // 검색어에 맞는 문서 필터링
    const filtered = sections.map(section => {
      const matchingDocs = section.documents.filter(doc => 
        doc.title.toLowerCase().includes(lowerQuery)
      );
      
      return {
        ...section,
        documents: matchingDocs,
        isExpanded: matchingDocs.length > 0 // 검색 결과가 있으면 섹션 확장
      };
    }).filter(section => section.documents.length > 0);
    
    setFilteredSections(filtered);
  }, [searchQuery, sections]);
  
  // 섹션 확장/축소 토글
  const toggleSection = (sectionId: string) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };
  
  // 새 문서 추가 (임시 기능)
  const addNewDocument = (sectionId: string) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: '새 문서',
      parentId: sectionId,
    };
    
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? { ...section, documents: [...section.documents, newDoc] }
          : section
      )
    );
  };

  return (
    <aside className="w-64 h-screen bg-gray-50 border-r border-gray-200 overflow-y-auto">
      {/* 헤더 */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded mr-2">
          <span>D</span>
        </div>
        <span className="font-medium">내 노트</span>
        <button className="ml-auto text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* 검색 */}
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 w-full bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* 주요 네비게이션 링크 */}
      <div className="p-2">
        <Link href="/" className={`flex items-center px-2 py-1.5 rounded-md ${pathname === '/' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'}`}>
          <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Home</span>
          <span className="ml-auto text-xs text-gray-500 font-medium px-1.5 py-0.5 rounded-md bg-gray-200">New</span>
        </Link>
        
        <Link href="/inbox" className={`flex items-center px-2 py-1.5 mt-1 rounded-md ${pathname === '/inbox' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'}`}>
          <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
          </svg>
          <span>Inbox</span>
        </Link>
      </div>
      
      {/* 섹션 및 문서 */}
      <div className="px-2 pb-8">
        {filteredSections.map((section) => (
          <div key={section.id} className="mt-6">
            <div className="flex items-center px-2 py-1 text-sm text-gray-500 font-medium">
              <button 
                className="mr-1 focus:outline-none" 
                onClick={() => toggleSection(section.id)}
                aria-label={section.isExpanded ? '섹션 접기' : '섹션 펼치기'}
              >
                <svg className={`w-3 h-3 transition-transform ${section.isExpanded ? 'transform rotate-90' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <span>{section.title}</span>
            </div>
            
            {section.isExpanded && (
              <div className="mt-1 ml-2">
                {section.documents
                  .filter(doc => !doc.parentId) // 최상위 문서만 먼저 표시
                  .map(doc => (
                    <div key={doc.id} className="mb-1">
                      <Link 
                        href={`/docs/${doc.id}`}
                        className={`flex items-center px-2 py-1.5 rounded-md text-sm ${
                          pathname === `/docs/${doc.id}` ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'
                        }`}
                      >
                        {doc.emoji ? (
                          <span className="mr-2">{doc.emoji}</span>
                        ) : (
                          <svg className="w-4 h-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span>{doc.title}</span>
                      </Link>
                      
                      {/* 하위 문서 렌더링 */}
                      <div className="ml-4">
                        {section.documents
                          .filter(childDoc => childDoc.parentId === doc.id)
                          .map(childDoc => (
                            <Link 
                              key={childDoc.id}
                              href={`/docs/${childDoc.id}`}
                              className={`flex items-center px-2 py-1.5 mt-1 rounded-md text-sm ${
                                pathname === `/docs/${childDoc.id}` ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'
                              }`}
                            >
                              <svg className="w-4 h-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                              <span>{childDoc.title}</span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))}
                
                {/* 새 문서 추가 버튼 */}
                <button 
                  className="flex items-center w-full px-2 py-1.5 mt-1 text-sm text-gray-500 rounded-md hover:bg-gray-200"
                  onClick={() => addNewDocument(section.id)}
                >
                  <span className="mr-2">+</span>
                  <span>Add new</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* 하단 메뉴 */}
      <div className="px-2 pt-2 border-t border-gray-200 mt-auto">
        <Link href="/settings" className="flex items-center px-2 py-1.5 rounded-md hover:bg-gray-200">
          <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span>Settings</span>
        </Link>
        
        <Link href="/templates" className="flex items-center px-2 py-1.5 mt-1 rounded-md hover:bg-gray-200">
          <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <span>Templates</span>
        </Link>
        
        <Link href="/trash" className="flex items-center px-2 py-1.5 mt-1 rounded-md hover:bg-gray-200">
          <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Trash</span>
        </Link>
      </div>
    </aside>
  );
} 