import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ArrivalDepartureBoard = ({ arrivals, departures }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('arrivals');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ontime': return 'text-success';
      case 'delayed': return 'text-error';
      case 'early': return 'text-primary';
      case 'boarding': return 'text-warning';
      case 'departed': return 'text-muted-foreground';
      case 'cancelled': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ontime': return 'CheckCircle';
      case 'delayed': return 'Clock';
      case 'early': return 'FastForward';
      case 'boarding': return 'Users';
      case 'departed': return 'ArrowRight';
      case 'cancelled': return 'XCircle';
      default: return 'Circle';
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2024-01-01 ${timeString}`)?.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const BoardRow = ({ train, type }) => (
    <div className="grid grid-cols-12 gap-4 py-3 px-4 border-b border-border hover:bg-muted/50 operational-hover">
      <div className="col-span-2">
        <div className="font-mono text-lg font-bold text-foreground">
          {formatTime(train?.scheduledTime)}
        </div>
        {train?.actualTime && train?.actualTime !== train?.scheduledTime && (
          <div className="font-mono text-sm text-muted-foreground">
            {formatTime(train?.actualTime)}
          </div>
        )}
      </div>
      
      <div className="col-span-2">
        <div className="font-medium text-foreground">{train?.trainNumber}</div>
        <div className="text-sm text-muted-foreground">{train?.trainType}</div>
      </div>
      
      <div className="col-span-3">
        <div className="font-medium text-foreground">
          {type === 'arrivals' ? train?.origin : train?.destination}
        </div>
        {train?.via && (
          <div className="text-sm text-muted-foreground">via {train?.via}</div>
        )}
      </div>
      
      <div className="col-span-1 text-center">
        <div className="font-medium text-foreground">{train?.platform}</div>
      </div>
      
      <div className="col-span-2">
        <div className={`flex items-center space-x-2 ${getStatusColor(train?.status)}`}>
          <Icon name={getStatusIcon(train?.status)} size={16} />
          <span className="font-medium text-sm">
            {train?.status === 'delayed' && train?.delay ? `+${train?.delay}min` :
             train?.status === 'early' && train?.early ? `-${train?.early}min` :
             train?.status?.replace('ontime', 'On Time')?.replace(/^\w/, c => c?.toUpperCase())}
          </span>
        </div>
      </div>
      
      <div className="col-span-2 text-right">
        {train?.coaches && (
          <div className="text-sm text-muted-foreground">
            {train?.coaches} coaches
          </div>
        )}
        {train?.expectedLoad && (
          <div className="text-sm text-muted-foreground">
            {train?.expectedLoad}% full
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg operational-shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Monitor" size={24} />
            <h2 className="text-xl font-bold">Live Departure Board</h2>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-bold">
              {currentTime?.toLocaleTimeString('en-GB', { hour12: false })}
            </div>
            <div className="text-sm opacity-90">
              {currentTime?.toLocaleDateString('en-GB')}
            </div>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('arrivals')}
          className={`flex-1 py-3 px-4 font-medium text-sm operational-hover ${
            activeTab === 'arrivals' ?'bg-primary/10 text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="ArrowDown" size={16} />
            <span>Arrivals ({arrivals?.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('departures')}
          className={`flex-1 py-3 px-4 font-medium text-sm operational-hover ${
            activeTab === 'departures' ?'bg-primary/10 text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="ArrowUp" size={16} />
            <span>Departures ({departures?.length})</span>
          </div>
        </button>
      </div>
      {/* Column Headers */}
      <div className="grid grid-cols-12 gap-4 py-2 px-4 bg-muted/50 text-sm font-medium text-muted-foreground">
        <div className="col-span-2">Time</div>
        <div className="col-span-2">Train</div>
        <div className="col-span-3">
          {activeTab === 'arrivals' ? 'From' : 'To'}
        </div>
        <div className="col-span-1 text-center">Plat</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Details</div>
      </div>
      {/* Board Content */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'arrivals' ? (
          arrivals?.length > 0 ? (
            arrivals?.map((train) => (
              <BoardRow key={train?.id} train={train} type="arrivals" />
            ))
          ) : (
            <div className="text-center py-12">
              <Icon name="Train" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No arrivals scheduled</p>
            </div>
          )
        ) : (
          departures?.length > 0 ? (
            departures?.map((train) => (
              <BoardRow key={train?.id} train={train} type="departures" />
            ))
          ) : (
            <div className="text-center py-12">
              <Icon name="Train" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No departures scheduled</p>
            </div>
          )
        )}
      </div>
      {/* Footer */}
      <div className="bg-muted/50 p-3 text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>On Time</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-error rounded-full"></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span>Boarding</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Early</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrivalDepartureBoard;