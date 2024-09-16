import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from './pages/home/Page.jsx'
import ContactPage from './pages/contact/Page.jsx'
import LoginPage from './pages/login/Page.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/contact" element={<ContactPage />}/>
          <Route path="/login" element={<LoginPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;