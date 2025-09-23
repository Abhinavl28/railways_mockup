import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScheduleGanttChart = ({ scheduleData, onAcceptRecommendation }) => {
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [viewMode, setViewMode] = useState('comparison'); // comparison, original, optimized

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i?.toString()?.padStart(2, '0');
    return `${hour}:00`;
  });

  const getTrainColor = (status) => {
    switch (status) {
      case 'on-time': return 'bg-success';
      case 'delayed': return 'bg-warning';
      case 'critical': return 'bg-error';
      case 'optimized': return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  const getTrainPosition = (startTime, duration) => {
    const startHour = parseInt(startTime?.split(':')?.[0]);
    const startMinute = parseInt(startTime?.split(':')?.[1]);
    const left = ((startHour + startMinute / 60) / 24) * 100;
    const width = (duration / (24 * 60)) * 100;
    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 operational-shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Schedule Optimization</h3>
          <p className="text-sm text-muted-foreground">
            AI-optimized vs current schedule comparison
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
            {[
              { key: 'comparison', label: 'Compare', icon: 'GitCompare' },
              { key: 'original', label: 'Original', icon: 'Clock' },
              { key: 'optimized', label: 'Optimized', icon: 'Zap' }
            ]?.map((mode) => (
              <button
                key={mode?.key}
                onClick={() => setViewMode(mode?.key)}
                className={`
                  flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium
                  operational-hover transition-colors
                  ${viewMode === mode?.key 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name={mode?.icon} size={14} />
                <span>{mode?.label}</span>
              </button>
            ))}
          </div>
          
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} />
            Export
          </Button>
        </div>
      </div>
      {/* Time Header */}
      <div className="mb-4">
        <div className="flex border-b border-border pb-2">
          <div className="w-32 text-xs font-medium text-muted-foreground">Train</div>
          <div className="flex-1 relative">
            <div className="flex justify-between text-xs text-muted-foreground">
              {timeSlots?.filter((_, i) => i % 4 === 0)?.map((time) => (
                <span key={time}>{time}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Schedule Tracks */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {scheduleData?.map((train) => (
          <div key={train?.id} className="flex items-center">
            <div className="w-32 pr-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedTrain(selectedTrain === train?.id ? null : train?.id)}
                  className="text-sm font-medium text-foreground hover:text-primary operational-hover"
                >
                  {train?.trainNumber}
                </button>
                {train?.hasConflict && (
                  <Icon name="AlertTriangle" size={12} className="text-warning" />
                )}
              </div>
              <div className="text-xs text-muted-foreground">{train?.route}</div>
            </div>
            
            <div className="flex-1 relative h-8 bg-muted/30 rounded">
              {/* Original Schedule */}
              {(viewMode === 'comparison' || viewMode === 'original') && (
                <div
                  className={`absolute top-0 h-3 rounded ${getTrainColor(train?.originalStatus)} opacity-60`}
                  style={getTrainPosition(train?.originalStart, train?.duration)}
                  title={`Original: ${train?.originalStart} - ${train?.originalEnd}`}
                />
              )}
              
              {/* Optimized Schedule */}
              {(viewMode === 'comparison' || viewMode === 'optimized') && (
                <div
                  className={`absolute ${viewMode === 'comparison' ? 'top-4' : 'top-0'} h-3 rounded ${getTrainColor('optimized')}`}
                  style={getTrainPosition(train?.optimizedStart, train?.duration)}
                  title={`Optimized: ${train?.optimizedStart} - ${train?.optimizedEnd}`}
                />
              )}
              
              {/* Conflict Zones */}
              {train?.conflicts?.map((conflict, index) => (
                <div
                  key={index}
                  className="absolute top-0 bottom-0 bg-error/20 border-l-2 border-error"
                  style={getTrainPosition(conflict?.start, conflict?.duration)}
                  title={`Conflict: ${conflict?.reason}`}
                />
              ))}
            </div>
            
            <div className="w-24 pl-4 text-right">
              <div className="text-xs text-muted-foreground">
                Saved: {train?.timeSaved}min
              </div>
              {train?.recommendation && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onAcceptRecommendation(train?.id)}
                  className="text-success hover:text-success"
                >
                  Accept
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Selected Train Details */}
      {selectedTrain && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
          {(() => {
            const train = scheduleData?.find(t => t?.id === selectedTrain);
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">
                    {train?.trainNumber} - {train?.route}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTrain(null)}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Original Schedule:</span>
                    <div className="font-medium">{train?.originalStart} - {train?.originalEnd}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Optimized Schedule:</span>
                    <div className="font-medium text-primary">{train?.optimizedStart} - {train?.optimizedEnd}</div>
                  </div>
                </div>
                {train?.recommendation && (
                  <div className="p-3 bg-primary/10 rounded border border-primary/20">
                    <div className="flex items-start space-x-2">
                      <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-primary">AI Recommendation</div>
                        <div className="text-sm text-foreground mt-1">{train?.recommendation}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded"></div>
          <span className="text-xs text-muted-foreground">On Time</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning rounded"></div>
          <span className="text-xs text-muted-foreground">Delayed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-xs text-muted-foreground">AI Optimized</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error/20 border border-error rounded"></div>
          <span className="text-xs text-muted-foreground">Conflict Zone</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGanttChart;