import Sidebar from './Sidebar';
import MainDashboard from './MainDashboard';
import Navbar from './Navbar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <MainDashboard />
      </div>
    </div>
  );
}
