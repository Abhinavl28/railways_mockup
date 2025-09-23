import React from 'react';
import Icon from '../../../components/AppIcon';

const ContactList = ({ 
  contacts, 
  activeContact, 
  onContactSelect, 
  messages, 
  notifications 
}) => {
  
  const getUnreadCount = (contactId) => {
    const contactMessages = messages?.[contactId] || [];
    return contactMessages?.filter(msg => !msg?.read && msg?.type === 'received')?.length;
  };

  const getLastMessage = (contactId) => {
    const contactMessages = messages?.[contactId] || [];
    return contactMessages?.[contactMessages?.length - 1];
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'busy': return 'bg-warning';
      case 'away': return 'bg-secondary';
      default: return 'bg-muted-foreground';
    }
  };

  const getRoleIcon = (role) => {
    return role === 'Station Master' ? 'Building2' : 'Radio';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="space-y-1 p-2">
      {contacts?.map((contact) => {
        const unreadCount = getUnreadCount(contact?.id);
        const lastMessage = getLastMessage(contact?.id);
        const isActive = activeContact?.id === contact?.id;

        return (
          <div
            key={contact?.id}
            onClick={() => onContactSelect(contact)}
            className={`
              p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-4
              ${isActive 
                ? 'bg-primary/10 border-l-primary' 
                : `hover:bg-muted/50 ${getPriorityColor(contact?.priority)}`
              }
            `}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <Icon 
                    name={getRoleIcon(contact?.role)} 
                    size={20} 
                    className="text-primary"
                  />
                </div>
                {/* Status indicator */}
                <div className={`
                  absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                  ${getStatusColor(contact?.status)}
                `}></div>
              </div>

              {/* Contact info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-foreground truncate">
                    {contact?.name}
                  </div>
                  {lastMessage && (
                    <div className="text-xs text-muted-foreground">
                      {formatTime(lastMessage?.timestamp)}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground truncate">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">{contact?.role}</span>
                      <span>•</span>
                      <span>{contact?.station || contact?.section}</span>
                    </div>
                    {lastMessage && (
                      <div className="mt-1 text-xs truncate text-muted-foreground/80">
                        {lastMessage?.type === 'sent' ? 'You: ' : ''}
                        {lastMessage?.content}
                      </div>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {unreadCount > 0 && (
                    <div className="ml-2 flex-shrink-0">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status text */}
                <div className="mt-1 text-xs text-muted-foreground flex items-center space-x-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(contact?.status)}`}></div>
                  <span className="capitalize">
                    {contact?.status === 'offline' && contact?.lastSeen 
                      ? `Last seen ${contact?.lastSeen}` 
                      : contact?.status
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {contacts?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="Users" size={32} className="mx-auto mb-2 opacity-50" />
          <p>No contacts found</p>
        </div>
      )}
    </div>
  );
};

export default ContactList;