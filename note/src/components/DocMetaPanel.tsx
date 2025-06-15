'use client';
import React, { useState, useEffect } from 'react';
import { FaFolder, FaTags, FaMapMarkerAlt, FaUser } from "react-icons/fa";

interface DocMetaPanelProps {
  documentId: string;
}

const DocMetaPanel = ({ documentId }: DocMetaPanelProps) => {
  const [tags, setTags] = useState<string[]>(["tag1", "tag2", "tag3"]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [members, setMembers] = useState<string[]>(["member1", "member2", "member3"]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [folders] = useState<string[]>(["No folder"]);
  const [selectedFolder, setSelectedFolder] = useState<string>("No folder");
  const [locations] = useState<string[]>(["No location"]);
  const [selectedLocation, setSelectedLocation] = useState<string>("No location");

  useEffect(() => {
    // 여기서 문서 ID를 기반으로 태그와 멤버 데이터를 가져올 수 있습니다
    console.log(`Loading metadata for document: ${documentId}`);
    
    // 실제 구현에서는 API 호출 등을 통해 데이터를 가져옵니다
    const fetchMetadata = async () => {
      try {
        // const response = await fetch(`/api/docs/${documentId}/metadata`);
        // const data = await response.json();
        setTags(["tag1", "tag2", "tag3"]);
        setMembers(["member1", "member2", "member3"]);
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      }
    };
    
    fetchMetadata();
  }, [documentId]);

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleMemberChange = (member: string) => {
    setSelectedMembers(prev => {
      if (prev.includes(member)) {
        return prev.filter(m => m !== member);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleFolderChange = (folder: string) => {
    setSelectedFolder(folder);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">문서 메타데이터</h2>
      
      {/* 폴더 선택 */}
      <div className="mb-4 flex items-start">
        <span className="inline-block w-8 h-8 mr-2 flex-shrink-0 text-gray-500">
          <FaFolder className="w-5 h-5" />
        </span>
        <div className="flex-1">
          <select
            value={selectedFolder}
            onChange={(e) => handleFolderChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {folders.map(folder => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* 태그 선택 */}
      <div className="mb-4 flex items-start">
        <span className="inline-block w-8 h-8 mr-2 flex-shrink-0 text-gray-500">
          <FaTags className="w-5 h-5" />
        </span>
        <div className="flex-1 flex flex-wrap gap-2">
          {tags.map(tag => (
            <label key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
                className="accent-blue-500"
              />
              {tag}
            </label>
          ))}
          {tags.length === 0 && <span className="text-gray-400">Add tag...</span>}
        </div>
      </div>
      
      {/* 담당자 선택 */}
      <div className="mb-4 flex items-start">
        <span className="inline-block w-8 h-8 mr-2 flex-shrink-0 text-gray-500">
          <FaUser className="w-5 h-5" />
        </span>
        <div className="flex-1 flex flex-wrap gap-2">
          {members.map(member => (
            <label key={member} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMembers.includes(member)}
                onChange={() => handleMemberChange(member)}
                className="accent-green-500"
              />
              {member}
            </label>
          ))}
          {members.length === 0 && <span className="text-gray-400">Add member...</span>}
        </div>
      </div>
      
      {/* 위치 선택 */}
      <div className="mb-4 flex items-start">
        <span className="inline-block w-8 h-8 mr-2 flex-shrink-0 text-gray-500">
          <FaMapMarkerAlt className="w-5 h-5" />
        </span>
        <div className="flex-1">
          <select
            value={selectedLocation}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {locations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DocMetaPanel; 