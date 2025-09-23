import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLeftNavOpen, setIsLeftNavOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-001',
      title: 'Train Delay Alert',
      message: 'EXP-2401 delayed by 15 minutes',
      timestamp: '2 min ago',
      type: 'warning',
      unread: true
    },
    {
      id: 'notif-002', 
      title: 'Platform Assignment',
      message: 'Platform 7 assigned to LOC-1205',
      timestamp: '5 min ago',
      type: 'info',
      unread: true
    }
  ]);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/operations-control-center',
      icon: 'LayoutDashboard',
      tooltip: 'Main operations dashboard'
    },
    {
      label: 'Control Center',
      path: '/operations-control-center',
      icon: 'MonitorSpeaker',
      tooltip: 'Real-time operational dashboard and system overview'
    },
    {
      label: 'Train Analytics',
      path: '/train-performance-analytics',
      icon: 'TrendingUp',
      tooltip: 'Performance analysis and delay pattern investigation'
    },
    {
      label: 'Station Hub',
      path: '/station-management-hub',
      icon: 'Building2',
      tooltip: 'Platform management and station coordination tools'
    },
    {
      label: 'AI Support',
      path: '/ai-decision-support',
      icon: 'Brain',
      tooltip: 'Predictive analytics and intelligent scheduling'
    },
    {
      label: 'Communication',
      path: '/communication-center',
      icon: 'MessageCircle',
      tooltip: 'Communication between section controllers and station masters'
    },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: 'Bell',
      tooltip: 'View all notifications and alerts'
    }
  ];

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement?.classList?.add('dark');
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsLeftNavOpen(false);
  };

  const handleNotificationClick = (notificationId) => {
    // Mark notification as read
    setNotifications(prev => 
      prev?.map(notif => 
        notif?.id === notificationId 
          ? { ...notif, unread: false }
          : notif
      )
    );
    
    // Navigate to notifications page with specific notification
    navigate('/notifications', { state: { notificationId } });
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement?.classList?.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement?.classList?.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const isActivePath = (path) => location?.pathname === path;
  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  return (
    <>
      {/* Top Header Bar */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left: Menu Button + Logo */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLeftNavOpen(true)}
              className="hover:bg-muted"
            >
              <Icon name="Menu" size={20} />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Icon name="Train" size={24} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground leading-tight">
                  Train-AI Control
                </h1>
                <span className="text-xs text-muted-foreground font-mono">
                  v2.1 - {new Date()?.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-4">
            {/* System Status */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-success/10 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-success">Online</span>
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hover:bg-muted"
              title="Toggle dark/light mode"
            >
              <Icon name={darkMode ? "Sun" : "Moon"} size={18} />
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/notifications')}
                className="hover:bg-muted relative"
              >
                <Icon name="Bell" size={18} />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </Button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-foreground">Control Operator</div>
                <div className="text-xs text-muted-foreground">Shift A - Day</div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Left Navigation Sidebar */}
      {isLeftNavOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsLeftNavOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative w-80 h-full bg-card border-r border-border shadow-2xl">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                  <Icon name="Train" size={24} color="white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Navigation
                  </h2>
                  <p className="text-xs text-muted-foreground">Railway Operations</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLeftNavOpen(false)}
                className="hover:bg-muted"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-2">
                {navigationItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                    title={item?.tooltip}
                  >
                    <Icon name={item?.icon} size={20} />
                    <span>{item?.label}</span>
                    {item?.label === 'Notifications' && unreadCount > 0 && (
                      <div className="ml-auto w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </div>
                    )}
                  </button>
                ))}
              </nav>

              {/* Quick Notifications in Sidebar */}
              {notifications?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 px-4">
                    Recent Notifications
                  </h3>
                  <div className="space-y-2">
                    {notifications?.slice(0, 3)?.map(notification => (
                      <div
                        key={notification?.id}
                        onClick={() => handleNotificationClick(notification?.id)}
                        className={`
                          p-3 rounded-lg cursor-pointer transition-colors border-l-4
                          ${notification?.unread 
                            ? 'bg-primary/5 border-l-primary' :'bg-muted/30 border-l-transparent'
                          }
                          hover:bg-muted/50
                        `}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon 
                            name={notification?.type === 'warning' ? 'AlertTriangle' : 
                                  notification?.type === 'error' ? 'XCircle' : 'Info'}
                            size={14}
                            className={
                              notification?.type === 'warning' ? 'text-warning' :
                              notification?.type === 'error' ? 'text-destructive' : 'text-primary'
                            }
                          />
                          <span className="text-xs font-semibold text-foreground">
                            {notification?.title}
                          </span>
                          {notification?.unread && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {notification?.message}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {notification?.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('/notifications')}
                    className="w-full mt-3 text-xs"
                  >
                    View All Notifications
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Railway Control v2.1
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-xs text-success font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;