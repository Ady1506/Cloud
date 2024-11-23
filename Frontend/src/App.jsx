import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AttendancePage from './pages/AttendancePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Reports from './pages/ReportsSection';

import './App.css';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/presence_pulse" element={<HomePage />} />
        


      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/reports" element={<Reports />} /> 
      </Routes>
    </Router>
  );
}

export default App;
