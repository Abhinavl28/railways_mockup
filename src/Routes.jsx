import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from 'components/ScrollToTop';
import ErrorBoundary from 'components/ErrorBoundary';
import ProtectedRoute from 'components/ProtectedRoute';
import RedirectIfAuthenticated from 'components/RedirectIfAuthenticated';
import NotFound from 'pages/NotFound';

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
    <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public Routes (show login first) */}
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <SectionControllerLogin />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <SectionControllerLogin />
            </RedirectIfAuthenticated>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/operations-control-center"
          element={
            <ProtectedRoute>
              <OperationsControlCenter />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/train-performance-analytics"
          element={
            <ProtectedRoute>
              <TrainPerformanceAnalytics />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/station-management-hub"
          element={
            <ProtectedRoute>
              <StationManagementHub />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/ai-decision-support"
          element={
            <ProtectedRoute>
              <AIDecisionSupport />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/communication-center"
          element={
            <ProtectedRoute>
              <CommunicationCenter />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/notification-details"
          element={
            <ProtectedRoute>
              <NotificationDetails />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect old login route */}
        <Route path="/section-controller-login" element={<Navigate to="/login" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </ErrorBoundary>
  );
};

export default Routes;
