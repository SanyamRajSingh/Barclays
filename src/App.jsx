import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CustomerDetail from './pages/CustomerDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Dashboard />} /> {/* Reuse Dashboard for now as placeholder */}
          <Route path="customer/:id" element={<CustomerDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
