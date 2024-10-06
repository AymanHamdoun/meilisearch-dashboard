import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout.jsx'
import BasicLayout from './layouts/AuthLayout.jsx'

import OverviewPage from './pages/instance/OverviewPage'
import IndexPage from './pages/instance/index/Page.jsx'
import TasksPage from './pages/instance/tasks/Page.tsx'

import LoginPage from './pages/login/Page.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<BasicLayout />}>
            <Route index element={<LoginPage />} /> 
            <Route path="login" element={<LoginPage />} /> 
          </Route>

          <Route path="/instance/" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} /> 
            <Route path="index" element={<IndexPage />} /> 
            <Route path="tasks" element={<TasksPage />} /> 
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;