import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendationsPanel = ({ recommendations, onAcceptRecommendation, onRejectRecommendation }) => {
  const [expandedRec, setExpandedRec] = useState(null);
  const [filter, setFilter] = useState('all'); // all, high, medium, low

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Circle';
    }
  };

  const getImpactColor = (impact) => {
    if (impact > 15) return 'text-success';
    if (impact > 5) return 'text-warning';
    return 'text-muted-foreground';
  };

  const filteredRecommendations = recommendations?.filter(rec => 
    filter === 'all' || rec?.priority === filter
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 operational-shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
          <p className="text-sm text-muted-foreground">
            {filteredRecommendations?.length} active recommendations
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground"
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Icon name="RefreshCw" size={16} />
            Refresh
          </Button>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredRecommendations?.map((rec) => (
          <div key={rec?.id} className="border border-border rounded-lg p-4 bg-background">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-muted/30`}>
                  <Icon 
                    name={getPriorityIcon(rec?.priority)} 
                    size={16} 
                    className={getPriorityColor(rec?.priority)}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-foreground">{rec?.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full bg-muted ${getPriorityColor(rec?.priority)}`}>
                      {rec?.priority?.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{rec?.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{rec?.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="TrendingUp" size={12} />
                      <span className={getImpactColor(rec?.impact)}>
                        +{rec?.impact}% efficiency
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Target" size={12} />
                      <span>{rec?.confidence}% confidence</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedRec(expandedRec === rec?.id ? null : rec?.id)}
                >
                  <Icon name={expandedRec === rec?.id ? "ChevronUp" : "ChevronDown"} size={16} />
                </Button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedRec === rec?.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">Detailed Analysis</h5>
                  <p className="text-sm text-muted-foreground">{rec?.detailedReasoning}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">Impact Assessment</h5>
                  <div className="grid grid-cols-2 gap-4">
                    {rec?.impactMetrics?.map((metric, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{metric?.label}:</span>
                        <span className={`text-sm font-medium ${getImpactColor(metric?.value)}`}>
                          {metric?.value > 0 ? '+' : ''}{metric?.value}{metric?.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {rec?.affectedTrains && (
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Affected Trains</h5>
                    <div className="flex flex-wrap gap-2">
                      {rec?.affectedTrains?.map((train) => (
                        <span key={train} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          {train}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {rec?.prerequisites && (
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Prerequisites</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {rec?.prerequisites?.map((prereq, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Icon name="Check" size={12} className="text-success mt-0.5" />
                          <span>{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Brain" size={12} />
                <span>Generated {rec?.generatedAt}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRejectRecommendation(rec?.id)}
                >
                  <Icon name="X" size={16} />
                  Reject
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onAcceptRecommendation(rec?.id)}
                  className="bg-success hover:bg-success/90"
                >
                  <Icon name="Check" size={16} />
                  Accept
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredRecommendations?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Brain" size={48} className="text-muted-foreground/50 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-muted-foreground mb-1">No Recommendations</h4>
          <p className="text-xs text-muted-foreground">
            AI is analyzing current operations for optimization opportunities
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPanel;