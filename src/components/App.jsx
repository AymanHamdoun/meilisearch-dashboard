import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout.jsx'
import BasicLayout from './layouts/AuthLayout.jsx'

import OverviewPage from './pages/instance/OverviewPage.tsx'
import IndexPage from './pages/instance/index/Page.jsx'
import FederatedSearchPage from './pages/instance/search/federated/Page.tsx'
import TasksPage from './pages/instance/tasks/Page.tsx'
import InstanceErrorPage from './pages/instance/InstanceErrorPage.tsx'

import LoginPage from './pages/login/Page.jsx'
import InstanceFormPage from './pages/instance-form/Page.tsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<BasicLayout />}>
                <Route index element={<LoginPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="instance-form" element={<InstanceFormPage />} />
          </Route>

          <Route path="/instance/" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="index" element={<IndexPage />} />
            <Route path="search/federated" element={<FederatedSearchPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="error" element={<InstanceErrorPage />} />
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;