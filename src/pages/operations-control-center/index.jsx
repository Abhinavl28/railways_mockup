import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import EmergencyAlert from '../../components/ui/EmergencyAlert';
import ContextBreadcrumb from '../../components/ui/ContextBreadcrumb';
import KPICard from './components/KPICard';
import NetworkMap from './components/NetworkMap';
import AlertFeed from './components/AlertFeed';
import TrafficSimulationAI from './components/TrafficSimulationAI';
import ActiveTrainsTable from './components/ActiveTrainsTable';

const OperationsControlCenter = () => {
  const [emergencyAlert, setEmergencyAlert] = useState(null);

  // Mock KPI data
  const kpiData = [
    {
      title: 'On-Time Performance',
      value: '87.5',
      unit: '%',
      status: 'warning',
      icon: 'Clock',
      trend: 'down',
      trendValue: '2.3%'
    },
    {
      title: 'Active Delays',
      value: '12',
      unit: 'trains',
      status: 'warning',
      icon: 'AlertCircle',
      trend: 'up',
      trendValue: '3'
    },
    {
      title: 'Track Utilization',
      value: '73.2',
      unit: '%',
      status: 'good',
      icon: 'Activity',
      trend: 'up',
      trendValue: '5.1%'
    },
    {
      title: 'Trains in Motion',
      value: '45',
      unit: 'active',
      status: 'good',
      icon: 'Train',
      trend: 'up',
      trendValue: '7'
    }
  ];

  // Simulate emergency alerts
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmergencyAlert({
        level: 'critical',
        title: 'Signal System Alert',
        message: 'Automatic signal failure detected at Junction North. Manual operations in effect.',
        location: 'Junction North - Signal Box 7',
        timestamp: new Date(),
        actionLabel: 'View Details',
        onAction: () => {
          console.log('Navigate to signal management');
        },
        dismissible: true
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismissAlert = () => {
    setEmergencyAlert(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyAlert alert={emergencyAlert} onDismiss={handleDismissAlert} />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <ContextBreadcrumb />
        
        {/* Page Header with highlighted headings */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2 border-l-4 border-primary pl-4">
            Operations Control Center
          </h1>
          <p className="text-muted-foreground pl-6">
            Real-time railway operations monitoring and control dashboard for section controllers and station masters
          </p>
        </div>

        {/* KPI Cards with highlighted headings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
            System Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                unit={kpi?.unit}
                status={kpi?.status}
                icon={kpi?.icon}
                trend={kpi?.trend}
                trendValue={kpi?.trendValue}
              />
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Network Map - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
              Real-Time Network Overview
            </h2>
            <NetworkMap />
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
                System Alerts
              </h2>
              <AlertFeed />
            </div>

            {/* AI Traffic Simulation Panel */}
            <div>
              <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
                Traffic Simulation (AI)
              </h2>
              <TrafficSimulationAI />
            </div>
          </div>
        </div>

        {/* Active Trains Table */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
            Active Train Operations
          </h2>
          <ActiveTrainsTable />
        </div>

        {/* Footer Information */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              Railway Control Dashboard v2.1 - Last updated: {new Date()?.toLocaleString()}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© {new Date()?.getFullYear()} Train-AI Operations</span>
              <span>•</span>
              <span>System Status: Operational</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OperationsControlCenter;