import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsStrip = ({ metrics, comparisonMode }) => {
  const metricCards = [
    {
      id: 'punctuality',
      title: 'Punctuality Rate',
      value: metrics?.punctuality,
      unit: '%',
      icon: 'Clock',
      trend: metrics?.punctualityTrend,
      color: metrics?.punctuality >= 90 ? 'success' : metrics?.punctuality >= 75 ? 'warning' : 'error'
    },
    {
      id: 'avgDelay',
      title: 'Average Delay',
      value: metrics?.avgDelay,
      unit: 'min',
      icon: 'Timer',
      trend: metrics?.delayTrend,
      color: metrics?.avgDelay <= 5 ? 'success' : metrics?.avgDelay <= 15 ? 'warning' : 'error'
    },
    {
      id: 'distance',
      title: 'Distance Covered',
      value: metrics?.distance,
      unit: 'km',
      icon: 'Route',
      trend: metrics?.distanceTrend,
      color: 'primary'
    },
    {
      id: 'utilization',
      title: 'Utilization Rate',
      value: metrics?.utilization,
      unit: '%',
      icon: 'Activity',
      trend: metrics?.utilizationTrend,
      color: metrics?.utilization >= 80 ? 'success' : metrics?.utilization >= 60 ? 'warning' : 'error'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      success: 'text-success bg-success/10 border-success/20',
      warning: 'text-warning bg-warning/10 border-warning/20',
      error: 'text-error bg-error/10 border-error/20',
      primary: 'text-primary bg-primary/10 border-primary/20'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend, metricId) => {
    // For delay metrics, negative trend is good (less delay)
    if (metricId === 'avgDelay') {
      return trend < 0 ? 'text-success' : trend > 0 ? 'text-error' : 'text-muted-foreground';
    }
    // For other metrics, positive trend is good
    return trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-muted-foreground';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards?.map((metric) => (
        <div
          key={metric?.id}
          className={`
            bg-card rounded-lg border p-6 operational-shadow-card operational-hover
            ${getColorClasses(metric?.color)}
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              ${metric?.color === 'success' ? 'bg-success' : 
                metric?.color === 'warning' ? 'bg-warning' : 
                metric?.color === 'error' ? 'bg-error' : 'bg-primary'}
            `}>
              <Icon 
                name={metric?.icon} 
                size={24} 
                color="white"
              />
            </div>
            
            {comparisonMode && (
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getTrendIcon(metric?.trend)} 
                  size={16} 
                  className={getTrendColor(metric?.trend, metric?.id)}
                />
                <span className={`text-xs font-medium ${getTrendColor(metric?.trend, metric?.id)}`}>
                  {Math.abs(metric?.trend)?.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {metric?.title}
            </h3>
            
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-foreground">
                {metric?.value?.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground">
                {metric?.unit}
              </span>
            </div>

            {comparisonMode && (
              <div className="flex items-center space-x-2 pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">vs previous period:</span>
                <span className={`text-xs font-medium ${getTrendColor(metric?.trend, metric?.id)}`}>
                  {metric?.trend > 0 ? '+' : ''}{metric?.trend?.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Sparkline placeholder */}
          <div className="mt-4 h-8 bg-muted/50 rounded flex items-end justify-between px-1">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={`w-1 rounded-t ${
                  metric?.color === 'success' ? 'bg-success/60' : 
                  metric?.color === 'warning' ? 'bg-warning/60' : 
                  metric?.color === 'error' ? 'bg-error/60' : 'bg-primary/60'
                }`}
                style={{ 
                  height: `${Math.random() * 100}%`,
                  minHeight: '2px'
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsStrip;