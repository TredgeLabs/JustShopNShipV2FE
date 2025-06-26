import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/Profile';
import EnhancedNavigation from './components/EnhancedNavigation';
import MyVault from './pages/MyVault';
import DomesticOrders from './pages/DomesticOrders';
import InternationalOrders from './pages/InternationalOrders';
import ProhibitedItems from './pages/ProhibitedItems';
import FAQ from './pages/FAQ';
import ShippingCalculatorPage from './pages/ShippingCalculatorPage';
import Blog from './pages/Blog';
import Guide from './pages/Guide';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes without navigation */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-vault" element={<MyVault />} />
          <Route path="/domestic-orders" element={<DomesticOrders />} />
          <Route path="/international-orders" element={<InternationalOrders />} />
          <Route path="/prohibited-items" element={<ProhibitedItems />} />
          <Route path="/faqs" element={<FAQ />} />
          <Route path="/shipping-calculator" element={<ShippingCalculatorPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/guide" element={<Guide />} />
          
          {/* Routes with navigation */}
          <Route path="/*" element={
            <>
              <EnhancedNavigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;