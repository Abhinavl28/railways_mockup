import React from 'react';
import Icon from '../../../components/AppIcon';

const MessageArea = ({ messages, activeContact }) => {
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date?.toDateString() === now?.toDateString();
    
    if (isToday) {
      return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date?.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-transparent';
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages?.forEach(message => {
      const date = new Date(message.timestamp)?.toDateString();
      if (!groups?.[date]) {
        groups[date] = [];
      }
      groups?.[date]?.push(message);
    });
    
    return groups;
  };

  const formatDateGroup = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday?.setDate(yesterday?.getDate() - 1);
    
    if (date?.toDateString() === now?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    } else {
      return date?.toLocaleDateString([], { 
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="p-4 space-y-4">
      {Object.keys(messageGroups)?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="MessageCircle" size={32} className="mx-auto mb-2 opacity-50" />
          <p>No messages yet</p>
          <p className="text-sm mt-1">Start a conversation with {activeContact?.name}</p>
        </div>
      ) : (
        Object.keys(messageGroups)?.map(dateGroup => (
          <div key={dateGroup}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                {formatDateGroup(dateGroup)}
              </div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-3">
              {messageGroups?.[dateGroup]?.map((message) => (
                <div
                  key={message?.id}
                  className={`flex ${message?.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-xs lg:max-w-md px-4 py-3 rounded-2xl border-l-4
                      ${message?.type === 'sent' ?'bg-primary text-primary-foreground ml-4'
                        : message?.type === 'emergency' ?'bg-destructive text-destructive-foreground border-l-destructive'
                          : `bg-muted text-foreground mr-4 ${getPriorityColor(message?.priority)}`
                      }
                    `}
                  >
                    {/* Message header for received messages */}
                    {message?.type === 'received' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-semibold text-primary">
                          {message?.senderName}
                        </span>
                        {message?.priority !== 'normal' && (
                          <div className={`
                            px-2 py-0.5 rounded-full text-xs font-medium
                            ${message?.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                              message?.priority === 'high'? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                            }
                          `}>
                            {message?.priority?.toUpperCase()}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Emergency broadcast indicator */}
                    {message?.broadcast && (
                      <div className="flex items-center space-x-1 mb-2 text-xs">
                        <Icon name="Radio" size={12} />
                        <span className="font-medium">BROADCAST MESSAGE</span>
                      </div>
                    )}

                    {/* Message content */}
                    <div className="text-sm leading-relaxed break-words">
                      {message?.content}
                    </div>

                    {/* Attachments */}
                    {message?.attachments && message?.attachments?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message?.attachments?.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-2 bg-white/10 rounded border"
                          >
                            <Icon name="Paperclip" size={14} />
                            <span className="text-xs truncate">{attachment?.name}</span>
                            <button className="text-xs underline">Download</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message footer */}
                    <div className={`
                      flex items-center justify-end space-x-2 mt-2 text-xs
                      ${message?.type === 'sent' ?'text-primary-foreground/70' :'text-muted-foreground'
                      }
                    `}>
                      <span>{formatTimestamp(message?.timestamp)}</span>
                      {message?.type === 'sent' && (
                        <div className="flex items-center space-x-1">
                          {message?.read ? (
                            <div className="flex items-center">
                              <Icon name="CheckCheck" size={12} className="text-success" />
                            </div>
                          ) : (
                            <Icon name="Check" size={12} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageArea;