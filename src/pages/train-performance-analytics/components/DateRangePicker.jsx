import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DateRangePicker = ({ dateRange, onDateRangeChange, comparisonMode, onComparisonToggle }) => {
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const presetRanges = [
    { label: 'Today', value: 'today', days: 0 },
    { label: 'Last 7 days', value: 'week', days: 7 },
    { label: 'Last 30 days', value: 'month', days: 30 },
    { label: 'Last 90 days', value: 'quarter', days: 90 },
    { label: 'Custom Range', value: 'custom', days: null }
  ];

  const handlePresetSelect = (preset) => {
    if (preset?.value === 'custom') {
      setIsCustomRange(true);
      return;
    }

    setIsCustomRange(false);
    const endDate = new Date();
    const startDate = new Date();
    
    if (preset?.days > 0) {
      startDate?.setDate(endDate?.getDate() - preset?.days);
    }

    onDateRangeChange({
      start: startDate,
      end: endDate,
      preset: preset?.value
    });
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      onDateRangeChange({
        start: new Date(startDate),
        end: new Date(endDate),
        preset: 'custom'
      });
    }
  };

  const formatDateRange = () => {
    if (!dateRange?.start || !dateRange?.end) return 'Select date range';
    
    const start = dateRange?.start?.toLocaleDateString();
    const end = dateRange?.end?.toLocaleDateString();
    
    if (start === end) return start;
    return `${start} - ${end}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 operational-shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-primary" />
          <span>Analysis Period</span>
        </h3>
        
        <Button
          variant={comparisonMode ? "default" : "outline"}
          size="sm"
          onClick={onComparisonToggle}
          iconName="BarChart3"
          iconPosition="left"
        >
          Compare Periods
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {presetRanges?.map((preset) => (
            <Button
              key={preset?.value}
              variant={dateRange?.preset === preset?.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetSelect(preset)}
              className="text-xs"
            >
              {preset?.label}
            </Button>
          ))}
        </div>

        {isCustomRange && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e?.target?.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e?.target?.value)}
            />
            <div className="md:col-span-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleCustomDateChange}
                disabled={!startDate || !endDate}
                iconName="Check"
                iconPosition="left"
              >
                Apply Custom Range
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CalendarDays" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Selected Period:
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDateRange()}
          </span>
        </div>

        {comparisonMode && (
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">
                Comparison Mode Active
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Performance metrics will be compared with the previous equivalent period for trend analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;