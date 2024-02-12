// DashboardPage.js
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/Sidebar"; // Correct import

export default function DashboardPage() {
  return (
    <div>
     <Sidebar />
    <>
      <Dashboard />
    </>
    </div>
  );
}
