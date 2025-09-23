import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedFilters = ({ filters, onFiltersChange, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const trainTypeOptions = [
    { value: 'express', label: 'Express' },
    { value: 'rajdhani', label: 'Rajdhani' },
    { value: 'shatabdi', label: 'Shatabdi' },
    { value: 'duronto', label: 'Duronto' },
    { value: 'garib-rath', label: 'Garib Rath' },
    { value: 'jan-shatabdi', label: 'Jan Shatabdi' }
  ];

  const routeOptions = [
    { value: 'mumbai-delhi', label: 'Mumbai - Delhi' },
    { value: 'delhi-kolkata', label: 'Delhi - Kolkata' },
    { value: 'chennai-bangalore', label: 'Chennai - Bangalore' },
    { value: 'pune-ahmedabad', label: 'Pune - Ahmedabad' },
    { value: 'hyderabad-vijayawada', label: 'Hyderabad - Vijayawada' }
  ];

  const weatherOptions = [
    { value: 'clear', label: 'Clear Weather' },
    { value: 'rain', label: 'Rainy' },
    { value: 'fog', label: 'Foggy' },
    { value: 'storm', label: 'Storm' },
    { value: 'extreme-heat', label: 'Extreme Heat' }
  ];

  const operationalFactors = [
    { id: 'signal-issues', label: 'Signal Issues', checked: filters?.operationalFactors?.includes('signal-issues') || false },
    { id: 'track-maintenance', label: 'Track Maintenance', checked: filters?.operationalFactors?.includes('track-maintenance') || false },
    { id: 'platform-congestion', label: 'Platform Congestion', checked: filters?.operationalFactors?.includes('platform-congestion') || false },
    { id: 'technical-issues', label: 'Technical Issues', checked: filters?.operationalFactors?.includes('technical-issues') || false },
    { id: 'crew-changes', label: 'Crew Changes', checked: filters?.operationalFactors?.includes('crew-changes') || false },
    { id: 'passenger-issues', label: 'Passenger Issues', checked: filters?.operationalFactors?.includes('passenger-issues') || false }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleOperationalFactorChange = (factorId, checked) => {
    const currentFactors = filters?.operationalFactors || [];
    let newFactors;
    
    if (checked) {
      newFactors = [...currentFactors, factorId];
    } else {
      newFactors = currentFactors?.filter(id => id !== factorId);
    }
    
    handleFilterChange('operationalFactors', newFactors);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.trainTypes?.length > 0) count++;
    if (filters?.routes?.length > 0) count++;
    if (filters?.weather?.length > 0) count++;
    if (filters?.operationalFactors?.length > 0) count++;
    if (filters?.delayRange?.min !== undefined || filters?.delayRange?.max !== undefined) count++;
    return count;
  };

  return (
    <div className="bg-card rounded-lg border border-border operational-shadow-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Advanced Filters
            </h3>
            {getActiveFiltersCount() > 0 && (
              <span className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Train Types */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Train Types</label>
            <Select
              options={trainTypeOptions}
              value={filters?.trainTypes || []}
              onChange={(value) => handleFilterChange('trainTypes', value)}
              multiple
              searchable
              placeholder="Select train types..."
              className="w-full"
            />
          </div>

          {/* Routes */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Routes</label>
            <Select
              options={routeOptions}
              value={filters?.routes || []}
              onChange={(value) => handleFilterChange('routes', value)}
              multiple
              searchable
              placeholder="Select routes..."
              className="w-full"
            />
          </div>

          {/* Weather Conditions */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Weather Conditions</label>
            <Select
              options={weatherOptions}
              value={filters?.weather || []}
              onChange={(value) => handleFilterChange('weather', value)}
              multiple
              placeholder="Select weather conditions..."
              className="w-full"
            />
          </div>

          {/* Delay Range */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Delay Range (minutes)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="Min delay"
                  value={filters?.delayRange?.min || ''}
                  onChange={(e) => handleFilterChange('delayRange', {
                    ...filters?.delayRange,
                    min: e?.target?.value ? parseInt(e?.target?.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max delay"
                  value={filters?.delayRange?.max || ''}
                  onChange={(e) => handleFilterChange('delayRange', {
                    ...filters?.delayRange,
                    max: e?.target?.value ? parseInt(e?.target?.value) : undefined
                  })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Operational Factors */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Operational Factors</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {operationalFactors?.map((factor) => (
                <Checkbox
                  key={factor?.id}
                  label={factor?.label}
                  checked={factor?.checked}
                  onChange={(e) => handleOperationalFactorChange(factor?.id, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Check"
                  iconPosition="left"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;