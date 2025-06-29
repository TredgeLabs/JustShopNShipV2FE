import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/Profile';
import MyVault from './pages/MyVault';
import DomesticOrders from './pages/DomesticOrders';
import InternationalOrders from './pages/InternationalOrders';
import ProhibitedItems from './pages/ProhibitedItems';
import FAQ from './pages/FAQ';
import ShippingCalculatorPage from './pages/ShippingCalculatorPage';
import Blog from './pages/Blog';
import Guide from './pages/Guide';
import Inventory from './pages/Inventory';
import InventoryItemDetails from './pages/InventoryItemDetails';
import AddAddress from './pages/AddAddress';
import ContactSupport from './pages/ContactSupport';
import CreateOrder from './pages/CreateOrder';
import OrderConfirmation from './pages/OrderConfirmation';
import Payment from './pages/Payment';
import PaymentResult from './pages/PaymentResult';
import ShipmentConfirmation from './pages/ShipmentConfirmation';
import EnhancedNavigation from './components/EnhancedNavigation';

// Admin Routes
import AdminRoutes from './admin/routes/AdminRoutes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Admin Routes - Completely isolated */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Public routes without navigation */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-address" element={<AddAddress />} />
          
          {/* Order creation and payment flow */}
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/shipment-confirmation" element={<ShipmentConfirmation />} />
          
          {/* Routes with navigation */}
          <Route path="/*" element={
            <>
              <EnhancedNavigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-vault" element={<MyVault />} />
                <Route path="/domestic-orders" element={<DomesticOrders />} />
                <Route path="/international-orders" element={<InternationalOrders />} />
                <Route path="/prohibited-items" element={<ProhibitedItems />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/shipping-calculator" element={<ShippingCalculatorPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/:itemId" element={<InventoryItemDetails />} />
                <Route path="/contact-support" element={<ContactSupport />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;