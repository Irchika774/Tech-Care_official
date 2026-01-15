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

// Helper to handle lazy load failures with infinite loop protection
const lazyRetry = (componentImport) => {
  return lazy(async () => {
    const pageHasBeenRefreshed = sessionStorage.getItem('page_has_been_refreshed');

    try {
      return await componentImport();
    } catch (error) {
      if (!pageHasBeenRefreshed) {
        sessionStorage.setItem('page_has_been_refreshed', 'true');
        window.location.reload();
        return { default: () => <LoadingFallback /> };
      }
      // If already refreshed, throw chunk load error to be caught by ErrorBoundary
      throw error;
    }
  });
};

// Lazy load all pages for code splitting and better performance
const Home = lazyRetry(() => import('./pages/Home'));
const Schedule = lazyRetry(() => import('./pages/Schedule'));
const Reviews = lazyRetry(() => import('./pages/Reviews'));
const Payment = lazyRetry(() => import('./pages/Payment'));
const PaymentSuccess = lazyRetry(() => import('./pages/PaymentSuccess'));
const Admin = lazyRetry(() => import('./pages/Admin'));
const PCRepair = lazyRetry(() => import('./pages/PCRepair'));
const MobileRepair = lazyRetry(() => import('./pages/MobileRepair'));
const TabletRepair = lazyRetry(() => import('./pages/TabletRepair'));
const Profile = lazyRetry(() => import('./pages/Profile'));
const History = lazyRetry(() => import('./pages/History'));
const Favorites = lazyRetry(() => import('./pages/Favorites'));
const Settings = lazyRetry(() => import('./pages/Settings'));
const TechnicianDashboard = lazyRetry(() => import('./pages/TechnicianDashboard'));
const CustomerDashboard = lazyRetry(() => import('./pages/CustomerDashboard'));
const Compare = lazyRetry(() => import('./pages/Compare'));
const Login = lazyRetry(() => import('./pages/Login'));
const Register = lazyRetry(() => import('./pages/Register'));
const Terms = lazyRetry(() => import('./pages/Terms'));
const Privacy = lazyRetry(() => import('./pages/Privacy'));
const Services = lazyRetry(() => import('./pages/Services'));
const Support = lazyRetry(() => import('./pages/Support'));
const Company = lazyRetry(() => import('./pages/Company'));
const Technicians = lazyRetry(() => import('./pages/Technicians'));
const Chat = lazyRetry(() => import('./pages/Chat'));
const ForgotPassword = lazyRetry(() => import('./pages/ForgotPassword'));
const ResetPassword = lazyRetry(() => import('./pages/ResetPassword'));
const BookingTracker = lazyRetry(() => import('./pages/BookingTracker'));
const Diagnostics = lazyRetry(() => import('./pages/Diagnostics'));
const ServiceAreas = lazyRetry(() => import('./pages/ServiceAreas'));
const Careers = lazyRetry(() => import('./pages/Careers'));
const Partner = lazyRetry(() => import('./pages/Partner'));
const HowItWorks = lazyRetry(() => import('./pages/HowItWorks'));
const Blog = lazyRetry(() => import('./pages/Blog'));
const BlogPost = lazyRetry(() => import('./pages/BlogPost'));

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
                        <Route path="/tablet-repair" element={<TabletRepair />} />
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
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/partner" element={<Partner />} />
                        <Route path="/how-it-works" element={<HowItWorks />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<BlogPost />} />

                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute allowedRoles={['user', 'technician', 'admin']} >
                              <Profile />
                            </ProtectedRoute>
                          }
                        />



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