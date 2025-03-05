
import React from 'react';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import GrowthChart from '@/components/dashboard/GrowthChart';
import SystemHealth from '@/components/dashboard/SystemHealth';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';
import MessageCenter from '@/components/dashboard/MessageCenter';

const Index = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to the RentalKE admin dashboard.
        </p>
      </div>
      
      {/* Metrics Cards */}
      <DashboardMetrics />
      
      {/* Growth Chart */}
      <div className="pt-2">
        <GrowthChart />
      </div>
      
      {/* Two-column layout for smaller components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <SystemHealth />
        <div className="space-y-6">
          <NotificationsPanel />
          <MessageCenter />
        </div>
      </div>
    </div>
  );
};

export default Index;
