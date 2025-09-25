import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ContextBreadcrumb from '../../components/ui/ContextBreadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const NotificationsPage = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Mock notifications data
  const mockNotifications = [
    {
      id: 'notif-001',
      title: 'Train Delay Alert',
      message: 'EXP-2401 is experiencing a 15-minute delay due to signal failure at Junction North. Passengers have been notified and alternative arrangements are being considered.',
      detailedMessage: 'Train EXP-2401 (Mumbai to Delhi Express) is currently delayed by 15 minutes due to an unexpected signal failure at Junction North. The technical team has been dispatched to resolve the issue. Estimated resolution time: 20 minutes. All connecting services have been alerted. Passenger announcements are being made every 5 minutes. Consider platform reallocation if delay extends beyond 30 minutes.',
      timestamp: '2024-01-15T14:32:00Z',
      type: 'warning',
      priority: 'high',
      unread: true,
      source: 'Signaling System',
      affectedServices: ['EXP-2401', 'LOC-1205', 'FRT-8901'],
      actions: [
        { label: 'View Train Details', action: 'view-train' },
        { label: 'Contact Station Master', action: 'contact-sm' },
        { label: 'Update Passengers', action: 'update-passengers' }
      ]
    },
    {
      id: 'notif-002',
      title: 'Platform Assignment Update',
      message: 'Platform 7 has been reassigned to LOC-1205 due to maintenance work on Platform 3.',
      detailedMessage: 'Due to scheduled maintenance work on Platform 3 (cleaning and signal checks), incoming train LOC-1205 has been reassigned to Platform 7. Maintenance window: 14:00-16:00. Platform 3 will resume normal operations after maintenance completion. All passenger information boards have been updated automatically.',
      timestamp: '2024-01-15T14:28:00Z',
      type: 'info',
      priority: 'medium',
      unread: true,
      source: 'Platform Management',
      affectedServices: ['LOC-1205'],
      actions: [
        { label: 'View Platform Status', action: 'view-platform' },
        { label: 'Notify Passengers', action: 'notify-passengers' }
      ]
    },
    {
      id: 'notif-003',
      title: 'Weather Advisory',
      message: 'Heavy rain forecast for the next 2 hours. Visibility may be affected.',
      detailedMessage: 'Meteorological Department has issued a weather advisory for heavy rainfall in the region for the next 2 hours (15:00-17:00). Expected rainfall: 25-35mm. Potential impacts: Reduced visibility, possible track flooding in low-lying areas, increased braking distances. All train operators have been notified to reduce speeds by 20% in affected sections. Drainage systems are being monitored continuously.',
      timestamp: '2024-01-15T14:25:00Z',
      type: 'warning',
      priority: 'medium',
      unread: false,
      source: 'Weather Service',
      affectedServices: ['All Services'],
      actions: [
        { label: 'View Weather Details', action: 'view-weather' },
        { label: 'Speed Restriction Protocol', action: 'speed-restriction' }
      ]
    },
    {
      id: 'notif-004',
      title: 'System Maintenance Complete',
      message: 'Scheduled maintenance on the signaling system has been completed successfully.',
      detailedMessage: 'The scheduled maintenance on the central signaling system has been completed successfully. Duration: 12:00-13:30 (1.5 hours). All systems are now fully operational and have passed diagnostic checks. Signal response times are within normal parameters. No service disruptions occurred during the maintenance window. Next scheduled maintenance: February 15, 2024.',
      timestamp: '2024-01-15T13:30:00Z',
      type: 'success',
      priority: 'low',
      unread: false,
      source: 'Maintenance Team',
      affectedServices: ['Signal System'],
      actions: [
        { label: 'View System Status', action: 'view-system' },
        { label: 'Download Report', action: 'download-report' }
      ]
    },
    {
      id: 'notif-005',
      title: 'Emergency Protocol Activated',
      message: 'Fire safety protocol activated at East Junction Station.',
      detailedMessage: 'Fire safety protocol has been automatically activated at East Junction Station due to smoke detection in the electrical room. Fire department has been notified and is en route (ETA: 8 minutes). All passengers have been evacuated to safety zones. Platform 5 and 6 are temporarily out of service. Backup power systems are active. Fire suppression systems are on standby. Station Master Sharma is coordinating the response.',
      timestamp: '2024-01-15T13:15:00Z',
      type: 'error',
      priority: 'emergency',
      unread: false,
      source: 'Emergency System',
      affectedServices: ['East Junction Operations'],
      actions: [
        { label: 'Emergency Dashboard', action: 'emergency-dashboard' },
        { label: 'Contact Fire Department', action: 'contact-fire' },
        { label: 'Evacuate Additional Areas', action: 'evacuate' }
      ]
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    
    // Check if specific notification ID was passed via state
    const notificationId = location?.state?.notificationId;
    if (notificationId) {
      const notification = mockNotifications?.find(n => n?.id === notificationId);
      if (notification) {
        setSelectedNotification(notification);
      }
    }
  }, [location?.state]);

  const filterOptions = [
    { value: 'all', label: 'All Notifications', count: notifications?.length },
    { value: 'unread', label: 'Unread', count: notifications?.filter(n => n?.unread)?.length },
    { value: 'emergency', label: 'Emergency', count: notifications?.filter(n => n?.priority === 'emergency')?.length },
    { value: 'high', label: 'High Priority', count: notifications?.filter(n => n?.priority === 'high')?.length },
    { value: 'today', label: 'Today', count: notifications?.filter(n => isToday(n?.timestamp))?.length }
  ];

  function isToday(timestamp) {
    const today = new Date();
    const date = new Date(timestamp);
    return date?.toDateString() === today?.toDateString();
  }

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications?.filter(n => n?.unread);
      case 'emergency':
        return notifications?.filter(n => n?.priority === 'emergency');
      case 'high':
        return notifications?.filter(n => n?.priority === 'high');
      case 'today':
        return notifications?.filter(n => isToday(n?.timestamp));
      default:
        return notifications;
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev?.map(notif =>
        notif?.id === notificationId
          ? { ...notif, unread: false }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev?.map(notif => ({ ...notif, unread: false }))
    );
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (notification?.unread) {
      markAsRead(notification?.id);
    }
  };

  const handleActionClick = (action, notification) => {
    console.log(`Action ${action} clicked for notification ${notification?.id}`);
    // Implement specific action handlers here
    switch (action) {
      case 'view-train':
        // Navigate to train details
        break;
      case 'contact-sm':
        // Open communication center
        break;
      case 'emergency-dashboard':
        // Navigate to emergency dashboard
        break;
      default:
        alert(`Action: ${action}`);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      case 'success': return 'CheckCircle';
      default: return 'Info';
    }
  };

  const getTypeColor = (type, priority) => {
    if (priority === 'emergency') return 'text-red-600 bg-red-50';
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'success': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      emergency: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return colors?.[priority] || colors?.low;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now?.getTime() - date?.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date?.toLocaleDateString();
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <ContextBreadcrumb />
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Notifications
            </h1>
            <p className="text-muted-foreground">
              Stay updated with system alerts, train status, and operational notifications
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
          {filterOptions?.map(option => (
            <button
              key={option?.value}
              onClick={() => setFilter(option?.value)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${filter === option?.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {option?.label}
              {option?.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                  {option?.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredNotifications?.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Bell" size={48} className="mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No notifications
                  </h3>
                  <p className="text-muted-foreground">
                    {filter === 'all' ? "You're all caught up! No new notifications."
                      : `No notifications match the "${filterOptions?.find(f => f?.value === filter)?.label}" filter.`
                    }
                  </p>
                </div>
              ) : (
                filteredNotifications?.map(notification => (
                  <div
                    key={notification?.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all
                      ${notification?.unread 
                        ? 'bg-primary/5 border-primary/20 hover:border-primary/40' :'bg-card border-border hover:border-border/60'
                      }
                      ${selectedNotification?.id === notification?.id ? 'ring-2 ring-primary/20' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`
                        p-2 rounded-full ${getTypeColor(notification?.type, notification?.priority)}
                      `}>
                        <Icon 
                          name={getTypeIcon(notification?.type)} 
                          size={16} 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {notification?.title}
                          </h3>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className={`
                              px-2 py-1 rounded-full text-xs font-medium border
                              ${getPriorityBadge(notification?.priority)}
                            `}>
                              {notification?.priority?.toUpperCase()}
                            </span>
                            {notification?.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {notification?.message}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{notification?.source}</span>
                          <span>{formatTimestamp(notification?.timestamp)}</span>
                        </div>
                        
                        {notification?.affectedServices && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {notification?.affectedServices?.slice(0, 3)?.map(service => (
                              <span
                                key={service}
                                className="px-2 py-1 bg-muted rounded text-xs"
                              >
                                {service}
                              </span>
                            ))}
                            {notification?.affectedServices?.length > 3 && (
                              <span className="px-2 py-1 bg-muted rounded text-xs">
                                +{notification?.affectedServices?.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notification Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {selectedNotification ? (
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`
                      p-3 rounded-full ${getTypeColor(selectedNotification?.type, selectedNotification?.priority)}
                    `}>
                      <Icon 
                        name={getTypeIcon(selectedNotification?.type)} 
                        size={20} 
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold text-foreground">
                        {selectedNotification?.title}
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium border
                          ${getPriorityBadge(selectedNotification?.priority)}
                        `}>
                          {selectedNotification?.priority?.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {selectedNotification?.source}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      {formatTimestamp(selectedNotification?.timestamp)}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      {selectedNotification?.detailedMessage}
                    </p>
                  </div>

                  {selectedNotification?.affectedServices && (
                    <div className="mb-4">
                      <h4 className="font-medium text-foreground mb-2">
                        Affected Services
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNotification?.affectedServices?.map(service => (
                          <span
                            key={service}
                            className="px-3 py-1 bg-muted rounded-md text-sm"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedNotification?.actions && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground mb-2">
                        Available Actions
                      </h4>
                      {selectedNotification?.actions?.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleActionClick(action?.action, selectedNotification)}
                          className="w-full justify-start"
                        >
                          {action?.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-card rounded-lg border border-border p-6 text-center">
                  <Icon name="MousePointer" size={32} className="mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-semibold text-foreground mb-2">
                    Select a Notification
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any notification to view its details and available actions
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;