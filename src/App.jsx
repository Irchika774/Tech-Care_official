import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import BookingGuard from './components/BookingGuard';

// Lazy load all pages for code splitting and better performance
const Home = lazy(() => import('./pages/Home'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Payment = lazy(() => import('./pages/Payment'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const Admin = lazy(() => import('./pages/Admin'));
const PCRepair = lazy(() => import('./pages/PCRepair'));
const MobileRepair = lazy(() => import('./pages/MobileRepair'));
const Profile = lazy(() => import('./pages/Profile'));
const History = lazy(() => import('./pages/History'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Settings = lazy(() => import('./pages/Settings'));
const TechnicianDashboard = lazy(() => import('./pages/TechnicianDashboard'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const Compare = lazy(() => import('./pages/Compare'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Services = lazy(() => import('./pages/Services'));
const Support = lazy(() => import('./pages/Support'));
const Company = lazy(() => import('./pages/Company'));
const Technicians = lazy(() => import('./pages/Technicians'));
const Chat = lazy(() => import('./pages/Chat'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const BookingTracker = lazy(() => import('./pages/BookingTracker'));
const Diagnostics = lazy(() => import('./pages/Diagnostics'));
const ServiceAreas = lazy(() => import('./pages/ServiceAreas'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);


function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CurrencyProvider>
          <HelmetProvider>
            <BrowserRouter>
              <AuthProvider>
                <NotificationProvider>
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/pc-repair" element={<PCRepair />} />
                        <Route path="/mobile-repair" element={<MobileRepair />} />
                        <Route path="/reviews" element={<Reviews />} />
                        <Route path="/schedule" element={
                          <BookingGuard requiredContext="service">
                            <Schedule />
                          </BookingGuard>
                        } />
                        <Route path="/payment" element={
                          <BookingGuard requiredContext="payment">
                            <Payment />
                          </BookingGuard>
                        } />
                        <Route path="/payment-success" element={<PaymentSuccess />} />
                        <Route path="/technicians" element={<Technicians />} />

                        {/* Protected User Routes - Require Authentication */}
                        <Route
                          path="/account"
                          element={
                            <ProtectedRoute allowedRoles={['user', 'technician', 'admin']} >
                              <RoleBasedRedirect />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/history"
                          element={
                            <ProtectedRoute allowedRoles={['user']} >
                              <History />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/favorites"
                          element={
                            <ProtectedRoute allowedRoles={['user']} >
                              <Favorites />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute allowedRoles={['user', 'technician', 'admin']} >
                              <Settings />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/compare"
                          element={
                            <ProtectedRoute allowedRoles={['user']} >
                              <Compare />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Static Pages */}
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/company" element={<Company />} />
                        <Route path="/diagnostics" element={<Diagnostics />} />
                        <Route path="/service-areas" element={<ServiceAreas />} />



                        {/* Dashboards - Role-Based Access */}
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute allowedRoles={['admin']} >
                              <Admin />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/technician-dashboard"
                          element={
                            <ProtectedRoute allowedRoles={['technician']} >
                              <TechnicianDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/customer-dashboard"
                          element={
                            <ProtectedRoute allowedRoles={['user']} >
                              <CustomerDashboard />
                            </ProtectedRoute>
                          }
                        />

                        {/* Chat - Protected for all authenticated users */}
                        <Route
                          path="/chat"
                          element={
                            <ProtectedRoute allowedRoles={['user', 'technician', 'admin']} >
                              <Chat />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/chat/:bookingId"
                          element={
                            <ProtectedRoute allowedRoles={['user', 'technician', 'admin']} >
                              <Chat />
                            </ProtectedRoute>
                          }
                        />

                        {/* Booking Tracker - Protected for authenticated users */}
                        <Route
                          path="/tracker/:bookingId"
                          element={
                            <ProtectedRoute allowedRoles={['user', 'technician', 'admin']} >
                              <BookingTracker />
                            </ProtectedRoute>
                          }
                        />

                        {/* Catch all - redirect to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Layout>
                  </Suspense>
                  <Toaster />
                </NotificationProvider>
              </AuthProvider>
            </BrowserRouter>
          </HelmetProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


export default App;