import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TrainSelector = ({ selectedTrain, onTrainSelect, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const trainOptions = [
    { value: 'T12345', label: 'Express 12345 - Mumbai to Delhi' },
    { value: 'T12346', label: 'Rajdhani 12346 - Delhi to Kolkata' },
    { value: 'T12347', label: 'Shatabdi 12347 - Chennai to Bangalore' },
    { value: 'T12348', label: 'Duronto 12348 - Pune to Ahmedabad' },
    { value: 'T12349', label: 'Garib Rath 12349 - Hyderabad to Vijayawada' },
    { value: 'T12350', label: 'Jan Shatabdi 12350 - Lucknow to Kanpur' }
  ];

  const routeOptions = [
    { value: '', label: 'All Routes' },
    { value: 'mumbai-delhi', label: 'Mumbai - Delhi' },
    { value: 'delhi-kolkata', label: 'Delhi - Kolkata' },
    { value: 'chennai-bangalore', label: 'Chennai - Bangalore' },
    { value: 'pune-ahmedabad', label: 'Pune - Ahmedabad' }
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'express', label: 'Express' },
    { value: 'rajdhani', label: 'Rajdhani' },
    { value: 'shatabdi', label: 'Shatabdi' },
    { value: 'duronto', label: 'Duronto' },
    { value: 'garib-rath', label: 'Garib Rath' }
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e?.target?.value);
    onFilterChange({ search: e?.target?.value, route: selectedRoute, type: selectedType });
  };

  const handleRouteChange = (value) => {
    setSelectedRoute(value);
    onFilterChange({ search: searchTerm, route: value, type: selectedType });
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    onFilterChange({ search: searchTerm, route: selectedRoute, type: value });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 operational-shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Train" size={20} className="text-primary" />
          <span>Train Selection & Filters</span>
        </h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <Select
            label="Select Train"
            placeholder="Choose a train to analyze"
            options={trainOptions}
            value={selectedTrain}
            onChange={onTrainSelect}
            searchable
            className="w-full"
          />
        </div>

        <div>
          <Select
            label="Route Filter"
            placeholder="Filter by route"
            options={routeOptions}
            value={selectedRoute}
            onChange={handleRouteChange}
            className="w-full"
          />
        </div>

        <div>
          <Select
            label="Train Type"
            placeholder="Filter by type"
            options={typeOptions}
            value={selectedType}
            onChange={handleTypeChange}
            className="w-full"
          />
        </div>
      </div>
      <div className="mt-4">
        <Input
          label="Search Trains"
          type="search"
          placeholder="Search by train number, name, or route..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>
      {selectedTrain && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Train" size={20} color="white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  {trainOptions?.find(t => t?.value === selectedTrain)?.label}
                </h4>
                <p className="text-sm text-muted-foreground">Currently analyzing</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full status-pulse"></div>
              <span className="text-sm text-success font-medium">Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainSelector;