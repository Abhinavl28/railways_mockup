import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusMetrics = ({ metrics }) => {
  const getMetricColor = (value, thresholds) => {
    if (value >= thresholds?.critical) return 'text-error';
    if (value >= thresholds?.warning) return 'text-warning';
    return 'text-success';
  };

  const getGaugeColor = (value, thresholds) => {
    if (value >= thresholds?.critical) return 'bg-error';
    if (value >= thresholds?.warning) return 'bg-warning';
    return 'bg-success';
  };

  const metricConfigs = [
    {
      key: 'occupancy',
      title: 'Platform Occupancy',
      icon: 'Users',
      suffix: '%',
      thresholds: { warning: 70, critical: 90 }
    },
    {
      key: 'dwellTime',
      title: 'Avg Dwell Time',
      icon: 'Clock',
      suffix: 'min',
      thresholds: { warning: 5, critical: 8 }
    },
    {
      key: 'throughput',
      title: 'Passenger Throughput',
      icon: 'TrendingUp',
      suffix: '/hr',
      thresholds: { warning: 800, critical: 1000 }
    },
    {
      key: 'alerts',
      title: 'Maintenance Alerts',
      icon: 'AlertTriangle',
      suffix: '',
      thresholds: { warning: 3, critical: 5 }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricConfigs?.map((config) => {
        const value = metrics?.[config?.key];
        const percentage = config?.key === 'occupancy' ? value : 
                          config?.key === 'alerts' ? (value / 10) * 100 :
                          (value / (config?.thresholds?.critical * 1.2)) * 100;
        
        return (
          <div key={config?.key} className="bg-card rounded-lg p-6 operational-shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon 
                    name={config?.icon} 
                    size={20} 
                    className="text-primary"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-sm">
                    {config?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">Real-time</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-end space-x-2">
                <span className={`text-2xl font-bold ${getMetricColor(value, config?.thresholds)}`}>
                  {value?.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground mb-1">
                  {config?.suffix}
                </span>
              </div>

              {/* Gauge Visualization */}
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full operational-transition ${getGaugeColor(value, config?.thresholds)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span className={getMetricColor(value, config?.thresholds)}>
                    {value}{config?.suffix}
                  </span>
                  <span>{config?.thresholds?.critical * 1.2}{config?.suffix}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusMetrics;