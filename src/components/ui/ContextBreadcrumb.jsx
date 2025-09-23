import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const ContextBreadcrumb = ({ 
  customBreadcrumbs = null,
  className = ""
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getDefaultBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    
    const breadcrumbMap = {
      'operations-control-center': { label: 'Control Center', icon: 'MonitorSpeaker' },
      'train-performance-analytics': { label: 'Train Analytics', icon: 'TrendingUp' },
      'station-management-hub': { label: 'Station Hub', icon: 'Building2' },
      'ai-decision-support': { label: 'AI Support', icon: 'Brain' },
      'settings': { label: 'Settings', icon: 'Settings' },
      'help': { label: 'Help', icon: 'HelpCircle' },
      'admin': { label: 'Admin', icon: 'Shield' }
    };

    const breadcrumbs = [
      { label: 'Dashboard', path: '/', icon: 'Home' }
    ];

    let currentPath = '';
    pathSegments?.forEach((segment) => {
      currentPath += `/${segment}`;
      const config = breadcrumbMap?.[segment];
      if (config) {
        breadcrumbs?.push({
          label: config?.label,
          path: currentPath,
          icon: config?.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = customBreadcrumbs || getDefaultBreadcrumbs();

  if (breadcrumbs?.length <= 1) return null;

  const handleNavigation = (path) => {
    if (path && path !== location?.pathname) {
      navigate(path);
    }
  };

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-muted-foreground mb-6 ${className}`}
      aria-label="Breadcrumb navigation"
    >
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={crumb?.path || index}>
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={14} 
              className="text-muted-foreground/60" 
            />
          )}
          
          <div className="flex items-center space-x-1">
            {crumb?.icon && (
              <Icon 
                name={crumb?.icon} 
                size={14} 
                className={
                  index === breadcrumbs?.length - 1 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
                }
              />
            )}
            
            {index === breadcrumbs?.length - 1 ? (
              <span className="font-medium text-foreground">
                {crumb?.label}
              </span>
            ) : (
              <button
                onClick={() => handleNavigation(crumb?.path)}
                className="hover:text-foreground operational-hover transition-colors"
              >
                {crumb?.label}
              </button>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default ContextBreadcrumb;