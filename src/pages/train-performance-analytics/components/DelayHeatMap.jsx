import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DelayHeatMap = ({ selectedTrain, dateRange }) => {
  const [viewMode, setViewMode] = useState('time');
  const [hoveredCell, setHoveredCell] = useState(null);

  const timeSlots = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  const routeSegments = [
    'Mumbai-Borivali',
    'Borivali-Vapi',
    'Vapi-Surat',
    'Surat-Vadodara',
    'Vadodara-Ahmedabad',
    'Ahmedabad-Jodhpur'
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const generateHeatMapData = () => {
    const data = [];
    const yAxis = viewMode === 'time' ? routeSegments : weekDays;
    const xAxis = viewMode === 'time' ? timeSlots : routeSegments;

    yAxis?.forEach((yItem, yIndex) => {
      xAxis?.forEach((xItem, xIndex) => {
        const delayValue = Math.floor(Math.random() * 30); // 0-30 minutes delay
        data?.push({
          x: xIndex,
          y: yIndex,
          xLabel: xItem,
          yLabel: yItem,
          value: delayValue,
          intensity: delayValue / 30 // 0-1 scale for color intensity
        });
      });
    });

    return { data, xAxis, yAxis };
  };

  const { data: heatMapData, xAxis, yAxis } = generateHeatMapData();

  const getHeatMapColor = (intensity) => {
    if (intensity === 0) return 'bg-success/20';
    if (intensity <= 0.2) return 'bg-success/40';
    if (intensity <= 0.4) return 'bg-warning/40';
    if (intensity <= 0.6) return 'bg-warning/60';
    if (intensity <= 0.8) return 'bg-error/60';
    return 'bg-error/80';
  };

  const viewModeOptions = [
    { value: 'time', label: 'Time vs Route' },
    { value: 'day', label: 'Day vs Route' }
  ];

  const handleCellHover = (cellData) => {
    setHoveredCell(cellData);
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 operational-shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Grid3X3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Delay Hotspots Heat Map
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            options={viewModeOptions}
            value={viewMode}
            onChange={setViewMode}
            className="w-40"
          />
          
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
      {!selectedTrain ? (
        <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
          <div className="text-center">
            <Icon name="Grid3X3" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select a train to view delay hotspots</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                Heat Map: {selectedTrain} - {viewMode === 'time' ? 'Time vs Route Segments' : 'Days vs Route Segments'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success/40 rounded"></div>
                <span className="text-muted-foreground">Low Delay</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning/60 rounded"></div>
                <span className="text-muted-foreground">Medium Delay</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error/80 rounded"></div>
                <span className="text-muted-foreground">High Delay</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Heat Map Grid */}
              <div className="grid gap-1 p-4" style={{ 
                gridTemplateColumns: `120px repeat(${xAxis?.length}, 1fr)`,
                gridTemplateRows: `40px repeat(${yAxis?.length}, 1fr)`
              }}>
                {/* Empty top-left corner */}
                <div></div>
                
                {/* X-axis labels */}
                {xAxis?.map((label, index) => (
                  <div 
                    key={`x-${index}`}
                    className="text-xs font-medium text-muted-foreground text-center p-2"
                  >
                    {label}
                  </div>
                ))}

                {/* Y-axis labels and heat map cells */}
                {yAxis?.map((yLabel, yIndex) => (
                  <React.Fragment key={`y-${yIndex}`}>
                    <div className="text-xs font-medium text-muted-foreground flex items-center p-2">
                      {yLabel}
                    </div>
                    
                    {xAxis?.map((xLabel, xIndex) => {
                      const cellData = heatMapData?.find(
                        item => item?.x === xIndex && item?.y === yIndex
                      );
                      
                      return (
                        <div
                          key={`cell-${yIndex}-${xIndex}`}
                          className={`
                            h-12 rounded cursor-pointer operational-hover border border-border/50
                            ${getHeatMapColor(cellData?.intensity)}
                            hover:border-primary hover:scale-105 transition-all duration-200
                          `}
                          onMouseEnter={() => handleCellHover(cellData)}
                          onMouseLeave={handleCellLeave}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs font-medium text-foreground">
                              {cellData?.value}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredCell && (
            <div className="fixed z-50 bg-card border border-border rounded-lg p-3 operational-shadow-modal pointer-events-none">
              <div className="text-sm font-medium text-foreground mb-1">
                {hoveredCell?.yLabel} → {hoveredCell?.xLabel}
              </div>
              <div className="text-xs text-muted-foreground">
                Average Delay: {hoveredCell?.value} minutes
              </div>
              <div className="text-xs text-muted-foreground">
                Severity: {hoveredCell?.value <= 5 ? 'Low' : hoveredCell?.value <= 15 ? 'Medium' : 'High'}
              </div>
            </div>
          )}

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-xl font-bold text-error">
                {Math.max(...heatMapData?.map(item => item?.value))} min
              </div>
              <div className="text-sm text-muted-foreground">Peak Delay</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-warning">
                {Math.round(heatMapData?.reduce((sum, item) => sum + item?.value, 0) / heatMapData?.length)} min
              </div>
              <div className="text-sm text-muted-foreground">Average Delay</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-success">
                {heatMapData?.filter(item => item?.value <= 5)?.length}
              </div>
              <div className="text-sm text-muted-foreground">Low Delay Zones</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-error">
                {heatMapData?.filter(item => item?.value > 15)?.length}
              </div>
              <div className="text-sm text-muted-foreground">High Delay Zones</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DelayHeatMap;