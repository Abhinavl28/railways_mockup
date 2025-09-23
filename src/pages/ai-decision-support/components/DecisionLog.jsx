import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DecisionLog = ({ decisions, onProvideFeedback }) => {
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [filter, setFilter] = useState('all'); // all, accepted, rejected, pending

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-success';
      case 'rejected': return 'text-error';
      case 'pending': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      case 'pending': return 'Clock';
      default: return 'Circle';
    }
  };

  const getOutcomeColor = (outcome) => {
    if (outcome > 0) return 'text-success';
    if (outcome < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const filteredDecisions = decisions?.filter(decision => 
    filter === 'all' || decision?.status === filter
  );

  const handleFeedbackSubmit = (decisionId) => {
    if (feedbackText?.trim()) {
      onProvideFeedback(decisionId, feedbackText);
      setFeedbackText('');
      setSelectedDecision(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 operational-shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Decision Log</h3>
          <p className="text-sm text-muted-foreground">
            Track AI recommendations and outcomes
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground"
          >
            <option value="all">All Decisions</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} />
            Export
          </Button>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredDecisions?.map((decision) => (
          <div key={decision?.id} className="border border-border rounded-lg p-4 bg-background">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-muted/30`}>
                  <Icon 
                    name={getStatusIcon(decision?.status)} 
                    size={16} 
                    className={getStatusColor(decision?.status)}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-foreground">{decision?.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full bg-muted ${getStatusColor(decision?.status)}`}>
                      {decision?.status?.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{decision?.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={12} />
                      <span>{new Date(decision.timestamp)?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="User" size={12} />
                      <span>{decision?.decidedBy}</span>
                    </div>
                    {decision?.outcome !== null && (
                      <div className="flex items-center space-x-1">
                        <Icon name="TrendingUp" size={12} />
                        <span className={getOutcomeColor(decision?.outcome)}>
                          {decision?.outcome > 0 ? '+' : ''}{decision?.outcome}% impact
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {decision?.status === 'accepted' && decision?.outcome === null && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDecision(selectedDecision === decision?.id ? null : decision?.id)}
                  >
                    <Icon name="MessageSquare" size={16} />
                    Feedback
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded Feedback Form */}
            {selectedDecision === decision?.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Provide Feedback on Outcome
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e?.target?.value)}
                      placeholder="How did this recommendation perform? What was the actual impact?"
                      className="w-full text-sm border border-border rounded px-3 py-2 bg-background text-foreground resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDecision(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleFeedbackSubmit(decision?.id)}
                      disabled={!feedbackText?.trim()}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Decision Details */}
            {decision?.details && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Original Prediction:</span>
                    <div className="font-medium">{decision?.details?.originalPrediction}</div>
                  </div>
                  {decision?.details?.actualOutcome && (
                    <div>
                      <span className="text-muted-foreground">Actual Outcome:</span>
                      <div className="font-medium">{decision?.details?.actualOutcome}</div>
                    </div>
                  )}
                </div>
                
                {decision?.details?.reasoning && (
                  <div className="mt-3">
                    <span className="text-muted-foreground text-sm">AI Reasoning:</span>
                    <p className="text-sm text-foreground mt-1">{decision?.details?.reasoning}</p>
                  </div>
                )}
              </div>
            )}

            {/* Feedback History */}
            {decision?.feedback && decision?.feedback?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <h5 className="text-sm font-medium text-foreground mb-2">Feedback History</h5>
                <div className="space-y-2">
                  {decision?.feedback?.map((fb, index) => (
                    <div key={index} className="p-2 bg-muted/30 rounded text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{fb?.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(fb.timestamp)?.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{fb?.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {filteredDecisions?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="text-muted-foreground/50 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-muted-foreground mb-1">No Decisions Found</h4>
          <p className="text-xs text-muted-foreground">
            Decision history will appear here as you interact with AI recommendations
          </p>
        </div>
      )}
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {decisions?.filter(d => d?.status === 'accepted')?.length}
            </div>
            <div className="text-xs text-success">Accepted</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {decisions?.filter(d => d?.status === 'rejected')?.length}
            </div>
            <div className="text-xs text-error">Rejected</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {decisions?.filter(d => d?.outcome > 0)?.length}
            </div>
            <div className="text-xs text-success">Positive Impact</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {Math.round(decisions?.filter(d => d?.status === 'accepted')?.length / Math.max(decisions?.length, 1) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Acceptance Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionLog;