import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemIntegrationStatus = ({ integrations, onRefreshIntegration }) => {
  const [expandedSystem, setExpandedSystem] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'disconnected': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      case 'disconnected': return 'Circle';
      default: return 'Circle';
    }
  };

  const getLatencyColor = (latency) => {
    if (latency < 100) return 'text-success';
    if (latency < 500) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 operational-shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">System Integration Status</h3>
          <p className="text-sm text-muted-foreground">
            Real-time connectivity with railway systems
          </p>
        </div>
        
        <Button variant="outline" size="sm">
          <Icon name="RefreshCw" size={16} />
          Refresh All
        </Button>
      </div>
      <div className="space-y-4">
        {integrations?.map((integration) => (
          <div key={integration?.id} className="border border-border rounded-lg p-4 bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-muted/30`}>
                  <Icon 
                    name={integration?.icon} 
                    size={20} 
                    className={getStatusColor(integration?.status)}
                  />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground">{integration?.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={getStatusIcon(integration?.status)} 
                        size={14} 
                        className={getStatusColor(integration?.status)}
                      />
                      <span className={`text-xs font-medium ${getStatusColor(integration?.status)}`}>
                        {integration?.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{integration?.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {integration?.dataPoints} data points
                  </div>
                  <div className={`text-xs ${getLatencyColor(integration?.latency)}`}>
                    {integration?.latency}ms latency
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedSystem(expandedSystem === integration?.id ? null : integration?.id)}
                >
                  <Icon name={expandedSystem === integration?.id ? "ChevronUp" : "ChevronDown"} size={16} />
                </Button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedSystem === integration?.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Connection Details</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Endpoint:</span>
                        <span className="text-foreground font-mono">{integration?.endpoint}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Update:</span>
                        <span className="text-foreground">
                          {new Date(integration.lastUpdate)?.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime:</span>
                        <span className="text-success">{integration?.uptime}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Data Metrics</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Records/min:</span>
                        <span className="text-foreground">{integration?.recordsPerMinute}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Error Rate:</span>
                        <span className={integration?.errorRate > 5 ? "text-error" : "text-success"}>
                          {integration?.errorRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Queue Size:</span>
                        <span className="text-foreground">{integration?.queueSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {integration?.recentErrors && integration?.recentErrors?.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Recent Issues</h5>
                    <div className="space-y-2">
                      {integration?.recentErrors?.map((error, index) => (
                        <div key={index} className="p-2 bg-error/10 rounded border border-error/20">
                          <div className="flex items-start space-x-2">
                            <Icon name="AlertCircle" size={14} className="text-error mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm text-error font-medium">{error?.type}</div>
                              <div className="text-xs text-muted-foreground">{error?.message}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(error.timestamp)?.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Model accuracy: {integration?.modelAccuracy}%
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRefreshIntegration(integration?.id)}
                    >
                      <Icon name="RefreshCw" size={14} />
                      Refresh
                    </Button>
                    {integration?.status === 'error' && (
                      <Button variant="outline" size="sm" className="text-error border-error">
                        <Icon name="AlertTriangle" size={14} />
                        Diagnose
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Overall System Health */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-success">
              {integrations?.filter(i => i?.status === 'connected')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Connected</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">
              {integrations?.filter(i => i?.status === 'warning')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-error">
              {integrations?.filter(i => i?.status === 'error')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Errors</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {Math.round(integrations?.reduce((acc, i) => acc + i?.uptime, 0) / integrations?.length)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemIntegrationStatus;