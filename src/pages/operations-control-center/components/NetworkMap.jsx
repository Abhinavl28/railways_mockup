import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NetworkMap = () => {
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [mapView, setMapView] = useState('network'); // 'network' or 'trains'
  const [realTimeData, setRealTimeData] = useState({});
  
  // Enhanced mock data for real-time train simulation
  const [trains, setTrains] = useState([
    {
      id: 'T001',
      number: 'EXP-2401',
      type: 'Express',
      route: 'Delhi → Mumbai',
      currentLocation: { x: 250, y: 180, station: 'Junction North' },
      destination: 'Mumbai Central',
      status: 'running',
      speed: 85,
      delay: 0,
      nextStation: 'Central Junction',
      eta: '15:45',
      progress: 0.65
    },
    {
      id: 'T002',
      number: 'LOC-1205', 
      type: 'Local',
      route: 'Suburban Line A',
      currentLocation: { x: 420, y: 220, station: 'Central Station' },
      destination: 'Terminal East',
      status: 'stopped',
      speed: 0,
      delay: 5,
      nextStation: 'Terminal East',
      eta: '16:20',
      progress: 0.85
    },
    {
      id: 'T003',
      number: 'FRT-8901',
      type: 'Freight',
      route: 'Industrial → Port',
      currentLocation: { x: 180, y: 280, station: 'Yard Complex' },
      destination: 'Port Junction',
      status: 'running',
      speed: 45,
      delay: 0,
      nextStation: 'Industrial Hub',
      eta: '18:30',
      progress: 0.25
    }
  ]);

  // Real-time simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains(prevTrains => 
        prevTrains?.map(train => {
          if (train?.status === 'running') {
            // Simulate realistic train movement
            const speedVariation = Math.random() * 0.1 - 0.05; // ±5% speed variation
            const newSpeed = Math.max(0, train?.speed + speedVariation);
            
            // Update position based on speed
            const progressIncrement = (newSpeed / 1000) * Math.random() * 2;
            let newProgress = Math.min(1, train?.progress + progressIncrement);
            
            // Simulate occasional delays
            let newDelay = train?.delay;
            if (Math.random() > 0.98) {
              newDelay += Math.random() > 0.6 ? 1 : 0;
            }
            
            return {
              ...train,
              speed: Math.round(newSpeed),
              progress: newProgress,
              delay: newDelay
            };
          }
          return train;
        })
      );
      
      // Update real-time metrics
      setRealTimeData({
        timestamp: new Date()?.toLocaleTimeString(),
        totalTrains: trains?.length,
        activeTrains: trains?.filter(t => t?.status === 'running')?.length,
        avgSpeed: Math.round(trains?.reduce((sum, t) => sum + t?.speed, 0) / trains?.length),
        totalDelays: trains?.reduce((sum, t) => sum + t?.delay, 0)
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [trains?.length]);

  const getTrainStatusColor = (train) => {
    if (train?.delay > 10) return '#ef4444'; // Red for major delays
    if (train?.delay > 0) return '#f59e0b';   // Orange for minor delays
    if (train?.status === 'stopped') return '#6b7280'; // Gray for stopped
    return '#10b981'; // Green for on-time
  };

  const handleTrainClick = (train) => {
    setSelectedTrain(selectedTrain?.id === train?.id ? null : train);
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header with Real-time Controls */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Real-Time Railway Network
          </h3>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Live Update</span>
            </div>
            
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setMapView('network')}
                className={`px-3 py-1 text-xs ${
                  mapView === 'network' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Network
              </button>
              <button
                onClick={() => setMapView('trains')}
                className={`px-3 py-1 text-xs border-l border-border ${
                  mapView === 'trains' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Trains
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Metrics Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{trains?.length}</div>
            <div className="text-xs text-muted-foreground">Total Trains</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {trains?.filter(t => t?.status === 'running')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {realTimeData?.avgSpeed || 0} km/h
            </div>
            <div className="text-xs text-muted-foreground">Avg Speed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {trains?.reduce((sum, t) => sum + t?.delay, 0)} min
            </div>
            <div className="text-xs text-muted-foreground">Total Delays</div>
          </div>
        </div>
      </div>
      {/* Interactive Map */}
      <div className="p-6">
        <div className="bg-gray-900 rounded-lg p-4 relative overflow-hidden">
          <svg width="600" height="400" className="w-full">
            {/* Background Grid */}
            <defs>
              <pattern id="networkGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#networkGrid)" />

            {/* Railway Lines */}
            <g className="railway-lines">
              {/* Main Lines */}
              <line x1="50" y1="200" x2="550" y2="200" stroke="#64748b" strokeWidth="4" />
              <line x1="50" y1="240" x2="550" y2="240" stroke="#64748b" strokeWidth="4" />
              <line x1="200" y1="120" x2="400" y2="320" stroke="#64748b" strokeWidth="3" />
              
              {/* Junction Connections */}
              <line x1="250" y1="200" x2="250" y2="160" stroke="#64748b" strokeWidth="2" />
              <line x1="400" y1="240" x2="450" y2="280" stroke="#64748b" strokeWidth="2" />
            </g>

            {/* Stations */}
            <g className="stations">
              <circle cx="100" cy="220" r="8" fill="#3b82f6" />
              <text x="100" y="250" fill="white" fontSize="10" textAnchor="middle">Central</text>
              
              <circle cx="250" cy="200" r="6" fill="#f59e0b" />
              <text x="250" y="190" fill="white" fontSize="9" textAnchor="middle">Junction N</text>
              
              <circle cx="400" cy="240" r="6" fill="#f59e0b" />
              <text x="400" y="260" fill="white" fontSize="9" textAnchor="middle">Junction C</text>
              
              <circle cx="500" cy="220" r="8" fill="#3b82f6" />
              <text x="500" y="250" fill="white" fontSize="10" textAnchor="middle">Terminal</text>
            </g>

            {/* Dynamic Train Positions */}
            <g className="trains">
              {trains?.map(train => (
                <g key={train?.id}>
                  <circle
                    cx={train?.currentLocation?.x}
                    cy={train?.currentLocation?.y}
                    r="6"
                    fill={getTrainStatusColor(train)}
                    className="cursor-pointer transition-all duration-500 hover:r-8"
                    onClick={() => handleTrainClick(train)}
                  />
                  
                  {/* Speed Indicator */}
                  {train?.status === 'running' && (
                    <circle
                      cx={train?.currentLocation?.x}
                      cy={train?.currentLocation?.y}
                      r="10"
                      fill="none"
                      stroke={getTrainStatusColor(train)}
                      strokeWidth="1"
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}
                  
                  {/* Train Number Label */}
                  <text
                    x={train?.currentLocation?.x}
                    y={train?.currentLocation?.y - 12}
                    fill="white"
                    fontSize="8"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {train?.number}
                  </text>
                  
                  {/* Delay Indicator */}
                  {train?.delay > 0 && (
                    <text
                      x={train?.currentLocation?.x + 15}
                      y={train?.currentLocation?.y}
                      fill="#ef4444"
                      fontSize="7"
                      textAnchor="middle"
                    >
                      +{train?.delay}m
                    </text>
                  )}
                </g>
              ))}
            </g>

            {/* Signal Status Indicators */}
            <g className="signals">
              <circle cx="200" cy="200" r="3" fill="#10b981" />
              <circle cx="300" cy="200" r="3" fill="#10b981" />
              <circle cx="350" cy="240" r="3" fill="#f59e0b" />
              <circle cx="450" cy="240" r="3" fill="#ef4444" />
            </g>
          </svg>

          {/* Real-time Status Overlay */}
          <div className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded text-xs">
            <div>Last Update: {realTimeData?.timestamp}</div>
            <div>Network Status: Operational</div>
          </div>
        </div>

        {/* Train Detail Panel */}
        {selectedTrain && (
          <div className="mt-4 bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">
                {selectedTrain?.number} - {selectedTrain?.type}
              </h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedTrain(null)}
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Route</div>
                <div className="font-medium text-foreground">{selectedTrain?.route}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className={`font-medium capitalize ${
                  selectedTrain?.status === 'running' ? 'text-green-600' : 
                  selectedTrain?.status === 'stopped' ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  {selectedTrain?.status}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Speed</div>
                <div className="font-medium text-foreground">{selectedTrain?.speed} km/h</div>
              </div>
              <div>
                <div className="text-muted-foreground">ETA</div>
                <div className="font-medium text-foreground">
                  {selectedTrain?.eta}
                  {selectedTrain?.delay > 0 && (
                    <span className="text-red-500 ml-1">(+{selectedTrain?.delay}m)</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{Math.round(selectedTrain?.progress * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all duration-500"
                  style={{ width: `${selectedTrain?.progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">On-time</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Minor Delay</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Major Delay</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Stopped</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMap;