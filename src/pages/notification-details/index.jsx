import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ContextBreadcrumb from '../../components/ui/ContextBreadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const NotificationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock notification data
  const mockNotifications = [
    {
      id: 'notif-001',
      title: 'Train Delay Alert',
      message: 'EXP-2401 delayed by 15 minutes due to signal failure at Junction North',
      detailedMessage: 'Express train 2401 from New Delhi to Mumbai Central is experiencing a 15-minute delay due to automatic signal system failure at Junction North - Signal Box 7. Manual operations are now in effect. Estimated arrival time has been updated to 14:45. Passengers have been informed via PA system and mobile notifications. Alternative routing through Junction South is being evaluated.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      type: 'warning',
      priority: 'high',
      source: 'Signal Control System',
      affectedRoutes: ['New Delhi - Mumbai Central'],
      affectedStations: ['Junction North', 'Central Station'],
      unread: true,
      resolved: false,
      timeline: [
        {
          time: new Date(Date.now() - 2 * 60 * 1000),
          event: 'Signal failure detected at Junction North',
          source: 'Automatic Detection System'
        },
        {
          time: new Date(Date.now() - 1 * 60 * 1000),
          event: 'Manual operations activated',
          source: 'Signal Control Operator'
        }
      ],
      relatedNotifications: ['notif-003'],
      actions: [
        { label: 'Contact Signal Team', action: 'contact', urgent: true },
        { label: 'Update Passenger Info', action: 'update', urgent: false },
        { label: 'Evaluate Alternative Route', action: 'route', urgent: false }
      ]
    },
    {
      id: 'notif-002',
      title: 'Platform Assignment Update',
      message: 'Platform 7 assigned to LOC-1205 arriving at 15:15',
      detailedMessage: 'Local train 1205 from East Junction to West Terminal has been assigned to Platform 7 for arrival at 15:15. Previous assignment to Platform 5 was changed due to maintenance work on Track 5B. Platform 7 has been cleared and prepared for passenger boarding. Station announcements have been updated accordingly.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      type: 'info',
      priority: 'medium',
      source: 'Platform Management System',
      affectedRoutes: ['East Junction - West Terminal'],
      affectedStations: ['Central Station'],
      unread: true,
      resolved: true,
      timeline: [
        {
          time: new Date(Date.now() - 8 * 60 * 1000),
          event: 'Maintenance work started on Track 5B',
          source: 'Maintenance Team'
        },
        {
          time: new Date(Date.now() - 5 * 60 * 1000),
          event: 'Platform reassignment completed',
          source: 'Platform Controller'
        }
      ],
      relatedNotifications: [],
      actions: [
        { label: 'Verify Platform Status', action: 'verify', urgent: false },
        { label: 'Update Digital Boards', action: 'update', urgent: false }
      ]
    },
    {
      id: 'notif-003',
      title: 'Critical System Alert',
      message: 'Multiple signal failures detected in North Section',
      detailedMessage: 'Critical alert: Multiple automatic signal systems have failed simultaneously in the North Section between Junctions A, B, and C. This affects 6 active train movements and requires immediate manual intervention. Emergency protocols have been activated. All affected trains are being operated under manual signal control. Railway Traffic Control has been notified and backup systems are being deployed.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      type: 'error',
      priority: 'critical',
      source: 'Signal Monitoring System',
      affectedRoutes: ['Multiple North Section Routes'],
      affectedStations: ['Junction A', 'Junction B', 'Junction C'],
      unread: false,
      resolved: false,
      timeline: [
        {
          time: new Date(Date.now() - 12 * 60 * 1000),
          event: 'First signal failure detected at Junction A',
          source: 'Automatic Monitoring'
        },
        {
          time: new Date(Date.now() - 11 * 60 * 1000),
          event: 'Cascading failures at Junctions B and C',
          source: 'System Alert'
        },
        {
          time: new Date(Date.now() - 10 * 60 * 1000),
          event: 'Emergency protocols activated',
          source: 'Control Center'
        }
      ],
      relatedNotifications: ['notif-001'],
      actions: [
        { label: 'Deploy Emergency Team', action: 'emergency', urgent: true },
        { label: 'Activate Backup Systems', action: 'backup', urgent: true },
        { label: 'Coordinate with Traffic Control', action: 'coordinate', urgent: true }
      ]
    },
    {
      id: 'notif-004',
      title: 'Maintenance Completion',
      message: 'Scheduled maintenance completed on Track 3A',
      detailedMessage: 'Scheduled maintenance work on Track 3A has been successfully completed ahead of schedule. The track has been tested and certified safe for normal operations. All safety checks have been passed and the track is now available for train movements. The next scheduled train EXP-1234 can proceed as planned.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      type: 'success',
      priority: 'low',
      source: 'Maintenance Management System',
      affectedRoutes: ['Central - South Section'],
      affectedStations: ['Central Station'],
      unread: false,
      resolved: true,
      timeline: [
        {
          time: new Date(Date.now() - 45 * 60 * 1000),
          event: 'Maintenance work started',
          source: 'Maintenance Team'
        },
        {
          time: new Date(Date.now() - 15 * 60 * 1000),
          event: 'Maintenance completed and track certified',
          source: 'Safety Inspector'
        }
      ],
      relatedNotifications: [],
      actions: [
        { label: 'Update Track Availability', action: 'update', urgent: false },
        { label: 'Resume Normal Operations', action: 'resume', urgent: false }
      ]
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    
    // Check if notification ID was passed via state
    const notificationId = location?.state?.notificationId;
    if (notificationId) {
      const notification = mockNotifications?.find(n => n?.id === notificationId);
      if (notification) {
        setSelectedNotification(notification);
      }
    }
  }, [location?.state]);

  const handleNotificationSelect = (notification) => {
    setSelectedNotification(notification);
    
    // Mark as read if it was unread
    if (notification?.unread) {
      setNotifications(prev => 
        prev?.map(n => 
          n?.id === notification?.id 
            ? { ...n, unread: false }
            : n
        )
      );
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(n => 
        n?.id === notificationId 
          ? { ...n, unread: false }
          : n
      )
    );
  };

  const handlePriorityChange = (notificationId, newPriority) => {
    setNotifications(prev => 
      prev?.map(n => 
        n?.id === notificationId 
          ? { ...n, priority: newPriority }
          : n
      )
    );
  };

  const handleResolve = (notificationId) => {
    setNotifications(prev => 
      prev?.map(n => 
        n?.id === notificationId 
          ? { ...n, resolved: true }
          : n
      )
    );
  };

  const handleAction = (action) => {
    console.log('Executing action:', action);
    // Implement specific action handlers here
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'error': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'success': return 'CheckCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const filteredNotifications = notifications?.filter(notification => {
    const matchesType = filterType === 'all' || notification?.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification?.priority === filterPriority;
    const matchesSearch = searchQuery === '' || 
      notification?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      notification?.message?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    return matchesType && matchesPriority && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <ContextBreadcrumb />
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2 border-l-4 border-primary pl-4">
              Notification Management
            </h1>
            <p className="text-muted-foreground ml-6">
              Comprehensive notification tracking and management system
            </p>
          </div>
          <Button onClick={() => navigate(-1)} variant="outline">
            <Icon name="ArrowLeft" size={16} />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notification List - Left Panel */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border">
              {/* Filters and Search */}
              <div className="p-6 border-b border-border space-y-4">
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e?.target?.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="error">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                  </select>
                  
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e?.target?.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    onClick={() => handleNotificationSelect(notification)}
                    className={`
                      p-4 border-b border-border cursor-pointer transition-colors border-l-4
                      ${selectedNotification?.id === notification?.id 
                        ? 'bg-primary/10 border-l-primary' 
                        : notification?.unread 
                          ? 'bg-accent/30 border-l-accent hover:bg-accent/50' :'hover:bg-muted/50 border-l-transparent'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={getTypeIcon(notification?.type)} 
                          size={16} 
                          className={
                            notification?.type === 'error' ? 'text-red-500' :
                            notification?.type === 'warning' ? 'text-orange-500' :
                            notification?.type === 'success'? 'text-green-500' : 'text-blue-500'
                          }
                        />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(notification?.priority)}`}>
                          {notification?.priority?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {notification?.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                        {notification?.resolved && (
                          <Icon name="Check" size={12} className="text-green-500" />
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mb-1">
                      {notification?.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification?.message}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {notification?.timestamp?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notification Detail View - Right Panel */}
          <div className="lg:col-span-2">
            {selectedNotification ? (
              <div className="bg-card rounded-lg border border-border">
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={getTypeIcon(selectedNotification?.type)} 
                        size={24} 
                        className={
                          selectedNotification?.type === 'error' ? 'text-red-500' :
                          selectedNotification?.type === 'warning' ? 'text-orange-500' :
                          selectedNotification?.type === 'success'? 'text-green-500' : 'text-blue-500'
                        }
                      />
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {selectedNotification?.title}
                        </h2>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(selectedNotification?.priority)}`}>
                            {selectedNotification?.priority?.toUpperCase()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {selectedNotification?.source}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {selectedNotification?.unread && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkAsRead(selectedNotification?.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      {!selectedNotification?.resolved && (
                        <Button 
                          size="sm"
                          onClick={() => handleResolve(selectedNotification?.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-4">
                    {selectedNotification?.timestamp?.toLocaleString()} • 
                    Affects {selectedNotification?.affectedStations?.length} station(s)
                  </div>
                </div>

                {/* Detailed Content */}
                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 border-l-4 border-primary pl-4">
                      Detailed Description
                    </h3>
                    <p className="text-foreground leading-relaxed ml-6">
                      {selectedNotification?.detailedMessage}
                    </p>
                  </div>

                  {/* Affected Areas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Affected Routes</h4>
                      <ul className="space-y-1">
                        {selectedNotification?.affectedRoutes?.map((route, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <Icon name="Route" size={12} className="mr-2" />
                            {route}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Affected Stations</h4>
                      <ul className="space-y-1">
                        {selectedNotification?.affectedStations?.map((station, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <Icon name="MapPin" size={12} className="mr-2" />
                            {station}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4 border-l-4 border-primary pl-4">
                      Incident Timeline
                    </h3>
                    <div className="ml-6 space-y-3">
                      {selectedNotification?.timeline?.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm text-foreground font-medium">
                              {event?.event}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {event?.time?.toLocaleTimeString()} • {event?.source}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedNotification?.actions?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 border-l-4 border-primary pl-4">
                        Available Actions
                      </h3>
                      <div className="ml-6 flex flex-wrap gap-2">
                        {selectedNotification?.actions?.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={action?.urgent ? "default" : "outline"}
                            onClick={() => handleAction(action?.action)}
                            className={action?.urgent ? "bg-red-600 hover:bg-red-700" : ""}
                          >
                            {action?.urgent && <Icon name="AlertTriangle" size={14} className="mr-1" />}
                            {action?.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Notifications */}
                  {selectedNotification?.relatedNotifications?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 border-l-4 border-primary pl-4">
                        Related Notifications
                      </h3>
                      <div className="ml-6 space-y-2">
                        {selectedNotification?.relatedNotifications?.map((relatedId) => {
                          const related = notifications?.find(n => n?.id === relatedId);
                          return related ? (
                            <div
                              key={relatedId}
                              className="p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50"
                              onClick={() => handleNotificationSelect(related)}
                            >
                              <div className="text-sm font-medium text-foreground">
                                {related?.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {related?.timestamp?.toLocaleString()}
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border h-96 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Notification Selected
                  </h3>
                  <p className="text-muted-foreground">
                    Select a notification from the list to view its details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationDetails;