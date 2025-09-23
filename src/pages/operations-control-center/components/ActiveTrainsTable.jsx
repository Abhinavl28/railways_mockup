import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ActiveTrainsTable = () => {
  const [expandedTrain, setExpandedTrain] = useState(null);
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState('desc');

  const trainsData = [
    {
      id: 'T001',
      name: 'Express 12345',
      type: 'Express',
      currentLocation: 'Junction North - Platform 2',
      destination: 'Delhi Central',
      delay: 0,
      status: 'on-time',
      priority: 'high',
      speed: 85,
      nextStation: 'Central Station',
      eta: '14:25',
      passengers: 450,
      capacity: 500,
      lastUpdate: new Date(Date.now() - 30000)
    },
    {
      id: 'T002',
      name: 'Local 67890',
      type: 'Local',
      currentLocation: 'Central Station - Platform 1',
      destination: 'Jaipur Junction',
      delay: 15,
      status: 'delayed',
      priority: 'medium',
      speed: 45,
      nextStation: 'Terminal South',
      eta: '14:45',
      passengers: 280,
      capacity: 350,
      lastUpdate: new Date(Date.now() - 60000)
    },
    {
      id: 'T003',
      name: 'Freight 11111',
      type: 'Freight',
      currentLocation: 'Terminal South - Yard 3',
      destination: 'Bangalore Goods',
      delay: 5,
      status: 'on-time',
      priority: 'low',
      speed: 60,
      nextStation: 'Industrial Siding',
      eta: '15:10',
      passengers: 0,
      capacity: 0,
      lastUpdate: new Date(Date.now() - 45000)
    },
    {
      id: 'T004',
      name: 'Superfast 22222',
      type: 'Superfast',
      currentLocation: 'Signal Box 7 - Track 2',
      destination: 'Mumbai Central',
      delay: 25,
      status: 'critical',
      priority: 'high',
      speed: 0,
      nextStation: 'Junction North',
      eta: '15:30',
      passengers: 650,
      capacity: 700,
      lastUpdate: new Date(Date.now() - 120000)
    },
    {
      id: 'T005',
      name: 'Express 33333',
      type: 'Express',
      currentLocation: 'Outer Signal - Track 1',
      destination: 'Chennai Central',
      delay: 8,
      status: 'delayed',
      priority: 'medium',
      speed: 75,
      nextStation: 'Terminal South',
      eta: '16:15',
      passengers: 380,
      capacity: 450,
      lastUpdate: new Date(Date.now() - 90000)
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'on-time':
        return { color: 'text-success', bg: 'bg-success/10', icon: 'CheckCircle' };
      case 'delayed':
        return { color: 'text-warning', bg: 'bg-warning/10', icon: 'Clock' };
      case 'critical':
        return { color: 'text-error', bg: 'bg-error/10', icon: 'AlertTriangle' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted/10', icon: 'Circle' };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return { color: 'text-error', bg: 'bg-error/10' };
      case 'medium':
        return { color: 'text-warning', bg: 'bg-warning/10' };
      case 'low':
        return { color: 'text-success', bg: 'bg-success/10' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted/10' };
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedTrains = [...trainsData]?.sort((a, b) => {
    let aValue = a?.[sortBy];
    let bValue = b?.[sortBy];
    
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      aValue = priorityOrder?.[aValue];
      bValue = priorityOrder?.[bValue];
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    return minutes > 0 ? `${minutes}m ago` : 'Just now';
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Active Trains</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {trainsData?.length} trains active
            </span>
            <div className="w-2 h-2 bg-success rounded-full status-pulse"></div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-foreground operational-hover"
                >
                  <span>Train</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Current Location
              </th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-foreground operational-hover"
                >
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('delay')}
                  className="flex items-center space-x-1 hover:text-foreground operational-hover"
                >
                  <span>Delay</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center space-x-1 hover:text-foreground operational-hover"
                >
                  <span>Priority</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTrains?.map(train => {
              const statusConfig = getStatusConfig(train?.status);
              const priorityConfig = getPriorityConfig(train?.priority);
              const isExpanded = expandedTrain === train?.id;
              
              return (
                <React.Fragment key={train?.id}>
                  <tr className="hover:bg-muted/30 operational-hover">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                          <Icon name="Train" size={16} className="text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{train?.name}</div>
                          <div className="text-xs text-muted-foreground">{train?.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-foreground">{train?.currentLocation}</div>
                      <div className="text-xs text-muted-foreground">→ {train?.destination}</div>
                    </td>
                    <td className="p-3">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.bg} ${statusConfig?.color}`}>
                        <Icon name={statusConfig?.icon} size={12} />
                        <span>{train?.status?.replace('-', ' ')?.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`text-sm font-medium ${train?.delay > 0 ? 'text-warning' : 'text-success'}`}>
                        {train?.delay > 0 ? `+${train?.delay}m` : 'On Time'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityConfig?.bg} ${priorityConfig?.color}`}>
                        {train?.priority?.toUpperCase()}
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setExpandedTrain(isExpanded ? null : train?.id)}
                        className="text-primary hover:text-primary/80 operational-hover"
                      >
                        <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan="6" className="p-0">
                        <div className="bg-muted/20 p-4 border-t border-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Speed</div>
                              <div className="text-sm font-medium text-foreground">
                                {train?.speed} km/h
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Next Station</div>
                              <div className="text-sm font-medium text-foreground">
                                {train?.nextStation}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">ETA</div>
                              <div className="text-sm font-medium text-foreground">
                                {train?.eta}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Last Update</div>
                              <div className="text-sm font-medium text-foreground">
                                {formatTimeAgo(train?.lastUpdate)}
                              </div>
                            </div>
                            {train?.passengers > 0 && (
                              <>
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Passengers</div>
                                  <div className="text-sm font-medium text-foreground">
                                    {train?.passengers} / {train?.capacity}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Occupancy</div>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex-1 bg-muted rounded-full h-2">
                                      <div 
                                        className="bg-primary rounded-full h-2 transition-all duration-300"
                                        style={{ width: `${(train?.passengers / train?.capacity) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {Math.round((train?.passengers / train?.capacity) * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveTrainsTable;