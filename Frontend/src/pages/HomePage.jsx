import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Make sure to add your logo here

const HomePage = () => {
  return (
    <div className="home-container">
      <header>
        <img src={logo} alt="Logo" className="logo" />
        <h1>Welcome to Attendance Management System</h1>
      </header>
      <nav>
        <ul>
          <li><Link to="/attendance">Mark Attendance</Link></li>
          <li><Link to="/reports">View Reports</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default HomePage;
