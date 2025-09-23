import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommunicationPanel = ({ messages, onSendMessage, maintenanceRequests, emergencyContacts }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState('control-center');

  const handleSendMessage = () => {
    if (newMessage?.trim()) {
      onSendMessage({
        id: Date.now(),
        to: selectedContact,
        message: newMessage,
        timestamp: new Date(),
        priority: 'normal'
      });
      setNewMessage('');
    }
  };

  const contactOptions = [
    { id: 'control-center', name: 'Control Center', icon: 'MonitorSpeaker', status: 'online' },
    { id: 'train-dispatch', name: 'Train Dispatch', icon: 'Radio', status: 'online' },
    { id: 'maintenance', name: 'Maintenance', icon: 'Wrench', status: 'busy' },
    { id: 'security', name: 'Security', icon: 'Shield', status: 'online' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'busy': return 'bg-warning';
      case 'offline': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Communication Hub */}
      <div className="bg-card rounded-lg p-6 operational-shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Communication Hub</h3>
        
        {/* Contact Selection */}
        <div className="space-y-3 mb-4">
          {contactOptions?.map((contact) => (
            <button
              key={contact?.id}
              onClick={() => setSelectedContact(contact?.id)}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg operational-hover
                ${selectedContact === contact?.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50 hover:bg-muted'}
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon name={contact?.icon} size={18} className="text-foreground" />
                <span className="font-medium text-foreground">{contact?.name}</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(contact?.status)}`}></div>
            </button>
          ))}
        </div>

        {/* Message Input */}
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e?.target?.value)}
            onKeyPress={(e) => e?.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage?.trim()}
            iconName="Send"
            iconPosition="right"
            className="w-full"
          >
            Send Message
          </Button>
        </div>

        {/* Recent Messages */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Messages</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {messages?.slice(0, 5)?.map((message) => (
              <div key={message?.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {message?.from || message?.to}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.timestamp)?.toLocaleTimeString('en-GB', { hour12: false })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{message?.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Maintenance Requests */}
      <div className="bg-card rounded-lg p-6 operational-shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Maintenance Queue</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span className="text-sm text-muted-foreground">
              {maintenanceRequests?.length} pending
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {maintenanceRequests?.slice(0, 4)?.map((request) => (
            <div key={request?.id} className="p-3 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={request?.priority === 'high' ? 'AlertTriangle' : 'Wrench'} 
                    size={16} 
                    className={request?.priority === 'high' ? 'text-error' : 'text-warning'}
                  />
                  <span className="font-medium text-sm text-foreground">
                    Platform {request?.platform}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {request?.reportedTime}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{request?.issue}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  request?.priority === 'high' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                }`}>
                  {request?.priority} priority
                </span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Emergency Contacts */}
      <div className="bg-card rounded-lg p-6 operational-shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Emergency Contacts</h3>
        <div className="space-y-3">
          {emergencyContacts?.map((contact) => (
            <Button
              key={contact?.id}
              variant="outline"
              className="w-full justify-start"
              iconName={contact?.icon}
              iconPosition="left"
            >
              <div className="flex items-center justify-between w-full">
                <span>{contact?.name}</span>
                <span className="text-xs text-muted-foreground font-mono">
                  {contact?.number}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunicationPanel;