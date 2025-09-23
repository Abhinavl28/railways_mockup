import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const StationSelector = ({ selectedStation, onStationChange, stations }) => {
  const [isOnline, setIsOnline] = useState(true);

  const stationOptions = stations?.map(station => ({
    value: station?.id,
    label: `${station?.name} (${station?.code})`,
    description: `${station?.platforms} platforms • ${station?.tracks} tracks`
  }));

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success' : 'bg-error'} status-pulse`}></div>
        <span className="text-sm font-medium text-foreground">Station Control</span>
      </div>
      <Select
        options={stationOptions}
        value={selectedStation}
        onChange={onStationChange}
        placeholder="Select Station"
        className="min-w-64"
        searchable
      />
      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Icon name="Clock" size={16} />
        <span className="font-mono">
          {new Date()?.toLocaleTimeString('en-GB', { hour12: false })}
        </span>
      </div>
    </div>
  );
};

export default StationSelector;