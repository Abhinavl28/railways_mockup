import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ScenarioBuilder = ({ onRunScenario, scenarioResults }) => {
  const [activeScenario, setActiveScenario] = useState('weather');
  const [scenarioParams, setScenarioParams] = useState({
    weather: {
      condition: 'heavy_rain',
      duration: 120,
      affectedSections: ['Section-A', 'Section-B']
    },
    maintenance: {
      location: 'Track-3',
      duration: 240,
      type: 'signal_maintenance'
    },
    disruption: {
      type: 'accident',
      location: 'Station-Central',
      severity: 'high',
      estimatedClearance: 180
    }
  });

  const scenarioTypes = [
    {
      id: 'weather',
      label: 'Weather Impact',
      icon: 'Cloud',
      description: 'Simulate weather-related delays'
    },
    {
      id: 'maintenance',
      label: 'Maintenance Window',
      icon: 'Wrench',
      description: 'Plan maintenance impact'
    },
    {
      id: 'disruption',
      label: 'Service Disruption',
      icon: 'AlertTriangle',
      description: 'Emergency scenario planning'
    }
  ];

  const weatherConditions = [
    { value: 'heavy_rain', label: 'Heavy Rain' },
    { value: 'fog', label: 'Dense Fog' },
    { value: 'snow', label: 'Heavy Snow' },
    { value: 'storm', label: 'Storm' }
  ];

  const maintenanceTypes = [
    { value: 'signal_maintenance', label: 'Signal Maintenance' },
    { value: 'track_repair', label: 'Track Repair' },
    { value: 'bridge_inspection', label: 'Bridge Inspection' },
    { value: 'electrical_work', label: 'Electrical Work' }
  ];

  const disruptionTypes = [
    { value: 'accident', label: 'Accident' },
    { value: 'medical_emergency', label: 'Medical Emergency' },
    { value: 'security_alert', label: 'Security Alert' },
    { value: 'technical_failure', label: 'Technical Failure' }
  ];

  const updateScenarioParam = (key, value) => {
    setScenarioParams(prev => ({
      ...prev,
      [activeScenario]: {
        ...prev?.[activeScenario],
        [key]: value
      }
    }));
  };

  const handleRunScenario = () => {
    const scenario = {
      type: activeScenario,
      params: scenarioParams?.[activeScenario],
      timestamp: new Date()?.toISOString()
    };
    onRunScenario(scenario);
  };

  const renderScenarioForm = () => {
    const params = scenarioParams?.[activeScenario];

    switch (activeScenario) {
      case 'weather':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Weather Condition
              </label>
              <select
                value={params?.condition}
                onChange={(e) => updateScenarioParam('condition', e?.target?.value)}
                className="w-full text-sm border border-border rounded px-3 py-2 bg-background text-foreground"
              >
                {weatherConditions?.map(condition => (
                  <option key={condition?.value} value={condition?.value}>
                    {condition?.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Duration (minutes)"
              type="number"
              value={params?.duration}
              onChange={(e) => updateScenarioParam('duration', parseInt(e?.target?.value))}
              placeholder="120"
            />
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Affected Sections
              </label>
              <div className="space-y-2">
                {['Section-A', 'Section-B', 'Section-C', 'Section-D']?.map(section => (
                  <label key={section} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={params?.affectedSections?.includes(section)}
                      onChange={(e) => {
                        const sections = e?.target?.checked
                          ? [...params?.affectedSections, section]
                          : params?.affectedSections?.filter(s => s !== section);
                        updateScenarioParam('affectedSections', sections);
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-foreground">{section}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-4">
            <Input
              label="Location"
              value={params?.location}
              onChange={(e) => updateScenarioParam('location', e?.target?.value)}
              placeholder="Track-3"
            />
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Maintenance Type
              </label>
              <select
                value={params?.type}
                onChange={(e) => updateScenarioParam('type', e?.target?.value)}
                className="w-full text-sm border border-border rounded px-3 py-2 bg-background text-foreground"
              >
                {maintenanceTypes?.map(type => (
                  <option key={type?.value} value={type?.value}>
                    {type?.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Duration (minutes)"
              type="number"
              value={params?.duration}
              onChange={(e) => updateScenarioParam('duration', parseInt(e?.target?.value))}
              placeholder="240"
            />
          </div>
        );

      case 'disruption':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Disruption Type
              </label>
              <select
                value={params?.type}
                onChange={(e) => updateScenarioParam('type', e?.target?.value)}
                className="w-full text-sm border border-border rounded px-3 py-2 bg-background text-foreground"
              >
                {disruptionTypes?.map(type => (
                  <option key={type?.value} value={type?.value}>
                    {type?.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Location"
              value={params?.location}
              onChange={(e) => updateScenarioParam('location', e?.target?.value)}
              placeholder="Station-Central"
            />
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Severity Level
              </label>
              <select
                value={params?.severity}
                onChange={(e) => updateScenarioParam('severity', e?.target?.value)}
                className="w-full text-sm border border-border rounded px-3 py-2 bg-background text-foreground"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <Input
              label="Estimated Clearance (minutes)"
              type="number"
              value={params?.estimatedClearance}
              onChange={(e) => updateScenarioParam('estimatedClearance', parseInt(e?.target?.value))}
              placeholder="180"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 operational-shadow-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">What-If Scenario Builder</h3>
        <p className="text-sm text-muted-foreground">
          Test operational impacts and optimization strategies
        </p>
      </div>
      {/* Scenario Type Selector */}
      <div className="space-y-3 mb-6">
        {scenarioTypes?.map((scenario) => (
          <button
            key={scenario?.id}
            onClick={() => setActiveScenario(scenario?.id)}
            className={`
              w-full flex items-center space-x-3 p-3 rounded-lg border operational-hover
              ${activeScenario === scenario?.id
                ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background text-foreground hover:bg-muted/50'
              }
            `}
          >
            <Icon name={scenario?.icon} size={20} />
            <div className="text-left">
              <div className="font-medium">{scenario?.label}</div>
              <div className="text-xs opacity-80">{scenario?.description}</div>
            </div>
          </button>
        ))}
      </div>
      {/* Scenario Parameters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-4">Scenario Parameters</h4>
        {renderScenarioForm()}
      </div>
      {/* Run Scenario Button */}
      <Button
        variant="default"
        onClick={handleRunScenario}
        className="w-full mb-6"
      >
        <Icon name="Play" size={16} />
        Run Scenario Analysis
      </Button>
      {/* Results */}
      {scenarioResults && (
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Analysis Results</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground">Affected Trains</div>
                <div className="text-lg font-semibold text-foreground">
                  {scenarioResults?.affectedTrains}
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground">Avg Delay Impact</div>
                <div className="text-lg font-semibold text-warning">
                  +{scenarioResults?.avgDelayImpact}min
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-start space-x-2">
                <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-primary">AI Recommendation</div>
                  <div className="text-sm text-foreground mt-1">
                    {scenarioResults?.recommendation}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Analysis completed at {new Date(scenarioResults.timestamp)?.toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioBuilder;