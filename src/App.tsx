
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

// Lazy load pages
const TreatmentList = lazy(() => import("./pages/TreatmentList"));
const TreatmentDetail = lazy(() => import("./pages/TreatmentDetail"));
const ClinicProfile = lazy(() => import("./pages/ClinicProfile"));
const BookingFlow = lazy(() => import("./pages/BookingFlow"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));
const BookingCancel = lazy(() => import("./pages/BookingCancel"));
const Auth = lazy(() => import("./pages/Auth"));
const PatientDashboard = lazy(() => import("./pages/PatientDashboard"));
const ClinicDashboard = lazy(() => import("./pages/ClinicDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminClinics = lazy(() => import("./pages/AdminClinics"));
const AdminDoctors = lazy(() => import("./pages/AdminDoctors"));
const AdminPatients = lazy(() => import("./pages/AdminPatients"));
const AdminTransactions = lazy(() => import("./pages/AdminTransactions"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const AdminApprovals = lazy(() => import("./pages/AdminApprovals"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminCMS = lazy(() => import("./pages/AdminCMS"));
const AdminCRM = lazy(() => import("./pages/AdminCRM"));
const AdminSecurity = lazy(() => import("./pages/AdminSecurity"));
const AdminActivity = lazy(() => import("./pages/AdminActivity"));
const AdminCampaigns = lazy(() => import("./pages/AdminCampaigns"));
const AdminMessaging = lazy(() => import("./pages/AdminMessaging"));
const AdminNotifications = lazy(() => import("./pages/AdminNotifications"));
const AdminIntegrations = lazy(() => import("./pages/AdminIntegrations"));
const AdminLanguageSettings = lazy(() => import("./pages/AdminLanguageSettings"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const AdvancedSearch = lazy(() => import("./pages/AdvancedSearch"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Support = lazy(() => import("./pages/Support"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const MedicalDisclaimer = lazy(() => import("./pages/MedicalDisclaimer"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Layout>
                  <Suspense fallback={
                    <div className="min-h-screen">
                      <LoadingSpinner size="lg" message="Loading page..." />
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/treatments" element={<TreatmentList />} />
                      <Route path="/treatments/:id" element={<TreatmentDetail />} />
                      <Route path="/treatment/:id" element={<TreatmentDetail />} />
                      <Route path="/clinics/:id" element={<ClinicProfile />} />
                      <Route path="/booking/:treatmentId" element={<BookingFlow />} />
                      <Route path="/booking-success" element={<BookingSuccess />} />
                      <Route path="/booking-cancel" element={<BookingCancel />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      
                      {/* Standard Patient Routes */}
                      <Route path="/patient/dashboard" element={
                        <ProtectedRoute>
                          <PatientDashboard />
                        </ProtectedRoute>
                      } />
                      {/* Redirect old patient dashboard URL */}
                      <Route path="/patient-dashboard" element={<Navigate to="/patient/dashboard" replace />} />
                      
                      {/* Standard Clinic Routes */}
                      <Route path="/clinic/dashboard" element={
                        <ProtectedRoute>
                          <ClinicDashboard />
                        </ProtectedRoute>
                      } />
                      {/* Redirect old clinic dashboard URL */}
                      <Route path="/clinic-dashboard" element={<Navigate to="/clinic/dashboard" replace />} />
                      
                      {/* Protected Admin Routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute requireAdmin>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/dashboard" element={
                        <ProtectedRoute requireAdmin>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/clinics" element={
                        <ProtectedRoute requireAdmin>
                          <AdminClinics />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/doctors" element={
                        <ProtectedRoute requireAdmin>
                          <AdminDoctors />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/patients" element={
                        <ProtectedRoute requireAdmin>
                          <AdminPatients />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/crm" element={
                        <ProtectedRoute requireAdmin>
                          <AdminCRM />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/transactions" element={
                        <ProtectedRoute requireAdmin>
                          <AdminTransactions />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/reports" element={
                        <ProtectedRoute requireAdmin>
                          <AdminReports />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/approvals" element={
                        <ProtectedRoute requireAdmin>
                          <AdminApprovals />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/settings" element={
                        <ProtectedRoute requireAdmin>
                          <AdminSettings />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/language-settings" element={
                        <ProtectedRoute requireAdmin>
                          <AdminLanguageSettings />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/cms" element={
                        <ProtectedRoute requireAdmin>
                          <AdminCMS />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/security" element={
                        <ProtectedRoute requireAdmin>
                          <AdminSecurity />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/activity" element={
                        <ProtectedRoute requireAdmin>
                          <AdminActivity />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/campaigns" element={
                        <ProtectedRoute requireAdmin>
                          <AdminCampaigns />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/messaging" element={
                        <ProtectedRoute requireAdmin>
                          <AdminMessaging />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/notifications" element={
                        <ProtectedRoute requireAdmin>
                          <AdminNotifications />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/integrations" element={
                        <ProtectedRoute requireAdmin>
                          <AdminIntegrations />
                        </ProtectedRoute>
                      } />
                      
                      {/* Public Routes */}
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/advanced-search" element={<AdvancedSearch />} />
                      <Route path="/how-it-works" element={<HowItWorks />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/medical-disclaimer" element={<MedicalDisclaimer />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Layout>
              </BrowserRouter>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
