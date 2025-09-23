import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const EmergencyAlert = ({ 
  alert = null,
  onDismiss = () => {},
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);

  useEffect(() => {
    if (alert) {
      setCurrentAlert(alert);
      setIsVisible(true);
    }
  }, [alert]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentAlert(null);
      onDismiss();
    }, 300);
  };

  if (!currentAlert) return null;

  const getAlertConfig = (level) => {
    switch (level) {
      case 'critical':
        return {
          bgColor: 'bg-error',
          textColor: 'text-error-foreground',
          icon: 'AlertTriangle',
          iconColor: 'text-error-foreground'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning',
          textColor: 'text-warning-foreground',
          icon: 'AlertCircle',
          iconColor: 'text-warning-foreground'
        };
      case 'info':
        return {
          bgColor: 'bg-primary',
          textColor: 'text-primary-foreground',
          icon: 'Info',
          iconColor: 'text-primary-foreground'
        };
      default:
        return {
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
          icon: 'Bell',
          iconColor: 'text-muted-foreground'
        };
    }
  };

  const config = getAlertConfig(currentAlert?.level);

  return (
    <div
      className={`
        fixed top-16 left-0 right-0 z-200 operational-transition
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        ${className}
      `}
    >
      <div className={`${config?.bgColor} ${config?.textColor} px-6 py-4`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Icon 
                name={config?.icon} 
                size={24} 
                className={`${config?.iconColor} ${currentAlert?.level === 'critical' ? 'animate-pulse' : ''}`}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-sm">
                  {currentAlert?.title}
                </h3>
                {currentAlert?.timestamp && (
                  <span className="text-xs opacity-90 font-mono">
                    {new Date(currentAlert.timestamp)?.toLocaleTimeString()}
                  </span>
                )}
              </div>
              
              {currentAlert?.message && (
                <p className="text-sm mt-1 opacity-95">
                  {currentAlert?.message}
                </p>
              )}
              
              {currentAlert?.location && (
                <div className="flex items-center space-x-1 mt-1">
                  <Icon name="MapPin" size={12} className={config?.iconColor} />
                  <span className="text-xs opacity-90">
                    {currentAlert?.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentAlert?.actionLabel && currentAlert?.onAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={currentAlert?.onAction}
                className="bg-transparent border-current text-current hover:bg-white/10"
              >
                {currentAlert?.actionLabel}
              </Button>
            )}
            
            {currentAlert?.dismissible !== false && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="text-current hover:bg-white/10 h-8 w-8"
              >
                <Icon name="X" size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;