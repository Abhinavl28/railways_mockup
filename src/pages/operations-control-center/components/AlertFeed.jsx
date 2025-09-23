import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AlertFeed = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 'A001',
      type: 'critical',
      title: 'Signal Failure',
      message: 'Signal malfunction detected at Junction North affecting Express 12345',
      location: 'Junction North - Platform 3',
      timestamp: new Date(Date.now() - 300000),
      acknowledged: false,
      affectedTrains: ['T001', 'T004']
    },
    {
      id: 'A002',
      type: 'warning',
      title: 'Train Delay',
      message: 'Local 67890 running 15 minutes behind schedule due to passenger boarding delays',
      location: 'Central Station - Platform 1',
      timestamp: new Date(Date.now() - 600000),
      acknowledged: true,
      affectedTrains: ['T002']
    },
    {
      id: 'A003',
      type: 'info',
      title: 'Track Maintenance',
      message: 'Scheduled maintenance on Track Segment TS002 completed successfully',
      location: 'Track Segment TS002',
      timestamp: new Date(Date.now() - 900000),
      acknowledged: true,
      affectedTrains: []
    },
    {
      id: 'A004',
      type: 'warning',
      title: 'Platform Congestion',
      message: 'High passenger volume detected at Terminal South, consider crowd management',
      location: 'Terminal South - All Platforms',
      timestamp: new Date(Date.now() - 1200000),
      acknowledged: false,
      affectedTrains: ['T003', 'T005']
    },
    {
      id: 'A005',
      type: 'critical',
      title: 'Weather Alert',
      message: 'Heavy rainfall warning issued for Section B, reduce speed limits to 60 km/h',
      location: 'Section B - All Tracks',
      timestamp: new Date(Date.now() - 1800000),
      acknowledged: false,
      affectedTrains: ['T001', 'T002', 'T003']
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, critical, warning, info

  const getAlertConfig = (type) => {
    switch (type) {
      case 'critical':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          iconColor: 'text-error',
          icon: 'AlertTriangle'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          iconColor: 'text-warning',
          icon: 'AlertCircle'
        };
      case 'info':
        return {
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          iconColor: 'text-primary',
          icon: 'Info'
        };
      default:
        return {
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/20',
          iconColor: 'text-muted-foreground',
          icon: 'Bell'
        };
    }
  };

  const handleAcknowledge = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const filteredAlerts = alerts?.filter(alert => 
    filter === 'all' || alert?.type === filter
  );

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="bg-card border border-border rounded-lg h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Live Alerts</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full status-pulse"></div>
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex items-center space-x-1">
          {['all', 'critical', 'warning', 'info']?.map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 text-xs rounded-full operational-hover transition-colors ${
                filter === filterType
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {filterType?.charAt(0)?.toUpperCase() + filterType?.slice(1)}
              {filterType !== 'all' && (
                <span className="ml-1">
                  ({alerts?.filter(a => a?.type === filterType)?.length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Alert List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredAlerts?.map(alert => {
          const config = getAlertConfig(alert?.type);
          
          return (
            <div
              key={alert?.id}
              className={`p-3 rounded-lg border ${config?.borderColor} ${config?.bgColor} ${
                !alert?.acknowledged ? 'ring-1 ring-current ring-opacity-20' : 'opacity-75'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 ${config?.iconColor} mt-0.5`}>
                  <Icon name={config?.icon} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {alert?.title}
                    </h4>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatTimeAgo(alert?.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                    {alert?.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {alert?.location}
                      </span>
                    </div>
                    
                    {!alert?.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alert?.id)}
                        className="text-xs text-primary hover:text-primary/80 font-medium operational-hover"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                  
                  {alert?.affectedTrains?.length > 0 && (
                    <div className="mt-2 flex items-center space-x-1">
                      <Icon name="Train" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Affects: {alert?.affectedTrains?.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredAlerts?.length} alerts shown</span>
          <button className="text-primary hover:text-primary/80 operational-hover">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertFeed;