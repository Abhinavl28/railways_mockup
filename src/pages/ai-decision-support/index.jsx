import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ContextBreadcrumb from '../../components/ui/ContextBreadcrumb';
import EmergencyAlert from '../../components/ui/EmergencyAlert';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PredictiveMetricsCard from './components/PredictiveMetricsCard';
import ScheduleGanttChart from './components/ScheduleGanttChart';
import RecommendationsPanel from './components/RecommendationsPanel';
import ScenarioBuilder from './components/ScenarioBuilder';
import DecisionLog from './components/DecisionLog';
import TrainSimulationMap from './components/TrainSimulationMap';

const AIDecisionSupport = () => {
  const [predictionHorizon, setPredictionHorizon] = useState('2h');
  const [activeAlert, setActiveAlert] = useState(null);
  const [scenarioResults, setScenarioResults] = useState(null);

  // Mock data for predictive metrics
  const predictiveMetrics = [
    {
      title: "Predicted Delays",
      value: "12",
      unit: "trains",
      confidence: 87,
      trend: -15,
      icon: "Clock",
      color: "warning",
      description: "Expected delays in next 2 hours"
    },
    {
      title: "Optimization Opportunities",
      value: "8",
      unit: "routes",
      confidence: 92,
      trend: 23,
      icon: "Zap",
      color: "success",
      description: "Routes with improvement potential"
    },
    {
      title: "Conflict Probability",
      value: "3.2",
      unit: "%",
      confidence: 78,
      trend: -8,
      icon: "AlertTriangle",
      color: "error",
      description: "Risk of scheduling conflicts"
    },
    {
      title: "System Efficiency",
      value: "94.7",
      unit: "%",
      confidence: 95,
      trend: 5,
      icon: "TrendingUp",
      color: "primary",
      description: "Overall operational efficiency"
    }
  ];

  // Mock data for schedule optimization
  const scheduleData = [
    {
      id: "T001",
      trainNumber: "EXP-2401",
      route: "Central → North",
      originalStart: "08:15",
      originalEnd: "10:45",
      optimizedStart: "08:20",
      optimizedEnd: "10:40",
      duration: 150,
      originalStatus: "delayed",
      timeSaved: 5,
      hasConflict: false,
      recommendation: "Adjust departure by 5 minutes to optimize track utilization and reduce overall journey time.",
      conflicts: []
    },
    {
      id: "T002",
      trainNumber: "LOC-1205",
      route: "East → West",
      originalStart: "09:30",
      originalEnd: "11:15",
      optimizedStart: "09:25",
      optimizedEnd: "11:10",
      duration: 105,
      originalStatus: "on-time",
      timeSaved: 10,
      hasConflict: true,
      recommendation: "Early departure recommended to avoid predicted congestion at Junction-B.",
      conflicts: [
        {
          start: "10:15",
          duration: 15,
          reason: "Track maintenance overlap"
        }
      ]
    },
    {
      id: "T003",
      trainNumber: "FRT-8901",
      route: "South → Central",
      originalStart: "10:00",
      originalEnd: "12:30",
      optimizedStart: "10:10",
      optimizedEnd: "12:25",
      duration: 150,
      originalStatus: "critical",
      timeSaved: 15,
      hasConflict: false,
      recommendation: "Route via alternative track to bypass congested main line.",
      conflicts: []
    }
  ];

  // Mock data for AI recommendations
  const recommendations = [
    {
      id: "REC001",
      title: "Platform Reallocation Optimization",
      description: "Reallocate Platform 3 to reduce passenger transfer time and improve throughput.",
      priority: "high",
      confidence: 89,
      impact: 18,
      estimatedTime: "15 min",
      generatedAt: "2 min ago",
      detailedReasoning: "Analysis of passenger flow patterns indicates that reallocating EXP-2401 from Platform 2 to Platform 3 will reduce average transfer time by 3.2 minutes and increase platform utilization efficiency by 18%. This change affects 847 passengers with connecting services.",
      impactMetrics: [
        { label: "Transfer Time", value: -3.2, unit: "min" },
        { label: "Platform Utilization", value: 18, unit: "%" },
        { label: "Passenger Satisfaction", value: 12, unit: "%" },
        { label: "Throughput", value: 8, unit: "%" }
      ],
      affectedTrains: ["EXP-2401", "LOC-1205", "FRT-8901"],
      prerequisites: [
        "Platform 3 cleaning completion",
        "Signal system reconfiguration",
        "Passenger announcement updates"
      ]
    },
    {
      id: "REC002",
      title: "Dynamic Speed Adjustment",
      description: "Implement speed optimization for trains approaching Junction-B to prevent bottlenecks.",
      priority: "medium",
      confidence: 76,
      impact: 12,
      estimatedTime: "5 min",
      generatedAt: "5 min ago",
      detailedReasoning: "Predictive models show 73% probability of congestion at Junction-B between 10:15-10:45. Reducing approach speeds by 8% for affected trains will smooth traffic flow and prevent cascade delays.",
      impactMetrics: [
        { label: "Junction Throughput", value: 12, unit: "%" },
        { label: "Delay Prevention", value: 8, unit: "min" },
        { label: "Energy Efficiency", value: 5, unit: "%" }
      ],
      affectedTrains: ["EXP-2401", "LOC-1205"],
      prerequisites: [
        "Speed control system activation",
        "Driver notification system ready"
      ]
    },
    {
      id: "REC003",
      title: "Maintenance Window Optimization",
      description: "Reschedule Track-7 maintenance to minimize service disruption during peak hours.",
      priority: "low",
      confidence: 82,
      impact: 6,
      estimatedTime: "30 min",
      generatedAt: "12 min ago",
      detailedReasoning: "Current maintenance schedule conflicts with 3 high-priority services. Shifting window by 45 minutes reduces affected services to 1 freight train with minimal passenger impact.",
      impactMetrics: [
        { label: "Service Disruption", value: -67, unit: "%" },
        { label: "Passenger Impact", value: -89, unit: "%" },
        { label: "Maintenance Efficiency", value: 3, unit: "%" }
      ],
      affectedTrains: ["FRT-8901"],
      prerequisites: [
        "Maintenance crew availability confirmation",
        "Equipment readiness check"
      ]
    }
  ];

  // Mock data for decision log
  const decisions = [
    {
      id: "DEC001",
      title: "Emergency Route Diversion",
      description: "Diverted EXP-2401 via alternative route due to signal failure",
      status: "accepted",
      timestamp: "2024-01-15T08:30:00Z",
      decidedBy: "Controller Smith",
      outcome: 12,
      details: {
        originalPrediction: "15 min delay expected",
        actualOutcome: "8 min delay achieved",
        reasoning: "Signal failure at Junction-A required immediate rerouting. AI recommended Route-B with 85% confidence."
      },
      feedback: [
        {
          author: "Controller Smith",
          timestamp: "2024-01-15T10:15:00Z",
          comment: "Excellent recommendation. Route-B was clear and passengers were informed promptly. Better outcome than predicted."
        }
      ]
    },
    {
      id: "DEC002",
      title: "Platform Capacity Optimization",
      description: "Rejected platform reallocation during peak hours",
      status: "rejected",
      timestamp: "2024-01-15T07:45:00Z",
      decidedBy: "Station Master Johnson",
      outcome: null,
      details: {
        originalPrediction: "8% throughput improvement",
        reasoning: "AI suggested reallocating Platform 1 to reduce congestion, but operational constraints made implementation risky."
      },
      feedback: []
    },
    {
      id: "DEC003",
      title: "Speed Optimization Protocol",
      description: "Implemented dynamic speed adjustments for Junction-B approach",
      status: "accepted",
      timestamp: "2024-01-15T09:20:00Z",
      decidedBy: "Controller Davis",
      outcome: 8,
      details: {
        originalPrediction: "12% junction efficiency improvement",
        actualOutcome: "8% improvement achieved",
        reasoning: "Predictive model identified congestion risk. Speed reduction protocol activated for 3 approaching trains."
      },
      feedback: []
    }
  ];

  const predictionHorizons = [
    { value: '2h', label: 'Next 2 hours' },
    { value: '4h', label: 'Next 4 hours' },
    { value: '8h', label: 'Next 8 hours' },
    { value: '24h', label: 'Next 24 hours' }
  ];

  useEffect(() => {
    // Simulate periodic updates
    const interval = setInterval(() => {
      // Update metrics or trigger alerts based on conditions
      if (Math.random() > 0.95) {
        setActiveAlert({
          level: 'warning',
          title: 'AI Model Update Available',
          message: 'New optimization model with 3.2% improved accuracy is ready for deployment.',
          timestamp: new Date()?.toISOString(),
          dismissible: true
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAcceptRecommendation = (recommendationId) => {
    console.log('Accepting recommendation:', recommendationId);
    // Implementation would update recommendation status and trigger actions
  };

  const handleRejectRecommendation = (recommendationId) => {
    console.log('Rejecting recommendation:', recommendationId);
    // Implementation would log rejection and update AI learning
  };

  const handleRunScenario = (scenario) => {
    console.log('Running scenario:', scenario);
    
    // Simulate scenario analysis
    setTimeout(() => {
      setScenarioResults({
        affectedTrains: Math.floor(Math.random() * 15) + 5,
        avgDelayImpact: Math.floor(Math.random() * 20) + 5,
        recommendation: "Implement alternative routing via Track-B and adjust departure times by 5-10 minutes to minimize impact. Consider passenger notifications 15 minutes before implementation.",
        timestamp: new Date()?.toISOString()
      });
    }, 2000);
  };

  const handleProvideFeedback = (decisionId, feedback) => {
    console.log('Providing feedback for decision:', decisionId, feedback);
    // Implementation would store feedback for AI learning
  };

  const handleRefreshIntegration = (integrationId) => {
    console.log('Refreshing integration:', integrationId);
    // Implementation would refresh specific integration
  };

  const handleSimulationComplete = (results) => {
    console.log('Simulation completed:', results);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyAlert 
        alert={activeAlert} 
        onDismiss={() => setActiveAlert(null)} 
      />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <ContextBreadcrumb />
        
        {/* Page Header with highlighted headings */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2 border-l-4 border-primary pl-4">
              AI Decision Support
            </h1>
            <p className="text-muted-foreground ml-6">
              Intelligent scheduling optimization and predictive analytics for proactive operations management
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Prediction Horizon Selector */}
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <select
                value={predictionHorizon}
                onChange={(e) => setPredictionHorizon(e?.target?.value)}
                className="text-sm border border-border rounded px-3 py-2 bg-background text-foreground"
              >
                {predictionHorizons?.map(horizon => (
                  <option key={horizon?.value} value={horizon?.value}>
                    {horizon?.label}
                  </option>
                ))}
              </select>
            </div>
            
            <Button variant="outline">
              <Icon name="Settings" size={16} />
              Configure
            </Button>
          </div>
        </div>

        {/* Predictive Metrics Row with highlighted heading */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
            Predictive Analytics Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {predictiveMetrics?.map((metric, index) => (
              <PredictiveMetricsCard key={index} {...metric} />
            ))}
          </div>
        </div>

        {/* Main Analysis Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Schedule Gantt Chart - 2 columns */}
          <div className="xl:col-span-2">
            <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
              Schedule Optimization Analysis
            </h2>
            <ScheduleGanttChart 
              scheduleData={scheduleData}
              onAcceptRecommendation={handleAcceptRecommendation}
            />
          </div>
          
          {/* AI Recommendations Panel - 1 column */}
          <div className="xl:col-span-1">
            <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
              AI Recommendations
            </h2>
            <RecommendationsPanel 
              recommendations={recommendations}
              onAcceptRecommendation={handleAcceptRecommendation}
              onRejectRecommendation={handleRejectRecommendation}
            />
          </div>
        </div>

        {/* What-If Scenario Builder and Decision Log */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
              What-If Scenario Builder
            </h2>
            <ScenarioBuilder 
              onRunScenario={handleRunScenario}
              scenarioResults={scenarioResults}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
              Decision Log & Feedback
            </h2>
            <DecisionLog 
              decisions={decisions}
              onProvideFeedback={handleProvideFeedback}
            />
          </div>
        </div>

        {/* Train Simulation Map - New fast-forward visualization */}
        <div className="mb-8">
          <TrainSimulationMap 
            scenarioData={scenarioResults}
            onSimulationComplete={handleSimulationComplete}
          />
        </div>
      </main>
    </div>
  );
};

export default AIDecisionSupport;