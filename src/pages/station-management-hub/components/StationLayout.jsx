import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const StationLayout = ({ platforms, trains, onPlatformClick, onTrainClick }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [draggedTrain, setDraggedTrain] = useState(null);

  const getPlatformStatus = (platform) => {
    if (platform?.maintenance) return 'maintenance';
    if (platform?.occupied) return 'occupied';
    if (platform?.reserved) return 'reserved';
    return 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied': return 'bg-error';
      case 'reserved': return 'bg-warning';
      case 'maintenance': return 'bg-muted';
      default: return 'bg-success';
    }
  };

  const getPassengerDensityColor = (density) => {
    if (density > 80) return 'bg-error/20';
    if (density > 60) return 'bg-warning/20';
    if (density > 40) return 'bg-primary/20';
    return 'bg-success/20';
  };

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform?.id);
    onPlatformClick(platform);
  };

  const handleDragStart = (train) => {
    setDraggedTrain(train);
  };

  const handleDrop = (platform) => {
    if (draggedTrain && !platform?.occupied && !platform?.maintenance) {
      // Handle platform reassignment logic here
      console.log(`Reassigning train ${draggedTrain?.id} to platform ${platform?.id}`);
    }
    setDraggedTrain(null);
  };

  return (
    <div className="bg-card rounded-lg p-6 operational-shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Station Layout</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span className="text-muted-foreground">Reserved</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-error rounded"></div>
            <span className="text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-muted rounded"></div>
            <span className="text-muted-foreground">Maintenance</span>
          </div>
        </div>
      </div>
      <div className="relative">
        {/* Station Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Side A */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Platform Side A</h3>
            {platforms?.filter(p => p?.side === 'A')?.map((platform) => {
              const status = getPlatformStatus(platform);
              const assignedTrain = trains?.find(t => t?.platformId === platform?.id);
              
              return (
                <div
                  key={platform?.id}
                  className={`
                    relative border-2 rounded-lg p-4 cursor-pointer operational-hover
                    ${selectedPlatform === platform?.id ? 'border-primary' : 'border-border'}
                    ${getPassengerDensityColor(platform?.passengerDensity)}
                  `}
                  onClick={() => handlePlatformClick(platform)}
                  onDrop={() => handleDrop(platform)}
                  onDragOver={(e) => e?.preventDefault()}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${getStatusColor(status)}`}></div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          Platform {platform?.number}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Track {platform?.track} • {platform?.length}m
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {platform?.passengerDensity}%
                      </div>
                      <div className="text-xs text-muted-foreground">Density</div>
                    </div>
                  </div>
                  {assignedTrain && (
                    <div
                      className="bg-primary/10 border border-primary/20 rounded p-3 cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(assignedTrain)}
                      onClick={(e) => {
                        e?.stopPropagation();
                        onTrainClick(assignedTrain);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon name="Train" size={16} className="text-primary" />
                          <div>
                            <div className="font-medium text-sm text-foreground">
                              {assignedTrain?.number}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {assignedTrain?.destination}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {assignedTrain?.arrivalTime}
                          </div>
                          <div className={`text-xs font-medium ${
                            assignedTrain?.status === 'delayed' ? 'text-error' :
                            assignedTrain?.status === 'ontime' ? 'text-success' : 'text-warning'
                          }`}>
                            {assignedTrain?.status === 'delayed' ? `+${assignedTrain?.delay}min` : 
                             assignedTrain?.status === 'ontime' ? 'On Time' : 'Early'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {platform?.maintenance && (
                    <div className="mt-2 flex items-center space-x-2 text-xs text-warning">
                      <Icon name="Wrench" size={12} />
                      <span>Maintenance: {platform?.maintenanceReason}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Platform Side B */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Platform Side B</h3>
            {platforms?.filter(p => p?.side === 'B')?.map((platform) => {
              const status = getPlatformStatus(platform);
              const assignedTrain = trains?.find(t => t?.platformId === platform?.id);
              
              return (
                <div
                  key={platform?.id}
                  className={`
                    relative border-2 rounded-lg p-4 cursor-pointer operational-hover
                    ${selectedPlatform === platform?.id ? 'border-primary' : 'border-border'}
                    ${getPassengerDensityColor(platform?.passengerDensity)}
                  `}
                  onClick={() => handlePlatformClick(platform)}
                  onDrop={() => handleDrop(platform)}
                  onDragOver={(e) => e?.preventDefault()}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${getStatusColor(status)}`}></div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          Platform {platform?.number}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Track {platform?.track} • {platform?.length}m
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {platform?.passengerDensity}%
                      </div>
                      <div className="text-xs text-muted-foreground">Density</div>
                    </div>
                  </div>
                  {assignedTrain && (
                    <div
                      className="bg-primary/10 border border-primary/20 rounded p-3 cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(assignedTrain)}
                      onClick={(e) => {
                        e?.stopPropagation();
                        onTrainClick(assignedTrain);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon name="Train" size={16} className="text-primary" />
                          <div>
                            <div className="font-medium text-sm text-foreground">
                              {assignedTrain?.number}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {assignedTrain?.destination}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            {assignedTrain?.arrivalTime}
                          </div>
                          <div className={`text-xs font-medium ${
                            assignedTrain?.status === 'delayed' ? 'text-error' :
                            assignedTrain?.status === 'ontime' ? 'text-success' : 'text-warning'
                          }`}>
                            {assignedTrain?.status === 'delayed' ? `+${assignedTrain?.delay}min` : 
                             assignedTrain?.status === 'ontime' ? 'On Time' : 'Early'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {platform?.maintenance && (
                    <div className="mt-2 flex items-center space-x-2 text-xs text-warning">
                      <Icon name="Wrench" size={12} />
                      <span>Maintenance: {platform?.maintenanceReason}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationLayout;