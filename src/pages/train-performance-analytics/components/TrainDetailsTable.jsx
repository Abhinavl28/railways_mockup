import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrainDetailsTable = ({ selectedTrain }) => {
  const [sortField, setSortField] = useState('scheduledTime');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedRow, setExpandedRow] = useState(null);

  const mockRouteData = [
    {
      id: 1,
      station: 'Mumbai Central',
      scheduledTime: '06:00',
      actualTime: '06:02',
      delay: 2,
      delayCause: 'Platform congestion',
      severity: 'low',
      distance: 0,
      passengers: 1250
    },
    {
      id: 2,
      station: 'Borivali',
      scheduledTime: '06:35',
      actualTime: '06:40',
      delay: 5,
      delayCause: 'Signal delay',
      severity: 'medium',
      distance: 28,
      passengers: 980
    },
    {
      id: 3,
      station: 'Vapi',
      scheduledTime: '07:45',
      actualTime: '07:53',
      delay: 8,
      delayCause: 'Track maintenance',
      severity: 'medium',
      distance: 95,
      passengers: 750
    },
    {
      id: 4,
      station: 'Surat',
      scheduledTime: '08:30',
      actualTime: '08:45',
      delay: 15,
      delayCause: 'Weather conditions',
      severity: 'high',
      distance: 162,
      passengers: 650
    },
    {
      id: 5,
      station: 'Vadodara',
      scheduledTime: '09:15',
      actualTime: '09:35',
      delay: 20,
      delayCause: 'Technical issue',
      severity: 'high',
      distance: 230,
      passengers: 580
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'high': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'low': return 'CheckCircle';
      case 'medium': return 'AlertCircle';
      case 'high': return 'AlertTriangle';
      default: return 'Circle';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...mockRouteData]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'scheduledTime' || sortField === 'actualTime') {
      aValue = new Date(`2024-01-01 ${aValue}`);
      bValue = new Date(`2024-01-01 ${bValue}`);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="bg-card rounded-lg border border-border operational-shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Route" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Route Details & Performance
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Filter"
              iconPosition="left"
            >
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>
        </div>
      </div>
      {!selectedTrain ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Icon name="Route" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select a train to view route details</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">
                  <button
                    onClick={() => handleSort('station')}
                    className="flex items-center space-x-1 hover:text-primary operational-hover"
                  >
                    <span>Station</span>
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  <button
                    onClick={() => handleSort('scheduledTime')}
                    className="flex items-center space-x-1 hover:text-primary operational-hover"
                  >
                    <span>Scheduled</span>
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  <button
                    onClick={() => handleSort('actualTime')}
                    className="flex items-center space-x-1 hover:text-primary operational-hover"
                  >
                    <span>Actual</span>
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  <button
                    onClick={() => handleSort('delay')}
                    className="flex items-center space-x-1 hover:text-primary operational-hover"
                  >
                    <span>Delay</span>
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData?.map((row) => (
                <React.Fragment key={row?.id}>
                  <tr className="border-b border-border hover:bg-muted/50 operational-hover">
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Icon name="MapPin" size={16} className="text-muted-foreground" />
                        <span className="font-medium text-foreground">{row?.station}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-mono">
                      {row?.scheduledTime}
                    </td>
                    <td className="p-4 text-foreground font-mono">
                      {row?.actualTime}
                    </td>
                    <td className="p-4">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${row?.delay <= 5 ? 'text-success bg-success/10' : 
                          row?.delay <= 15 ? 'text-warning bg-warning/10': 'text-error bg-error/10'}
                      `}>
                        +{row?.delay} min
                      </span>
                    </td>
                    <td className="p-4">
                      <div className={`
                        flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium w-fit
                        ${getSeverityColor(row?.severity)}
                      `}>
                        <Icon name={getSeverityIcon(row?.severity)} size={12} />
                        <span className="capitalize">{row?.severity}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(row?.id)}
                        iconName={expandedRow === row?.id ? "ChevronUp" : "ChevronDown"}
                        iconPosition="right"
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                  
                  {expandedRow === row?.id && (
                    <tr className="bg-muted/30">
                      <td colSpan="6" className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-foreground">Delay Information</h4>
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Icon name="AlertCircle" size={14} />
                                <span>Cause: {row?.delayCause}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Icon name="Clock" size={14} />
                                <span>Duration: {row?.delay} minutes</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-foreground">Station Details</h4>
                            <div className="text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Icon name="Route" size={14} />
                                <span>Distance: {row?.distance} km</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Icon name="Users" size={14} />
                                <span>Passengers: {row?.passengers?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-foreground">Actions</h4>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                View History
                              </Button>
                              <Button variant="outline" size="sm">
                                Report Issue
                              </Button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrainDetailsTable;