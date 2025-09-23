import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, unit, status, icon, trend, trendValue }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'good':
        return {
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          iconColor: 'text-success',
          borderColor: 'border-success/20'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          iconColor: 'text-warning',
          borderColor: 'border-warning/20'
        };
      case 'critical':
        return {
          bgColor: 'bg-error/10',
          textColor: 'text-error',
          iconColor: 'text-error',
          borderColor: 'border-error/20'
        };
      default:
        return {
          bgColor: 'bg-muted/50',
          textColor: 'text-muted-foreground',
          iconColor: 'text-muted-foreground',
          borderColor: 'border-muted'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`bg-card border ${config?.borderColor} rounded-lg p-6 operational-shadow-card`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${config?.bgColor}`}>
          <Icon name={icon} size={24} className={config?.iconColor} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
              size={16} 
              className={trend === 'up' ? 'text-success' : 'text-error'}
            />
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default KPICard;