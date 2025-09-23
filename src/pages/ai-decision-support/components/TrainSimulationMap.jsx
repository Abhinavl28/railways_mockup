import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrainSimulationMap = ({ scenarioData, onSimulationComplete }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [trains, setTrains] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [simulationResults, setSimulationResults] = useState(null);
  const intervalRef = useRef(null);

  // Mock track network data
  const trackNetwork = [
    { id: 'track-1', name: 'Main Line A', start: { x: 50, y: 200 }, end: { x: 750, y: 200 }, status: 'active' },
    { id: 'track-2', name: 'Main Line B', start: { x: 50, y: 250 }, end: { x: 750, y: 250 }, status: 'active' },
    { id: 'track-3', name: 'Branch Line C', start: { x: 300, y: 200 }, end: { x: 400, y: 100 }, status: 'maintenance' },
    { id: 'track-4', name: 'Yard Track D', start: { x: 600, y: 200 }, end: { x: 700, y: 300 }, status: 'active' },
    { id: 'junction-1', name: 'Junction North', x: 300, y: 200, type: 'junction' },
    { id: 'junction-2', name: 'Junction Central', x: 600, y: 200, type: 'junction' },
    { id: 'station-1', name: 'Central Station', x: 150, y: 225, type: 'station' },
    { id: 'station-2', name: 'North Station', x: 450, y: 225, type: 'station' },
    { id: 'station-3', name: 'Terminal Station', x: 650, y: 225, type: 'station' }
  ];

  // Mock train data with realistic movements
  const mockTrains = [
    {
      id: 'train-1',
      number: 'EXP-2401',
      type: 'Express',
      route: 'Central → North',
      currentTrack: 'track-1',
      position: 0.2,
      speed: 80,
      status: 'running',
      delay: 0,
      destination: 'North Station',
      eta: '15:45'
    },
    {
      id: 'train-2',
      number: 'LOC-1205',
      type: 'Local',
      route: 'North → Terminal',
      currentTrack: 'track-2',
      position: 0.6,
      speed: 60,
      status: 'running',
      delay: 5,
      destination: 'Terminal Station',
      eta: '16:20'
    },
    {
      id: 'train-3',
      number: 'FRT-8901',
      type: 'Freight',
      route: 'Yard → Central',
      currentTrack: 'track-4',
      position: 0.1,
      speed: 40,
      status: 'stopped',
      delay: 0,
      destination: 'Central Station',
      eta: '17:30'
    }
  ];

  useEffect(() => {
    setTracks(trackNetwork);
    setTrains(mockTrains);
  }, []);

  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => new Date(prev.getTime() + (60000 * simulationSpeed))); // Advance by minutes
        
        setTrains(prevTrains => 
          prevTrains?.map(train => {
            if (train?.status === 'running') {
              let newPosition = train?.position + (0.01 * simulationSpeed);
              let newStatus = train?.status;
              let newDelay = train?.delay;
              
              // Simulate realistic train movements and delays
              if (Math.random() > 0.98) {
                // Random delay simulation
                newDelay += Math.random() > 0.5 ? 1 : -1;
                newDelay = Math.max(0, newDelay);
              }
              
              // Handle track completion
              if (newPosition >= 1) {
                newPosition = 0;
                newStatus = 'arriving';
              }
              
              // Reset to start for continuous simulation
              if (newPosition >= 1.2) {
                newPosition = 0;
                newStatus = 'running';
              }
              
              return {
                ...train,
                position: newPosition,
                status: newStatus,
                delay: newDelay
              };
            }
            return train;
          })
        );
      }, 500 / simulationSpeed);
    } else {
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
      }
    };
  }, [isSimulating, simulationSpeed]);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationResults(null);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    
    // Generate simulation results
    const results = {
      duration: Math.floor(Math.random() * 30) + 10,
      trainsProcessed: trains?.length,
      avgDelay: Math.floor(Math.random() * 10) + 2,
      efficiency: Math.floor(Math.random() * 20) + 80,
      conflicts: Math.floor(Math.random() * 3),
      recommendations: [
        'Adjust EXP-2401 departure by 3 minutes to optimize track utilization',
        'Route FRT-8901 via alternative track during peak hours',
        'Implement dynamic speed control at Junction North'
      ]
    };
    
    setSimulationResults(results);
    onSimulationComplete?.(results);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentTime(new Date());
    setTrains(mockTrains);
    setSimulationResults(null);
  };

  const getTrainPosition = (train) => {
    const track = tracks?.find(t => t?.id === train?.currentTrack);
    if (track && track?.start && track?.end) {
      const x = track?.start?.x + (track?.end?.x - track?.start?.x) * train?.position;
      const y = track?.start?.y + (track?.end?.y - track?.start?.y) * train?.position;
      return { x, y };
    }
    return { x: 0, y: 0 };
  };

  const getTrainColor = (train) => {
    switch (train?.type) {
      case 'Express': return train?.delay > 0 ? '#ef4444' : '#10b981';
      case 'Local': return train?.delay > 0 ? '#f59e0b' : '#3b82f6';
      case 'Freight': return train?.delay > 0 ? '#dc2626' : '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-primary border-l-4 border-primary pl-4">
            Real-Time Train Simulation Map
          </h3>
          <p className="text-muted-foreground ml-6 mt-1">
            Fast-forward visualization of train movements and scenario impacts
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <select
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(Number(e?.target?.value))}
              className="px-3 py-1 border border-border rounded bg-background text-foreground text-sm"
              disabled={isSimulating}
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
              <option value={8}>8x</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isSimulating ? (
              <Button onClick={startSimulation} size="sm">
                <Icon name="Play" size={16} />
                Start
              </Button>
            ) : (
              <Button onClick={stopSimulation} variant="destructive" size="sm">
                <Icon name="Pause" size={16} />
                Stop
              </Button>
            )}
            <Button onClick={resetSimulation} variant="outline" size="sm">
              <Icon name="RotateCcw" size={16} />
              Reset
            </Button>
          </div>
        </div>
      </div>
      {/* Simulation Info Bar */}
      <div className="bg-muted/30 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <div>
              <div className="font-medium text-foreground">Simulation Time</div>
              <div className="text-muted-foreground">{currentTime?.toLocaleTimeString()}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Train" size={16} className="text-primary" />
            <div>
              <div className="font-medium text-foreground">Active Trains</div>
              <div className="text-muted-foreground">{trains?.filter(t => t?.status === 'running')?.length} / {trains?.length}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={16} className="text-primary" />
            <div>
              <div className="font-medium text-foreground">Avg Delay</div>
              <div className="text-muted-foreground">
                {(trains?.reduce((sum, t) => sum + t?.delay, 0) / trains?.length)?.toFixed(1)} min
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <div>
              <div className="font-medium text-foreground">Status</div>
              <div className="text-muted-foreground">{isSimulating ? 'Running' : 'Stopped'}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Track Network Visualization */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <svg width="800" height="400" className="w-full">
          {/* Grid Background */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Tracks */}
          {tracks?.map(track => {
            if (track?.start && track?.end) {
              return (
                <g key={track?.id}>
                  <line
                    x1={track?.start?.x}
                    y1={track?.start?.y}
                    x2={track?.end?.x}
                    y2={track?.end?.y}
                    stroke={track?.status === 'maintenance' ? '#dc2626' : '#64748b'}
                    strokeWidth="4"
                    opacity={track?.status === 'maintenance' ? 0.5 : 1}
                  />
                  <text
                    x={(track?.start?.x + track?.end?.x) / 2}
                    y={(track?.start?.y + track?.end?.y) / 2 - 10}
                    fill="white"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {track?.name}
                  </text>
                </g>
              );
            }
            return null;
          })}

          {/* Stations and Junctions */}
          {tracks?.map(point => {
            if (point?.type === 'station' || point?.type === 'junction') {
              return (
                <g key={point?.id}>
                  <circle
                    cx={point?.x}
                    cy={point?.y}
                    r={point?.type === 'station' ? 8 : 6}
                    fill={point?.type === 'station' ? '#3b82f6' : '#f59e0b'}
                  />
                  <text
                    x={point?.x}
                    y={point?.y - 15}
                    fill="white"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {point?.name}
                  </text>
                </g>
              );
            }
            return null;
          })}

          {/* Trains */}
          {trains?.map(train => {
            const position = getTrainPosition(train);
            return (
              <g key={train?.id}>
                <circle
                  cx={position?.x}
                  cy={position?.y}
                  r="6"
                  fill={getTrainColor(train)}
                  className={isSimulating ? 'transition-all duration-500' : ''}
                />
                <text
                  x={position?.x}
                  y={position?.y + 20}
                  fill="white"
                  fontSize="8"
                  textAnchor="middle"
                >
                  {train?.number}
                </text>
                {train?.delay > 0 && (
                  <text
                    x={position?.x}
                    y={position?.y + 30}
                    fill="#ef4444"
                    fontSize="7"
                    textAnchor="middle"
                  >
                    +{train?.delay}min
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Track Status</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-slate-500"></div>
              <span className="text-sm text-muted-foreground">Active Track</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-red-600 opacity-50"></div>
              <span className="text-sm text-muted-foreground">Maintenance</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-foreground mb-2">Train Types</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Express (On-time)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Local (On-time)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Delayed Train</span>
            </div>
          </div>
        </div>
      </div>
      {/* Simulation Results */}
      {simulationResults && (
        <div className="bg-muted/30 p-4 rounded-lg">
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            <Icon name="BarChart3" size={16} className="mr-2" />
            Simulation Results
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{simulationResults?.duration}m</div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{simulationResults?.trainsProcessed}</div>
              <div className="text-sm text-muted-foreground">Trains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{simulationResults?.avgDelay}m</div>
              <div className="text-sm text-muted-foreground">Avg Delay</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{simulationResults?.efficiency}%</div>
              <div className="text-sm text-muted-foreground">Efficiency</div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-foreground mb-2">AI Recommendations:</h5>
            <ul className="space-y-1">
              {simulationResults?.recommendations?.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <Icon name="ArrowRight" size={12} className="mr-2 mt-1 text-primary" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainSimulationMap;