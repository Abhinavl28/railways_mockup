import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScheduleTable = ({ schedules, onPlatformReassign, onTrainClick }) => {
  const [sortBy, setSortBy] = useState('time');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'ontime': return 'text-success';
      case 'delayed': return 'text-error';
      case 'early': return 'text-primary';
      case 'cancelled': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'ontime': return 'bg-success/10';
      case 'delayed': return 'bg-error/10';
      case 'early': return 'bg-primary/10';
      case 'cancelled': return 'bg-muted/10';
      default: return 'bg-muted/10';
    }
  };

  const getConflictLevel = (conflicts) => {
    if (conflicts >= 3) return { color: 'text-error', bg: 'bg-error/10', label: 'High' };
    if (conflicts >= 1) return { color: 'text-warning', bg: 'bg-warning/10', label: 'Medium' };
    return { color: 'text-success', bg: 'bg-success/10', label: 'None' };
  };

  const sortedSchedules = [...schedules]?.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'time':
        aValue = new Date(`2024-01-01 ${a.scheduledTime}`);
        bValue = new Date(`2024-01-01 ${b.scheduledTime}`);
        break;
      case 'train':
        aValue = a?.trainNumber;
        bValue = b?.trainNumber;
        break;
      case 'platform':
        aValue = a?.platform;
        bValue = b?.platform;
        break;
      case 'delay':
        aValue = a?.delay || 0;
        bValue = b?.delay || 0;
        break;
      default:
        aValue = a?.[sortBy];
        bValue = b?.[sortBy];
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const filteredSchedules = sortedSchedules?.filter(schedule => {
    if (filterStatus === 'all') return true;
    return schedule?.status === filterStatus;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 operational-shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Train Schedule</h2>
        
        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <div className="flex bg-muted rounded-lg p-1">
            {['all', 'ontime', 'delayed', 'early']?.map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="text-xs capitalize"
              >
                {status === 'all' ? 'All' : status?.replace('ontime', 'On Time')}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" iconName="Download" iconSize={14}>
            Export
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('time')}
                  iconName={sortBy === 'time' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                  iconPosition="right"
                  iconSize={14}
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  Time
                </Button>
              </th>
              <th className="text-left py-3 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('train')}
                  iconName={sortBy === 'train' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                  iconPosition="right"
                  iconSize={14}
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  Train
                </Button>
              </th>
              <th className="text-left py-3 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('platform')}
                  iconName={sortBy === 'platform' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                  iconPosition="right"
                  iconSize={14}
                  className="font-medium text-muted-foreground hover:text-foreground"
                >
                  Platform
                </Button>
              </th>
              <th className="text-left py-3 px-4">
                <span className="font-medium text-muted-foreground">Route</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="font-medium text-muted-foreground">Load</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="font-medium text-muted-foreground">Status</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="font-medium text-muted-foreground">Conflicts</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules?.map((schedule) => {
              const conflict = getConflictLevel(schedule?.conflicts || 0);
              
              return (
                <tr 
                  key={schedule?.id} 
                  className="border-b border-border hover:bg-muted/50 operational-hover cursor-pointer"
                  onClick={() => onTrainClick(schedule)}
                >
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">
                        {schedule?.scheduledTime}
                      </div>
                      {schedule?.actualTime && schedule?.actualTime !== schedule?.scheduledTime && (
                        <div className="text-xs text-muted-foreground">
                          Actual: {schedule?.actualTime}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="Train" size={16} className="text-primary" />
                      <div>
                        <div className="font-medium text-foreground">
                          {schedule?.trainNumber}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {schedule?.trainType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">
                        {schedule?.platform}
                      </span>
                      {schedule?.platformReassigned && (
                        <Icon name="ArrowRight" size={12} className="text-warning" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="text-sm text-foreground">
                        {schedule?.origin} → {schedule?.destination}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {schedule?.distance}km • {schedule?.duration}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-foreground">
                        {schedule?.expectedLoad}%
                      </div>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            schedule?.expectedLoad > 80 ? 'bg-error' :
                            schedule?.expectedLoad > 60 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${schedule?.expectedLoad}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(schedule?.status)} ${getStatusColor(schedule?.status)}`}>
                      <div className={`w-2 h-2 rounded-full ${
                        schedule?.status === 'ontime' ? 'bg-success' :
                        schedule?.status === 'delayed' ? 'bg-error' :
                        schedule?.status === 'early' ? 'bg-primary' : 'bg-muted'
                      }`}></div>
                      <span>
                        {schedule?.status === 'delayed' && schedule?.delay ? `+${schedule?.delay}min` :
                         schedule?.status === 'early' && schedule?.early ? `-${schedule?.early}min` :
                         schedule?.status?.replace('ontime', 'On Time')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${conflict?.bg} ${conflict?.color}`}>
                      <Icon 
                        name={schedule?.conflicts > 0 ? 'AlertTriangle' : 'CheckCircle'} 
                        size={12} 
                      />
                      <span>{conflict?.label}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onPlatformReassign(schedule);
                        }}
                        iconName="ArrowRightLeft"
                        iconSize={14}
                      >
                        Reassign
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onTrainClick(schedule);
                        }}
                        iconName="Eye"
                        iconSize={14}
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredSchedules?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No schedules found</h3>
          <p className="text-muted-foreground">
            {filterStatus === 'all' ? 'No train schedules available' : `No ${filterStatus} trains found`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;