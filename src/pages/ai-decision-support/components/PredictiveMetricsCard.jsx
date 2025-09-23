import React from 'react';
import Icon from '../../../components/AppIcon';

const PredictiveMetricsCard = ({ 
  title, 
  value, 
  unit, 
  confidence, 
  trend, 
  icon, 
  color = "primary",
  description 
}) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-success/10',
          text: 'text-success',
          icon: 'text-success'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          text: 'text-warning',
          icon: 'text-warning'
        };
      case 'error':
        return {
          bg: 'bg-error/10',
          text: 'text-error',
          icon: 'text-error'
        };
      default:
        return {
          bg: 'bg-primary/10',
          text: 'text-primary',
          icon: 'text-primary'
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="bg-card border border-border rounded-lg p-6 operational-shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses?.bg}`}>
          <Icon name={icon} size={24} className={colorClasses?.icon} />
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground">Confidence</span>
            <span className={`text-xs font-medium ${colorClasses?.text}`}>
              {confidence}%
            </span>
          </div>
          {trend && (
            <div className="flex items-center space-x-1 mt-1">
              <Icon 
                name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
                size={12} 
                className={trend > 0 ? "text-success" : "text-error"}
              />
              <span className={`text-xs ${trend > 0 ? "text-success" : "text-error"}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {/* Confidence Bar */}
      <div className="mt-4">
        <div className="w-full bg-muted rounded-full h-1">
          <div 
            className={`h-1 rounded-full ${colorClasses?.text?.replace('text-', 'bg-')}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictiveMetricsCard;


