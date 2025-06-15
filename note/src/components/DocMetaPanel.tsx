'use client';
import React from "react";
import { FaFolder, FaTags, FaSmile, FaMapMarkerAlt, FaUser, FaPhotoVideo } from "react-icons/fa";

interface DocMetaPanelProps {
  tags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  members: string[];
  selectedMembers: string[];
  onMembersChange: (members: string[]) => void;
  folders?: string[];
  selectedFolder?: string;
  onFolderChange?: (folder: string) => void;
  locations?: string[];
  selectedLocation?: string;
  onLocationChange?: (location: string) => void;
}

const DocMetaPanel: React.FC<DocMetaPanelProps> = ({
  tags,
  selectedTags,
  onTagsChange,
  members,
  selectedMembers,
  onMembersChange,
  folders = ["No folder"],
  selectedFolder = "No folder",
  onFolderChange = () => {},
  locations = ["No location"],
  selectedLocation = "No location",
  onLocationChange = () => {},
}) => {
  // 태그 체크박스 변경 핸들러
  const handleTagChange = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  // 담당자 체크박스 변경 핸들러
  const handleMemberChange = (member: string) => {
    if (selectedMembers.includes(member)) {
      onMembersChange(selectedMembers.filter((m) => m !== member));
    } else {
      onMembersChange([...selectedMembers, member]);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto border border-gray-100">
      {/* Folder */}
      <div className="flex items-center gap-3 py-2">
        <span className="w-32 flex items-center gap-2 text-gray-600 font-medium">
          <FaFolder className="text-gray-400" /> Folder:
        </span>
        <select
          className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={selectedFolder}
          onChange={e => onFolderChange(e.target.value)}
        >
          {folders.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      {/* Tags */}
      <div className="flex items-center gap-3 py-2">
        <span className="w-32 flex items-center gap-2 text-gray-600 font-medium">
          <FaTags className="text-gray-400" /> Tags:
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
              <span className="text-sm text-gray-700">{tag}</span>
            </label>
          ))}
          {tags.length === 0 && <span className="text-gray-400">Add tag...</span>}
        </div>
      </div>
      {/* Mood */}
      <div className="flex items-center gap-3 py-2">
        <span className="w-32 flex items-center gap-2 text-gray-600 font-medium">
          <FaSmile className="text-gray-400" /> Mood:
        </span>
        <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 hover:bg-blue-50 text-gray-700">
          <span>+</span>
        </button>
      </div>
      {/* Location */}
      <div className="flex items-center gap-3 py-2">
        <span className="w-32 flex items-center gap-2 text-gray-600 font-medium">
          <FaMapMarkerAlt className="text-gray-400" /> Location:
        </span>
        <select
          className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={selectedLocation}
          onChange={e => onLocationChange(e.target.value)}
        >
          {locations.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
      {/* 담당자 */}
      <div className="flex items-center gap-3 py-2">
        <span className="w-32 flex items-center gap-2 text-gray-600 font-medium">
          <FaUser className="text-gray-400" /> 담당자:
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
              <span className="text-sm text-gray-700">{member}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Photos */}
      <div className="flex items-center gap-3 py-2">
        <span className="w-32 flex items-center gap-2 text-gray-600 font-medium">
          <FaPhotoVideo className="text-gray-400" /> Photos:
        </span>
        <div className="flex-1 flex gap-2">
          <button className="px-3 py-2 border border-gray-300 rounded bg-gray-50 hover:bg-blue-50 text-gray-700">Select photos</button>
          <button className="px-3 py-2 border border-gray-300 rounded bg-gray-50 hover:bg-blue-50 text-gray-700">New photo</button>
        </div>
      </div>
      {/* 이미지 업로드 안내 */}
      <div className="mt-4">
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-400"
          value="Drag and drop to upload and reorder images"
          readOnly
        />
      </div>
    </div>
  );
};

export default DocMetaPanel; 