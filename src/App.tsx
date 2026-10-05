import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

// ── Route guards & layouts (small structural wrappers — keep eager) ──────────
import PrivateRoutes from "./lib/PrivateRoutes";
import PublicRoutes from "./lib/PublicRoutes";
import AdminRoutes from "./lib/AdminRoutes";
import FranchiseRoutes from "./lib/FranchiseRoutes";
import DeveloperRoutes from "./lib/DeveloperRoutes";
import BookingRoutes from "./lib/BookingRoutes";
import WhatsappBookingResultRoutes from "./lib/WhatsappBookingResultRoutes";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import FranchiseLayout from "./layouts/FranchiseLayout";
import DeveloperLayout from "./layouts/DeveloperLayout";
import ChatwootWidget from "./components/ChatwootWidget";
import PageTracker from "./components/PageTracker";
import { useSessionSync } from "./hooks/useSessionSync";

// ── Public pages ─────────────────────────────────────────────────────────────
const Home = lazy(() => import("./pages/home"));
const Blog = lazy(() => import("./pages/home/Blog"));
const About = lazy(() => import("./pages/home/About"));
const Terms = lazy(() => import("./pages/home/Terms"));
const Privacy = lazy(() => import("./pages/home/Privacy"));
const CostCalculator = lazy(() => import("./pages/home/CostCalculator"));
const FAQ = lazy(() => import("./pages/home/FAQ"));
const Track = lazy(() => import("./pages/home/Track"));
const Tracking = lazy(() => import("./pages/home/Track/Tracking"));
const PublicDispatchPage = lazy(() => import("./pages/dispatch/PublicDispatchPage"));
const NotFound = lazy(() => import("./pages/home/NotFound"));

// ── Auth pages ────────────────────────────────────────────────────────────────
const Signin = lazy(() => import("./pages/auth/Signin"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const ValidateGoogleLogin = lazy(() => import("./pages/auth/ValidateGoogleLogin"));

// ── Booking flow ──────────────────────────────────────────────────────────────
const Delivery = lazy(() => import("./pages/home/CostCalculator/components/Calculator/Booking/Delivery"));
const PickupTime = lazy(() => import("./pages/home/CostCalculator/components/Calculator/Booking/PickupTime"));
const Checkout = lazy(() => import("./pages/home/CostCalculator/components/Calculator/Booking/Checkout"));
const Confirmation = lazy(() => import("./pages/home/CostCalculator/components/Calculator/Booking/Confirmation"));
const ErrorPage = lazy(() => import("./pages/home/CostCalculator/components/Calculator/Booking/ErrorPage"));
const WhatsappConfirmation = lazy(() => import("./pages/home/CostCalculator/components/Calculator/Booking/WhatsappConfirmation"));
const WhatsappErrorPage = lazy(() => import("./pages/home/CostCalculator/components/Calculator/Booking/WhatsappErrorPage"));

// ── Authenticated pages ───────────────────────────────────────────────────────
const Dashboard = lazy(() => import("./pages/dashboard"));
const Franchise = lazy(() => import("./pages/franchise"));
const DeveloperDashboard = lazy(() => import("./pages/developer"));
const DeveloperDocumentation = lazy(() => import("./pages/developer/Documentation"));
const DeveloperStatus = lazy(() => import("./pages/developer/Status"));
const DeveloperAuth = lazy(() => import("./pages/developer/Auth"));
const AdminDashboard = lazy(() => import("./pages/admin"));
const UserProfiles = lazy(() => import("./pages/admin/Profiles/UserProfiles"));
const OrderDetails = lazy(() => import("./pages/admin/Orders/OrderDetails"));
const AddCompany = lazy(() => import("./pages/admin/Companies/AddCompany"));
const CompanyDetails = lazy(() => import("./pages/admin/Companies/CompanyDetails"));

// ── Page loading fallback ─────────────────────────────────────────────────────
const PageSpinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
    <div style={{ width: 32, height: 32, border: "3px solid #e5e7eb", borderTopColor: "#16a34a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const AppRoutes = () => {
  useSessionSync();
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/cost-calculator" element={<CostCalculator />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/track" element={<Track />} />
        <Route path="/track-booking" element={<Tracking />} />
        <Route path="/developer/documentation" element={<DeveloperDocumentation />} />
        <Route path="/status" element={<DeveloperStatus />} />
        <Route path="/domain/auth" element={<DeveloperAuth />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/dispatch/:trackingId" element={<PublicDispatchPage />} />

        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-account" element={<VerifyEmail />} />
          <Route path="/:id/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/:id/reset-password" element={<ResetPassword />} />
          <Route path="/oauth2/callback" element={<ValidateGoogleLogin />} />
        </Route>

        <Route element={<BookingRoutes />}>
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/pickup-time" element={<PickupTime />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success-page" element={<Confirmation />} />
          <Route path="/error-page" element={<ErrorPage />} />
        </Route>

        <Route element={<WhatsappBookingResultRoutes />}>
          <Route path="/whatsapp-payment-success/:whatsappPhoneNumber" element={<WhatsappConfirmation />} />
          <Route path="/whatsapp-payment-error/:whatsappPhoneNumber" element={<WhatsappErrorPage />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>

        <Route element={<FranchiseRoutes />}>
          <Route path="franchise" element={<FranchiseLayout />}>
            <Route index element={<Franchise />} />
          </Route>
        </Route>

        <Route element={<DeveloperRoutes />}>
          <Route path="developer-dashboard" element={<DeveloperLayout />}>
            <Route index element={<DeveloperDashboard />} />
          </Route>
        </Route>

        <Route element={<AdminRoutes />}>
          <Route path="admin-dashboard" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="user/:id" element={<UserProfiles />} />
            <Route path="order/:id" element={<OrderDetails />} />
            <Route path="companies/add-company" element={<AddCompany />} />
            <Route path="companies/add-company/:id" element={<AddCompany />} />
            <Route path="company/:id" element={<CompanyDetails />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <>
      <ChatwootWidget />
      <Router>
        <PageTracker />
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
