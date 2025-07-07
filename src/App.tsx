import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Overview from './components/Dashboard/Overview';
import Employees from './components/Dashboard/Employees';
import Performance from './components/Dashboard/Performance';
import Attendance from './components/Dashboard/Attendance';
import Payroll from './components/Dashboard/Payroll';
import Recruitment from './components/Dashboard/Recruitment';
import Training from './components/Dashboard/Training';
import Notifications from './components/Dashboard/Notifications';

function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'employees':
        return <Employees />;
      case 'performance':
        return <Performance />;
      case 'attendance':
        return <Attendance />;
      case 'payroll':
        return <Payroll />;
      case 'recruitment':
        return <Recruitment />;
      case 'training':
        return <Training />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">HR Dashboard</h1>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;