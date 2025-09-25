import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ContextBreadcrumb from '../../components/ui/ContextBreadcrumb';
import EmergencyAlert from '../../components/ui/EmergencyAlert';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ContactList from './components/ContactList';
import MessageArea from './components/MessageArea';
import MessageComposer from './components/MessageComposer';
import { useAuth } from '../../contexts/AuthContext';

const CommunicationCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const messagesEndRef = useRef(null);

  // Mock contacts data for section controllers and station masters
  const contacts = [
    {
      id: 'sm-001',
      name: 'Rajesh Kumar',
      role: 'Station Master',
      station: 'Central Station',
      status: 'online',
      lastSeen: null,
      priority: 'high',
      avatar: null
    },
    {
      id: 'sc-002', 
      name: 'Aisha Sharma',
      role: 'Section Controller',
      section: 'North Section',
      status: 'online',
      lastSeen: null,
      priority: 'high',
      avatar: null
    },
    {
      id: 'sm-003',
      name: 'Mohan Verma',
      role: 'Station Master',
      station: 'East Junction',
      status: 'busy',
      lastSeen: null,
      priority: 'medium',
      avatar: null
    },
    {
      id: 'sc-004',
      name: 'Sunita Yadav',
      role: 'Section Controller', 
      section: 'South Section',
      status: 'away',
      lastSeen: '5 min ago',
      priority: 'medium',
      avatar: null
    },
    {
      id: 'sm-005',
      name: 'Deepak Mehta',
      role: 'Station Master',
      station: 'West Terminal',
      status: 'offline',
      lastSeen: '1 hour ago',
      priority: 'low',
      avatar: null
    },
    {
      id: 'sc-006',
      name: 'Meera Iyer',
      role: 'Section Controller',
      section: 'Central Section',
      status: 'online',
      lastSeen: null,
      priority: 'high',
      avatar: null
    }
  ];

  // Mock message templates
  const messageTemplates = [
    {
      id: 'temp-001',
      category: 'Operations',
      title: 'Train Delay Notification',
      content: 'Train {trainNumber} is delayed by {minutes} minutes due to {reason}. Estimated arrival: {eta}.'
    },
    {
      id: 'temp-002',
      category: 'Maintenance',
      title: 'Track Maintenance Alert',
      content: 'Scheduled maintenance on Track {trackNumber} from {startTime} to {endTime}. Alternative routing in effect.'
    },
    {
      id: 'temp-003',
      category: 'Emergency',
      title: 'Emergency Protocol',
      content: 'Emergency protocol {protocolName} has been activated. All personnel report to assigned stations immediately.'
    },
    {
      id: 'temp-004',
      category: 'Shift',
      title: 'Shift Handover',
      content: 'Shift handover briefing: Current status - {statusSummary}. Priority items: {priorityItems}.'
    }
  ];

  useEffect(() => {
    // Set online users
    setOnlineUsers(contacts?.filter(c => c?.status === 'online')?.map(c => c?.id));

    const key = (suffix) => `${user?.id || 'guest'}_${suffix}`;

    // Attempt to restore persisted state
    try {
      const storedMessages = localStorage.getItem(key('cc_messages'));
      const storedActiveId = localStorage.getItem(key('cc_active_contact_id'));
      const storedNotifications = localStorage.getItem(key('cc_notifications'));

      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Initialize messages for each contact if nothing stored
        const initialMessages = {};
        contacts?.forEach(contact => {
          initialMessages[contact.id] = [];
        });
        setMessages(initialMessages);
      }

      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }

      if (storedActiveId) {
        const contact = contacts?.find(c => c?.id === storedActiveId);
        if (contact) setActiveContact(contact);
      }
    } catch (e) {
      // If parsing fails, clear corrupted storage
      const key = (suffix) => `${user?.id || 'guest'}_${suffix}`;
      localStorage.removeItem(key('cc_messages'));
      localStorage.removeItem(key('cc_active_contact_id'));
      localStorage.removeItem(key('cc_notifications'));
    }

    // Simulate incoming messages
    const messageInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        simulateIncomingMessage();
      }
    }, 10000);

    return () => clearInterval(messageInterval);
  }, [user?.id]);

  // Persist state when it changes
  useEffect(() => {
    try {
      const key = (suffix) => `${user?.id || 'guest'}_${suffix}`;
      localStorage.setItem(key('cc_messages'), JSON.stringify(messages));
    } catch {}
  }, [messages, user?.id]);

  useEffect(() => {
    try {
      const key = (suffix) => `${user?.id || 'guest'}_${suffix}`;
      localStorage.setItem(key('cc_notifications'), JSON.stringify(notifications));
    } catch {}
  }, [notifications, user?.id]);

  useEffect(() => {
    try {
      const key = (suffix) => `${user?.id || 'guest'}_${suffix}`;
      localStorage.setItem(key('cc_active_contact_id'), activeContact?.id || '');
    } catch {}
  }, [activeContact?.id, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeContact]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const simulateIncomingMessage = () => {
    const randomContact = contacts?.[Math.floor(Math.random() * contacts?.length)];
    const sampleMessages = [
      "Platform 3 is clear for incoming Express 2401",
      "Signal system check completed - all systems normal",
      "Passenger count update: Platform 2 - 847 waiting",
      "Track maintenance crew ready for 15:30 slot",
      "Weather update: Light rain expected after 16:00"
    ];
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: randomContact?.id,
      senderName: randomContact?.name,
      content: sampleMessages?.[Math.floor(Math.random() * sampleMessages?.length)],
      timestamp: new Date()?.toISOString(),
      type: 'received',
      read: false,
      priority: 'normal'
    };

    setMessages(prev => ({
      ...prev,
      [randomContact?.id]: [...(prev?.[randomContact?.id] || []), newMessage]
    }));

    // Add notification if not current active contact
    if (activeContact?.id !== randomContact?.id) {
      setNotifications(prev => [...prev, {
        id: `notif-${Date.now()}`,
        contactId: randomContact?.id,
        contactName: randomContact?.name,
        message: newMessage?.content,
        timestamp: newMessage?.timestamp,
        read: false
      }]);
    }
  };

  const handleContactSelect = (contact) => {
    setActiveContact(contact);
    
    // Mark messages as read
    if (messages?.[contact?.id]) {
      setMessages(prev => ({
        ...prev,
        [contact?.id]: prev?.[contact?.id]?.map(msg => ({
          ...msg,
          read: true
        }))
      }));
    }
    
    // Clear notifications for this contact
    setNotifications(prev => prev?.filter(notif => notif?.contactId !== contact?.id));
  };

  const handleSendMessage = (content, priority = 'normal', attachments = []) => {
    if (!activeContact || !content?.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'Current User',
      content: content?.trim(),
      timestamp: new Date()?.toISOString(),
      type: 'sent',
      read: true,
      priority,
      attachments
    };

    setMessages(prev => ({
      ...prev,
      [activeContact?.id]: [...(prev?.[activeContact?.id] || []), newMessage]
    }));
  };

  const handleClearChat = () => {
    if (!activeContact) return;
    const confirmClear = window.confirm(`Clear chat with ${activeContact?.name}? This cannot be undone.`);
    if (!confirmClear) return;
    setMessages(prev => ({
      ...prev,
      [activeContact?.id]: []
    }));
    // Remove notifications for this contact too
    setNotifications(prev => prev?.filter(n => n?.contactId !== activeContact?.id));
  };

  const handleEmergencyBroadcast = (message, recipients = 'all') => {
    const emergencyMessage = {
      id: `emergency-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'System Administrator',
      content: message,
      timestamp: new Date()?.toISOString(),
      type: 'emergency',
      read: true,
      priority: 'emergency',
      broadcast: true,
      recipients
    };

    // Add to all contacts if broadcast to all
    if (recipients === 'all') {
      const updatedMessages = { ...messages };
      contacts?.forEach(contact => {
        updatedMessages[contact.id] = [...(updatedMessages?.[contact?.id] || []), emergencyMessage];
      });
      setMessages(updatedMessages);
    }

    setEmergencyAlert({
      level: 'critical',
      title: 'Emergency Broadcast Sent',
      message: `Emergency message broadcasted to ${recipients === 'all' ? 'all personnel' : recipients}`,
      timestamp: new Date(),
      dismissible: true
    });
  };

  const handleNotificationClick = (notification) => {
    const contact = contacts?.find(c => c?.id === notification?.contactId);
    if (contact) {
      handleContactSelect(contact);
    }
  };

  const filteredContacts = contacts?.filter(contact =>
    contact?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    contact?.role?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    (contact?.station && contact?.station?.toLowerCase()?.includes(searchTerm?.toLowerCase())) ||
    (contact?.section && contact?.section?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyAlert 
        alert={emergencyAlert} 
        onDismiss={() => setEmergencyAlert(null)} 
      />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <ContextBreadcrumb />
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Communication Center
            </h1>
            <p className="text-muted-foreground">
              Real-time messaging between section controllers and station masters
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-success">
                {onlineUsers?.length} Online
              </span>
            </div>
            
            <Button
              variant="destructive"
              onClick={() => {
                const message = prompt('Enter emergency broadcast message:');
                if (message) handleEmergencyBroadcast(message);
              }}
            >
              <Icon name="AlertTriangle" size={16} />
              Emergency Broadcast
            </Button>
          </div>
        </div>

        {/* Communication Interface */}
        <div className="bg-card rounded-lg border border-border h-[calc(100vh-200px)] flex">
          {/* Left Sidebar - Contacts */}
          <div className="w-1/3 border-r border-border flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Notifications */}
            {notifications?.length > 0 && (
              <div className="p-2 bg-muted/50 border-b border-border">
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  New Messages ({notifications?.length})
                </div>
                <div className="max-h-20 overflow-y-auto space-y-1">
                  {notifications?.slice(0, 3)?.map(notification => (
                    <div
                      key={notification?.id}
                      onClick={() => handleNotificationClick(notification)}
                      className="text-xs p-2 bg-primary/10 rounded cursor-pointer hover:bg-primary/20 transition-colors"
                    >
                      <div className="font-medium text-primary">{notification?.contactName}</div>
                      <div className="text-foreground truncate">{notification?.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
              <ContactList
                contacts={filteredContacts}
                activeContact={activeContact}
                onContactSelect={handleContactSelect}
                messages={messages}
                notifications={notifications}
              />
            </div>
          </div>

          {/* Right Area - Messages */}
          <div className="flex-1 flex flex-col">
            {activeContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="User" size={20} color="white" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{activeContact?.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-2">
                          <span>{activeContact?.role}</span>
                          <span>•</span>
                          <span>{activeContact?.station || activeContact?.section}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${
                              activeContact?.status === 'online' ? 'bg-success' :
                              activeContact?.status === 'busy' ? 'bg-warning' :
                              activeContact?.status === 'away'? 'bg-secondary' : 'bg-muted-foreground'
                            }`}></div>
                            <span className="capitalize">{activeContact?.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Icon name="Phone" size={16} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icon name="Video" size={16} />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={handleClearChat} title="Clear Chat">
                        <Icon name="Trash2" size={16} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icon name="MoreVertical" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto">
                  <MessageArea
                    messages={messages?.[activeContact?.id] || []}
                    activeContact={activeContact}
                  />
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Composer */}
                <div className="border-t border-border">
                  <MessageComposer
                    onSendMessage={handleSendMessage}
                    templates={messageTemplates}
                    activeContact={activeContact}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="MessageCircle" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Select a Contact
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a section controller or station master to start communicating
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

export default CommunicationCenter;