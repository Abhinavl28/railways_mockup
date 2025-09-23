import React from 'react';
import Button from '../../../components/ui/Button';


const ShiftControls = ({ currentShift, onShiftChange, platformView, onViewChange }) => {
  const shifts = [
    { id: 'morning', label: 'Morning', time: '06:00-14:00', icon: 'Sunrise' },
    { id: 'afternoon', label: 'Afternoon', time: '14:00-22:00', icon: 'Sun' },
    { id: 'night', label: 'Night', time: '22:00-06:00', icon: 'Moon' }
  ];

  const viewOptions = [
    { id: 'all', label: 'All Platforms', icon: 'Grid3x3' },
    { id: 'active', label: 'Active Only', icon: 'Activity' },
    { id: 'maintenance', label: 'Maintenance', icon: 'Wrench' }
  ];

  return (
    <div className="flex items-center space-x-6">
      {/* Shift Selection */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">Shift:</span>
        <div className="flex bg-muted rounded-lg p-1">
          {shifts?.map((shift) => (
            <Button
              key={shift?.id}
              variant={currentShift === shift?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onShiftChange(shift?.id)}
              iconName={shift?.icon}
              iconPosition="left"
              iconSize={14}
              className="text-xs"
            >
              {shift?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Platform View Toggle */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">View:</span>
        <div className="flex bg-muted rounded-lg p-1">
          {viewOptions?.map((option) => (
            <Button
              key={option?.id}
              variant={platformView === option?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(option?.id)}
              iconName={option?.icon}
              iconPosition="left"
              iconSize={14}
              className="text-xs"
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" iconName="RefreshCw" iconSize={14}>
          Refresh
        </Button>
        <Button variant="outline" size="sm" iconName="Download" iconSize={14}>
          Export
        </Button>
      </div>
    </div>
  );
};

export default ShiftControls;