import Calendar from './calendar/Calendar';

export default function Sidebar() {
  return (
    <aside className="w-80 bg-[#232323] text-white flex flex-col p-4">
      {/* 프로필 */}
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-2" />
        <div className="text-center font-bold">유영현</div>
        <div className="text-center font-bold">IT 프로젝트팀</div>
      </div>
      {/* 검색/정렬 */}
      <div className="mb-4">
        <input className="w-full p-2 rounded bg-gray-800 text-white" placeholder="검색" />
      </div>
      {/* 달력 */}
      <div className="mb-6">
        <Calendar />
      </div>
      {/* 조직 */}
      <div className="mb-4">
        <div className="font-bold mb-1">조직</div>
        <div className="bg-gray-800 rounded p-2 mb-1">조직1</div>
        <div className="bg-gray-800 rounded p-2 mb-1">조직2</div>
        <div className="bg-gray-800 rounded p-2">조직3</div>
      </div>
      {/* 과제 */}
      <div className="mb-4">
        <div className="font-bold mb-1">과제</div>
        <div className="bg-gray-800 rounded p-2 mb-1">과제1</div>
        <div className="bg-gray-800 rounded p-2 mb-1">과제2</div>
        <div className="bg-gray-800 rounded p-2">과제3</div>
      </div>
      {/* 프로젝트 */}
      <div>
        <div className="font-bold mb-1">프로젝트</div>
        <div className="bg-gray-800 rounded p-2 mb-1">프로젝트1</div>
        <div className="bg-gray-800 rounded p-2">프로젝트2</div>
      </div>
    </aside>
  );
} 