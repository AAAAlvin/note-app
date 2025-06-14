import Sidebar from './Sidebar';
import MainDashboard from './MainDashboard';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <MainDashboard />
    </div>
  );
}
