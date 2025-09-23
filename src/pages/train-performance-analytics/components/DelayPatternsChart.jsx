import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DelayPatternsChart = ({ selectedTrain, dateRange }) => {
  const [chartType, setChartType] = useState('combined');
  const [timeGranularity, setTimeGranularity] = useState('hourly');

  const mockData = [
    { time: '00:00', delayMinutes: 2, cumulativeDelay: 2, onTimePercentage: 95 },
    { time: '02:00', delayMinutes: 5, cumulativeDelay: 7, onTimePercentage: 88 },
    { time: '04:00', delayMinutes: 3, cumulativeDelay: 10, onTimePercentage: 92 },
    { time: '06:00', delayMinutes: 8, cumulativeDelay: 18, onTimePercentage: 75 },
    { time: '08:00', delayMinutes: 12, cumulativeDelay: 30, onTimePercentage: 65 },
    { time: '10:00', delayMinutes: 15, cumulativeDelay: 45, onTimePercentage: 58 },
    { time: '12:00', delayMinutes: 18, cumulativeDelay: 63, onTimePercentage: 52 },
    { time: '14:00', delayMinutes: 22, cumulativeDelay: 85, onTimePercentage: 45 },
    { time: '16:00', delayMinutes: 25, cumulativeDelay: 110, onTimePercentage: 38 },
    { time: '18:00', delayMinutes: 20, cumulativeDelay: 130, onTimePercentage: 42 },
    { time: '20:00', delayMinutes: 16, cumulativeDelay: 146, onTimePercentage: 48 },
    { time: '22:00', delayMinutes: 10, cumulativeDelay: 156, onTimePercentage: 62 }
  ];

  const chartTypeOptions = [
    { value: 'combined', label: 'Combined View' },
    { value: 'bar', label: 'Bar Chart Only' },
    { value: 'line', label: 'Line Chart Only' }
  ];

  const granularityOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 operational-shadow-modal">
          <p className="font-medium text-foreground mb-2">{`Time: ${label}`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value}${entry?.name?.includes('Percentage') ? '%' : ' min'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: mockData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="delayMinutes" 
              fill="var(--color-error)" 
              name="Delay Minutes"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cumulativeDelay" 
              stroke="var(--color-warning)" 
              strokeWidth={3}
              name="Cumulative Delay"
              dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );

      default:
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="delayMinutes" 
              fill="var(--color-error)" 
              name="Delay Minutes"
              radius={[2, 2, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="cumulativeDelay" 
              stroke="var(--color-warning)" 
              strokeWidth={3}
              name="Cumulative Delay"
              dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        );
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 operational-shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Delay Patterns Analysis
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            options={granularityOptions}
            value={timeGranularity}
            onChange={setTimeGranularity}
            className="w-32"
          />
          
          <Select
            options={chartTypeOptions}
            value={chartType}
            onChange={setChartType}
            className="w-40"
          />

          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
      {!selectedTrain ? (
        <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
          <div className="text-center">
            <Icon name="Train" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select a train to view delay patterns</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                Analyzing: {selectedTrain}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-error rounded"></div>
                <span>Delay Minutes</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-warning rounded"></div>
                <span>Cumulative Delay</span>
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-error">
                {mockData?.reduce((sum, item) => sum + item?.delayMinutes, 0)} min
              </div>
              <div className="text-sm text-muted-foreground">Total Delays</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {Math.max(...mockData?.map(item => item?.cumulativeDelay))} min
              </div>
              <div className="text-sm text-muted-foreground">Peak Cumulative</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(mockData?.reduce((sum, item) => sum + item?.onTimePercentage, 0) / mockData?.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg On-Time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DelayPatternsChart;