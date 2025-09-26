import React, { useEffect, useState } from 'react';
import Welcome from '../components/Welcome';
import EnhancedVaultInfo from '../components/EnhancedVaultInfo';
import EnhancedOrderManagement from '../components/EnhancedOrderManagement';
import DashboardSidebar from '../components/DashboardSidebar';
import { userService, UserSummary } from '../api/services/userService';

const Dashboard: React.FC = () => {

  const [userSummary, setUserSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserSummary = async () => {
      try {
        setLoading(true);
        const res = await userService.getUserSummary();
        if (res.success) {
          setUserSummary(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch user summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="lg:pl-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Welcome userSummary={userSummary} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EnhancedVaultInfo userSummary={userSummary} />
            <EnhancedOrderManagement userSummary={userSummary} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;