import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ControlPanel = () => {
  const [selectedSection, setSelectedSection] = useState('section-a');
  const [timeRange, setTimeRange] = useState('30min');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  const sectionOptions = [
    { value: 'section-a', label: 'Section A - Mumbai Division' },
    { value: 'section-b', label: 'Section B - Delhi Division' },
    { value: 'section-c', label: 'Section C - Chennai Division' },
    { value: 'all-sections', label: 'All Sections' }
  ];

  const timeRangeOptions = [
    { value: '30min', label: 'Last 30 minutes' },
    { value: '1hour', label: 'Last 1 hour' },
    { value: '4hours', label: 'Last 4 hours' },
    { value: '12hours', label: 'Last 12 hours' },
    { value: '24hours', label: 'Last 24 hours' }
  ];

  const refreshIntervalOptions = [
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' }
  ];

  const handleEmergencyStop = () => {
    // Mock emergency stop functionality
    alert('Emergency stop signal sent to all trains in selected section');
  };

  const handleSystemReset = () => {
    // Mock system reset functionality
    alert('System reset initiated - all displays will refresh');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Section Selector */}
          <div className="w-full sm:w-64">
            <Select
              label="Railway Section"
              options={sectionOptions}
              value={selectedSection}
              onChange={setSelectedSection}
              className="text-sm"
            />
          </div>

          {/* Time Range Selector */}
          <div className="w-full sm:w-48">
            <Select
              label="Time Range"
              options={timeRangeOptions}
              value={timeRange}
              onChange={setTimeRange}
              className="text-sm"
            />
          </div>

          {/* Auto Refresh Toggle */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="auto-refresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e?.target?.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="auto-refresh" className="text-sm text-foreground">
                Auto Refresh
              </label>
            </div>
            
            {autoRefresh && (
              <div className="w-32">
                <Select
                  options={refreshIntervalOptions}
                  value={refreshInterval}
                  onChange={setRefreshInterval}
                  className="text-xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* System Status */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-success/10 rounded-lg">
            <div className="w-2 h-2 bg-success rounded-full status-pulse"></div>
            <span className="text-sm font-medium text-success">System Online</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={() => window.location?.reload()}
            >
              Refresh
            </Button>

            <Button
              variant="warning"
              size="sm"
              iconName="AlertTriangle"
              iconPosition="left"
              onClick={handleEmergencyStop}
            >
              Emergency Stop
            </Button>

            <Button
              variant="secondary"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={handleSystemReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      {/* Status Bar */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Database" size={16} />
              <span>Last sync: {new Date()?.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} />
              <span>3 operators online</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={16} />
              <span>System load: 67%</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Signaling: Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-muted-foreground">TMS: Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">Weather: Monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;