import { FiPlus, FiFilter, FiList, FiChevronLeft, FiChevronRight, FiDownload, FiGrid, FiSettings, FiMoreVertical } from 'react-icons/fi';

export default function Navbar() {
  return (
    <div className="bg-[#232323] text-white h-14 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="p-1.5 hover:bg-[#2c3136] rounded">
          <FiFilter className="text-lg" />
        </button>
        <button className="p-1.5 hover:bg-[#2c3136] rounded">
          <FiList className="text-lg" />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-[#2c3136] rounded">
          <FiPlus className="text-lg" />
        </button>

        <button className="p-1.5 hover:bg-[#2c3136] rounded">
          <FiChevronLeft className="text-lg" />
        </button>
        <button className="p-1.5 hover:bg-[#2c3136] rounded">
          <FiChevronRight className="text-lg" />
        </button>
        <button className="p-1.5 hover:bg-[#2c3136] rounded">
          <FiDownload className="text-lg" />
        </button>
        <button className="p-1.5 hover:bg-[#2c3136] rounded">
          <FiGrid className="text-lg" />
        </button>
        <button className="p-1.5 hover:bg-[#2c3136] rounded">
          <FiSettings className="text-lg" />
        </button>
        <button className="p-1.5 hover:bg-[#2c3136] rounded">
          <FiMoreVertical className="text-lg" />
        </button>
      </div>
    </div>
  );
} 