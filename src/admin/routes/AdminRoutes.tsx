import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin';
import ProtectedRoute from '../components/ProtectedRoute';
import OrdersList from '../pages/OrdersList';
import LocalOrderEvaluation from '../pages/LocalOrderEvaluation';
import VaultEntry from '../pages/VaultEntry';
import ShippingOrderUpdate from '../pages/ShippingOrderUpdate';
import InventoryEntry from '../pages/InventoryEntry';
import ContactSupport from '../pages/ContactSupport';
import EvaluationDetailPage from '../pages/EvaluationDetailPage';
import VaultSearchPage from '../pages/VaultSearchPage';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Admin Login - No protection needed */}
      <Route path="/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route path="/orders" element={
        <ProtectedRoute>
          <OrdersList />
        </ProtectedRoute>
      } />
      
      <Route path="/local-order-evaluation/:orderId" element={
        <ProtectedRoute>
          <LocalOrderEvaluation />
        </ProtectedRoute>
      } />
      
      <Route path="/evaluation-detail/:orderId" element={
        <ProtectedRoute>
          <EvaluationDetailPage />
        </ProtectedRoute>
      } />
      
      <Route path="/vault-search" element={
        <ProtectedRoute>
          <VaultSearchPage />
        </ProtectedRoute>
      } />
      
      <Route path="/shipping-order-update/:shippingOrderId" element={
        <ProtectedRoute>
          <ShippingOrderUpdate />
        </ProtectedRoute>
      } />
      
      <Route path="/vault-entry" element={
        <ProtectedRoute>
          <VaultEntry />
        </ProtectedRoute>
      } />
      
      <Route path="/inventory-entry" element={
        <ProtectedRoute>
          <InventoryEntry />
        </ProtectedRoute>
      } />
      
      <Route path="/contact-support" element={
        <ProtectedRoute>
          <ContactSupport />
        </ProtectedRoute>
      } />
      
      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/admin/orders" replace />} />
      <Route path="*" element={<Navigate to="/admin/orders" replace />} />
    </Routes>
  );
};

export default AdminRoutes;