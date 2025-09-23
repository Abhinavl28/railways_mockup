import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

// Import all pages
import SectionControllerLogin from './pages/section-controller-login';
import CommunicationCenter from './pages/communication-center';
import NotificationsPage from './pages/notifications';
import NotificationDetails from './pages/notification-details';
import AIDecisionSupport from './pages/ai-decision-support';
import TrainPerformanceAnalytics from './pages/train-performance-analytics';
import OperationsControlCenter from './pages/operations-control-center';
import StationManagementHub from './pages/station-management-hub';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Login Route */}
        <Route path="/login" element={<SectionControllerLogin />} />
        <Route path="/section-controller-login" element={<SectionControllerLogin />} />
        
        {/* Main Application Routes */}
        <Route path="/" element={<OperationsControlCenter />} />
        <Route path="/operations-control-center" element={<OperationsControlCenter />} />
        <Route path="/train-performance-analytics" element={<TrainPerformanceAnalytics />} />
        <Route path="/station-management-hub" element={<StationManagementHub />} />
        <Route path="/ai-decision-support" element={<AIDecisionSupport />} />
        
        {/* Communication and Notifications */}
        <Route path="/communication-center" element={<CommunicationCenter />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/notification-details" element={<NotificationDetails />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
