import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import DashboardLayout from './layouts/DashboardLayout';

import OverviewPage from './pages/instance/OverviewPage.tsx';
import IndexPage from './pages/instance/index/Page';
import FederatedSearchPage from './pages/instance/search/federated/Page.tsx';
import TasksPage from './pages/instance/tasks/Page.tsx';
import InstanceErrorPage from './pages/instance/InstanceErrorPage.tsx';
import APIKeysPage from './pages/instance/keys/Page.tsx';
import ExperimentalFeaturesPage from './pages/instance/experimental/Page.tsx';
import InstanceFormPage from './pages/instance-form/Page.tsx';
import ChatCompletionsPage from './pages/instance/features/chat/Page.tsx';
import VectorStorePage from './pages/instance/features/vector/Page.tsx';
import CustomScorersPage from './pages/instance/features/scorers/Page.tsx';
import AdvancedMetricsPage from './pages/instance/features/metrics/Page.tsx';
import NetworkPage from './pages/instance/features/network/Page.tsx';
import DashboardSettingsPage from './pages/instance/dashboard-settings/Page.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/instance/" replace />} />
        <Route path="/instance-form" element={<InstanceFormPage />} />

        <Route path="/instance/" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="index" element={<IndexPage />} />
          <Route path="search/federated" element={<FederatedSearchPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="keys" element={<APIKeysPage />} />
          <Route path="experimental" element={<ExperimentalFeaturesPage />} />
          <Route path="features/chat" element={<ChatCompletionsPage />} />
          <Route path="features/vector" element={<VectorStorePage />} />
          <Route path="features/scorers" element={<CustomScorersPage />} />
          <Route path="features/metrics" element={<AdvancedMetricsPage />} />
          <Route path="features/network" element={<NetworkPage />} />
          <Route path="dashboard-settings" element={<DashboardSettingsPage />} />
          <Route path="error" element={<InstanceErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
