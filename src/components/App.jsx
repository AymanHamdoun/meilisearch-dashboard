import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import DashboardHomePage from './pages/DashboardHomePage.jsx'
import LoginPage from './pages/login/Page.jsx'
import IndexPage from './pages/search/Page.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import BasicLayout from './layouts/AuthLayout.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<BasicLayout />}>
            <Route index element={<LoginPage />} /> 
            <Route path="login" element={<LoginPage />} /> 
          </Route>

          <Route path="/instance/" element={<DashboardLayout />}>
            <Route index element={<DashboardHomePage />} /> 
            <Route path="index" element={<IndexPage />} /> 
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;