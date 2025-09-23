import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ContextBreadcrumb from '../../components/ui/ContextBreadcrumb';
import EmergencyAlert from '../../components/ui/EmergencyAlert';
import StationSelector from './components/StationSelector';
import StatusMetrics from './components/StatusMetrics';
import ShiftControls from './components/ShiftControls';
import StationLayout from './components/StationLayout';
import ScheduleTable from './components/ScheduleTable';
import ArrivalDepartureBoard from './components/ArrivalDepartureBoard';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const StationManagementHub = () => {
  const [selectedStation, setSelectedStation] = useState('CENTRAL-01');
  const [currentShift, setCurrentShift] = useState({
    id: 'SHIFT-A-DAY',
    name: 'Day Shift A',
    start: '06:00',
    end: '14:00',
    stationMaster: 'Robert Johnson',
    assistants: ['Alice Brown', 'Michael Davis'],
    status: 'active'
  });
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock data for stations - Add this block
  const stations = [
    {
      id: 'CENTRAL-01',
      name: 'Central Railway Station',
      code: 'CRS',
      platforms: 12,
      activeTrains: 8,
      capacity: 2500,
      currentOccupancy: 1847,
      status: 'operational'
    },
    {
      id: 'JUNCTION-02',
      name: 'Junction Railway Station',
      code: 'JRS',
      platforms: 8,
      activeTrains: 5,
      capacity: 1800,
      currentOccupancy: 1200,
      status: 'operational'
    }
  ];

  // Mock data for platforms - Add this block
  const platforms = [
    { id: 'P1A', name: 'Platform 1A', status: 'occupied', trainId: 'T001' },
    { id: 'P1B', name: 'Platform 1B', status: 'occupied', trainId: 'T002' },
    { id: 'P2A', name: 'Platform 2A', status: 'available' },
    { id: 'P2B', name: 'Platform 2B', status: 'maintenance' },
    { id: 'P3A', name: 'Platform 3A', status: 'available' },
    { id: 'P3B', name: 'Platform 3B', status: 'occupied', trainId: 'T003' }
  ];

  // Mock data for station
  const stationData = {
    id: 'CENTRAL-01',
    name: 'Central Railway Station',
    code: 'CRS',
    platforms: 12,
    activeTrains: 8,
    capacity: 2500,
    currentOccupancy: 1847,
    status: 'operational',
    weather: {
      condition: 'Clear',
      temperature: 24,
      visibility: 'Good',
      wind: 'Light'
    }
  };

  // Mock data for metrics
  const metricsData = {
    platformUtilization: 78.5,
    passengerFlow: 1847,
    onTimePerformance: 85.2,
    averageDelay: 8.3,
    activeAlerts: 3,
    maintenanceItems: 2
  };

  // Mock data for trains
  const trains = [
    {
      id: 'T001',
      number: '12345',
      destination: 'Mumbai Central',
      platformId: 'P1A',
      arrivalTime: '14:30',
      status: 'delayed',
      delay: 15
    },
    {
      id: 'T002',
      number: '67890',
      destination: 'Delhi Junction',
      platformId: 'P1B',
      arrivalTime: '15:15',
      status: 'ontime'
    },
    {
      id: 'T003',
      number: '11223',
      destination: 'Chennai Express',
      platformId: 'P3B',
      arrivalTime: '16:00',
      status: 'early'
    }
  ];

  // Mock data for schedules
  const schedules = [
    {
      id: 'S001',
      trainNumber: '12345',
      trainType: 'Express',
      scheduledTime: '14:30',
      actualTime: '14:45',
      platform: '1A',
      origin: 'New Delhi',
      destination: 'Mumbai Central',
      distance: 1384,
      duration: '16h 30m',
      expectedLoad: 85,
      status: 'delayed',
      delay: 15,
      conflicts: 2,
      platformReassigned: false
    },
    {
      id: 'S002',
      trainNumber: '67890',
      trainType: 'Superfast',
      scheduledTime: '15:15',
      actualTime: '15:15',
      platform: '1B',
      origin: 'Kolkata',
      destination: 'Delhi Junction',
      distance: 1472,
      duration: '17h 45m',
      expectedLoad: 92,
      status: 'ontime',
      conflicts: 0,
      platformReassigned: false
    },
    {
      id: 'S003',
      trainNumber: '11223',
      trainType: 'Mail',
      scheduledTime: '16:00',
      actualTime: '15:55',
      platform: '3B',
      origin: 'Bangalore',
      destination: 'Chennai Express',
      distance: 346,
      duration: '6h 15m',
      expectedLoad: 67,
      status: 'early',
      early: 5,
      conflicts: 1,
      platformReassigned: true
    },
    {
      id: 'S004',
      trainNumber: '44556',
      trainType: 'Passenger',
      scheduledTime: '16:30',
      platform: '2A',
      origin: 'Pune',
      destination: 'Nashik Road',
      distance: 210,
      duration: '4h 20m',
      expectedLoad: 45,
      status: 'ontime',
      conflicts: 0,
      platformReassigned: false
    }
  ];

  // Mock data for arrivals
  const arrivals = [
    {
      id: 'A001',
      trainNumber: '12345',
      trainType: 'Express',
      scheduledTime: '14:30',
      actualTime: '14:45',
      origin: 'New Delhi',
      via: 'Agra, Jhansi',
      platform: '1A',
      status: 'delayed',
      delay: 15,
      coaches: 24,
      expectedLoad: 85
    },
    {
      id: 'A002',
      trainNumber: '67890',
      trainType: 'Superfast',
      scheduledTime: '15:15',
      origin: 'Kolkata',
      via: 'Dhanbad, Gaya',
      platform: '1B',
      status: 'ontime',
      coaches: 22,
      expectedLoad: 92
    },
    {
      id: 'A003',
      trainNumber: '11223',
      trainType: 'Mail',
      scheduledTime: '16:00',
      actualTime: '15:55',
      origin: 'Bangalore',
      platform: '3B',
      status: 'early',
      early: 5,
      coaches: 18,
      expectedLoad: 67
    }
  ];

  // Mock data for departures
  const departures = [
    {
      id: 'D001',
      trainNumber: '98765',
      trainType: 'Express',
      scheduledTime: '17:00',
      destination: 'Hyderabad',
      via: 'Nagpur, Wardha',
      platform: '2B',
      status: 'boarding',
      coaches: 20,
      expectedLoad: 78
    },
    {
      id: 'D002',
      trainNumber: '54321',
      trainType: 'Superfast',
      scheduledTime: '17:30',
      destination: 'Ahmedabad',
      via: 'Vadodara, Surat',
      platform: '4A',
      status: 'ontime',
      coaches: 16,
      expectedLoad: 65
    },
    {
      id: 'D003',
      trainNumber: '77889',
      trainType: 'Passenger',
      scheduledTime: '18:15',
      destination: 'Nashik Road',
      platform: '2A',
      status: 'delayed',
      delay: 10,
      coaches: 12,
      expectedLoad: 45
    }
  ];

  // Mock data for maintenance requests
  const maintenanceRequests = [
    {
      id: 'MR001',
      platform: '3A',
      issue: 'Signal malfunction on track T3',
      priority: 'high',
      reportedTime: '13:45'
    },
    {
      id: 'MR002',
      platform: '5B',
      issue: 'Platform lighting requires replacement',
      priority: 'medium',
      reportedTime: '12:30'
    },
    {
      id: 'MR003',
      platform: '2A',
      issue: 'Announcement system crackling',
      priority: 'low',
      reportedTime: '11:15'
    }
  ];

  // Mock data for emergency contacts
  const emergencyContacts = [
    { id: 'EC001', name: 'Fire Department', number: '101', icon: 'Flame' },
    { id: 'EC002', name: 'Medical Emergency', number: '108', icon: 'Heart' },
    { id: 'EC003', name: 'Police Control', number: '100', icon: 'Shield' },
    { id: 'EC004', name: 'Railway Security', number: '182', icon: 'ShieldCheck' }
  ];

  // Mock initial messages
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const alertTimer = setTimeout(() => {
      setEmergencyAlert({
        level: 'warning',
        title: 'Platform Congestion Alert',
        message: 'Platform 7 approaching capacity limit. Consider crowd management measures.',
        location: 'Platform 7 - Central Station',
        timestamp: new Date(),
        actionLabel: 'View Platform',
        onAction: () => {
          console.log('Navigate to Platform 7');
          setEmergencyAlert(null);
        },
        dismissible: true
      });
    }, 5000);

    return () => clearTimeout(alertTimer);
  }, []);

  const handleStationChange = (stationId) => {
    setSelectedStation(stationId);
  };

  const handleShiftHandover = (newShift) => {
    setCurrentShift(newShift);
  };

  const handleShiftChange = (shift) => {
    setCurrentShift(shift);
  };

  const handlePlatformClick = (platformId) => {
    console.log('Platform clicked:', platformId);
  };

  const handleTrainClick = (trainId) => {
    console.log('Train clicked:', trainId);
  };

  const handleViewChange = (view) => {
    console.log('View changed:', view);
  };

  const handlePlatformReassign = (trainId, fromPlatform, toPlatform) => {
    console.log(`Reassigning train ${trainId} from platform ${fromPlatform} to ${toPlatform}`);
  };

  const handleEmergencyProtocol = (protocolType) => {
    console.log('Emergency protocol activated:', protocolType);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyAlert 
        alert={emergencyAlert} 
        onDismiss={() => setEmergencyAlert(null)} 
      />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <ContextBreadcrumb />
        
        {/* Page Header with highlighted headings */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary border-l-4 border-primary pl-4">
                Station Management Hub
              </h1>
              <p className="text-muted-foreground mt-1 ml-6">
                Comprehensive station operations and platform management coordination
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdate?.toLocaleTimeString()}
            </div>
            <Button variant="outline" onClick={handleEmergencyProtocol}>
              <Icon name="AlertTriangle" size={16} />
              Emergency
            </Button>
            <Button variant="default">
              <Icon name="Radio" size={16} />
              Broadcast
            </Button>
          </div>
        </div>

        {/* Station Selector and Shift Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StationSelector
            selectedStation={selectedStation}
            onStationChange={handleStationChange}
            stationData={stationData}
            stations={stations}
          />
          <ShiftControls
            currentShift={currentShift}
            onShiftHandover={handleShiftHandover}
            onShiftChange={handleShiftChange}
            platformView={true}
            onViewChange={handleViewChange}
          />
        </div>

        {/* Status Metrics with highlighted heading */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
            Station Performance Metrics
          </h2>
          <StatusMetrics metrics={metricsData} />
        </div>

        {/* Main Management Area - Station Layout only (removed Communication Panel) */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
            Platform Layout &amp; Management
          </h2>
          <StationLayout
            stationData={stationData}
            platforms={platforms}
            trains={trains}
            onPlatformReassign={handlePlatformReassign}
            onPlatformClick={handlePlatformClick}
            onTrainClick={handleTrainClick}
          />
        </div>

        {/* Schedule Management */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
              Train Schedules
            </h2>
            <ScheduleTable 
              selectedStation={selectedStation}
              schedules={schedules}
              onPlatformReassign={handlePlatformReassign}
              onTrainClick={handleTrainClick}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
              Arrivals &amp; Departures
            </h2>
            <ArrivalDepartureBoard 
              selectedStation={selectedStation}
              arrivals={arrivals}
              departures={departures}
            />
          </div>
        </div>

        {/* Communication Section - Between Section Controller and Station Master */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4 border-l-4 border-primary pl-4">
            Section Controller ↔ Station Master Communication
          </h2>
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Radio" size={20} color="white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Section Controller</div>
                    <div className="text-sm text-muted-foreground">Alice Brown - North Section</div>
                    <div className="flex items-center space-x-1 text-xs text-success">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Online</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" onClick={() => window.location.href = '/communication-center'}>
                  <Icon name="MessageCircle" size={16} />
                  Open Communication Center
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <Icon name="Building2" size={20} color="white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Station Master</div>
                    <div className="text-sm text-muted-foreground">Robert Johnson - Central Station</div>
                    <div className="flex items-center space-x-1 text-xs text-success">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Active</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
                  <div className="font-medium text-foreground mb-1">Recent Communication:</div>
                  <div>"Platform 3 clear for EXP-2401 arrival at 15:45"</div>
                  <div className="text-right mt-1">2 minutes ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Station Status Footer */}
        <div className="mt-8 p-6 bg-card rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon name="Users" size={20} className="text-primary mr-2" />
                <span className="font-semibold">Passenger Flow</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {metricsData?.passengerFlow?.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Current occupancy</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon name="Clock" size={20} className="text-success mr-2" />
                <span className="font-semibold">On-Time Performance</span>
              </div>
              <div className="text-2xl font-bold text-success">
                {metricsData?.onTimePerformance}%
              </div>
              <div className="text-sm text-muted-foreground">Last 24 hours</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon name="Activity" size={20} className="text-warning mr-2" />
                <span className="font-semibold">Platform Utilization</span>
              </div>
              <div className="text-2xl font-bold text-warning">
                {metricsData?.platformUtilization}%
              </div>
              <div className="text-sm text-muted-foreground">Current average</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StationManagementHub;