import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ContextBreadcrumb from '../../components/ui/ContextBreadcrumb';
import EmergencyAlert from '../../components/ui/EmergencyAlert';
import TrainSelector from './components/TrainSelector';
import DateRangePicker from './components/DateRangePicker';
import MetricsStrip from './components/MetricsStrip';
import DelayPatternsChart from './components/DelayPatternsChart';
import TrainDetailsTable from './components/TrainDetailsTable';
import Icon from '../../components/AppIcon';


const TrainPerformanceAnalytics = () => {
  const [selectedTrain, setSelectedTrain] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
    end: new Date(),
    preset: 'week'
  });
  const [comparisonMode, setComparisonMode] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock performance metrics
  const mockMetrics = {
    punctuality: 78.5,
    punctualityTrend: -2.3,
    avgDelay: 12.8,
    delayTrend: 1.8,
    distance: 1247,
    distanceTrend: 0.5,
    utilization: 85.2,
    utilizationTrend: 3.2
  };

  useEffect(() => {
    // Simulate data refresh every 5 minutes
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate emergency alert for demonstration
    const alertTimeout = setTimeout(() => {
      setEmergencyAlert({
        level: 'warning',
        title: 'Performance Alert',
        message: 'Train T12345 experiencing significant delays on Mumbai-Delhi route',
        location: 'Vadodara Junction',
        timestamp: new Date(),
        actionLabel: 'View Details',
        onAction: () => {
          setSelectedTrain('T12345');
          setEmergencyAlert(null);
        },
        dismissible: true
      });
    }, 3000);

    return () => clearTimeout(alertTimeout);
  }, []);

  const handleTrainSelect = (trainId) => {
    setSelectedTrain(trainId);
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const handleComparisonToggle = () => {
    setComparisonMode(!comparisonMode);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyAlert 
        alert={emergencyAlert} 
        onDismiss={() => setEmergencyAlert(null)} 
      />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <ContextBreadcrumb />
        
        {/* Page Header with highlighted headings */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary border-l-4 border-primary pl-4">
                Train Performance Analytics
              </h1>
              <p className="text-muted-foreground mt-1 ml-6">
                Analyze individual train metrics and performance optimization opportunities
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdate?.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TrainSelector
              selectedTrain={selectedTrain}
              onTrainSelect={handleTrainSelect}
              onFilterChange={() => {}} // Add missing required prop
            />
          </div>
          <div>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              comparisonMode={comparisonMode}
              onComparisonToggle={handleComparisonToggle}
            />
          </div>
        </div>

        {/* Performance Metrics with highlighted heading */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
            Performance Indicators
          </h2>
          <MetricsStrip 
            metrics={mockMetrics} 
            comparisonMode={comparisonMode} 
          />
        </div>

        {/* Main Analytics Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Delay Patterns Chart - Main Content */}
          <div className="xl:col-span-2">
            <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
              Performance Patterns Analysis
            </h2>
            <DelayPatternsChart 
              selectedTrain={selectedTrain}
              dateRange={dateRange}
            />
          </div>
          
          {/* Train Details Table - Right Panel */}
          <div className="xl:col-span-1">
            <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
              Train Details
            </h2>
            <TrainDetailsTable selectedTrain={selectedTrain} />
          </div>
        </div>

        {/* System Status Footer */}
        <div className="mt-12 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full status-pulse"></div>
                <span className="text-sm font-medium text-success">Analytics System Online</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Data refresh: Every 5 minutes
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Database" size={14} />
                <span>Data Sources: 3 Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>Response Time: &lt;200ms</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainPerformanceAnalytics;