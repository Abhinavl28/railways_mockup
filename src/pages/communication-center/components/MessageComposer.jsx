import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageComposer = ({ onSendMessage, templates, activeContact }) => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [showTemplates, setShowTemplates] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const priorityOptions = [
    { value: 'normal', label: 'Normal', color: 'text-muted-foreground' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'emergency', label: 'Emergency', color: 'text-red-600' }
  ];

  const handleSend = () => {
    if (message?.trim() || attachments?.length > 0) {
      onSendMessage(message, priority, attachments);
      setMessage('');
      setPriority('normal');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSend();
    }
  };

  const handleTemplateSelect = (template) => {
    setMessage(template?.content);
    setShowTemplates(false);
    
    // Set priority based on template category
    if (template?.category === 'Emergency') {
      setPriority('emergency');
    } else if (template?.category === 'Operations') {
      setPriority('high');
    } else {
      setPriority('medium');
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    const newAttachments = files?.map(file => ({
      id: `att-${Date.now()}-${Math.random()}`,
      name: file?.name,
      size: file?.size,
      type: file?.type,
      file
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev?.filter(att => att?.id !== attachmentId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return 'Image';
    if (type === 'application/pdf') return 'FileText';
    if (type?.includes('document') || type?.includes('word')) return 'FileText';
    if (type?.includes('spreadsheet') || type?.includes('excel')) return 'Table';
    return 'File';
  };

  const groupedTemplates = templates?.reduce((acc, template) => {
    if (!acc?.[template?.category]) {
      acc[template.category] = [];
    }
    acc?.[template?.category]?.push(template);
    return acc;
  }, {});

  return (
    <div className="p-4">
      {/* Templates Dropdown */}
      {showTemplates && (
        <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground">Message Templates</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTemplates(false)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
          
          <div className="space-y-3">
            {Object.entries(groupedTemplates)?.map(([category, categoryTemplates]) => (
              <div key={category}>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {category}
                </div>
                <div className="space-y-1">
                  {categoryTemplates?.map(template => (
                    <button
                      key={template?.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full text-left p-2 hover:bg-muted rounded text-sm transition-colors"
                    >
                      <div className="font-medium text-foreground">{template?.title}</div>
                      <div className="text-muted-foreground text-xs mt-1 truncate">
                        {template?.content}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Attachments */}
      {attachments?.length > 0 && (
        <div className="mb-3 space-y-2">
          {attachments?.map(attachment => (
            <div
              key={attachment?.id}
              className="flex items-center space-x-2 p-2 bg-muted/30 rounded border"
            >
              <Icon name={getFileIcon(attachment?.type)} size={16} className="text-primary" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {attachment?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(attachment?.size)}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAttachment(attachment?.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
      {/* Message Input */}
      <div className="flex items-end space-x-3">
        {/* Left controls */}
        <div className="flex items-center space-x-2">
          {/* Templates button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="MessageSquare" size={18} />
          </Button>

          {/* Attachment button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef?.current?.click()}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="Paperclip" size={18} />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="*/*"
          />

          {/* Priority selector */}
          <select
            value={priority}
            onChange={(e) => setPriority(e?.target?.value)}
            className={`
              text-sm border border-border rounded px-2 py-1 bg-background
              ${priorityOptions?.find(p => p?.value === priority)?.color || 'text-foreground'}
            `}
          >
            {priorityOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Message textarea */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e?.target?.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${activeContact?.name}...`}
            className="w-full min-h-[40px] max-h-32 p-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            rows={1}
          />
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!message?.trim() && attachments?.length === 0}
          className="px-4"
        >
          <Icon name="Send" size={18} />
        </Button>
      </div>
      {/* Quick actions */}
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={12} />
          <span>Real-time delivery</span>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;