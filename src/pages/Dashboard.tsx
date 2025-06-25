import React from 'react';
import Welcome from '../components/Welcome';
import EnhancedVaultInfo from '../components/VaultInfo';
import EnhancedOrderManagement from '../components/OrderManagement';
import DashboardSidebar from '../components/DashboardSidebar';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="lg:pl-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Welcome />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EnhancedVaultInfo />
            <EnhancedOrderManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;