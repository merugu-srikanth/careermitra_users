import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyOtp from "./pages/RegisterVerify";
import ResetPassword from "./pages/ResetPassword";
import UserProfilePage from "./pages/Userprofilepage";
import ProfileLayout from "./pages/Profilre";
import ScrollToTop from "./ScrollToTop";
import Userprofilefillingpage from "./pages/Userprofilefillingpage";
import Userprofilepage from "./pages/Userprofilepage";
import ProtectedRoute from "./components/ProtectedRoute";
import BlogDetail from "./pages/Blogs/BlogDetail";
import BlogList from "./pages/Blogs/BlogList";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/ContactPage";
import "./App.css"
import ComingSoon from "./pages/Commingsoon/ComingSoon";
import AllJobs from "./pages/Alljobs";
import AIChatBot from "./components/AIChatBot";
import AuthorProfile from "./pages/AuthorProfile";
import InternshipGuide from "./pages/Internshipguide";
import CareerGuide from "./pages/CareerGuide";
import EventsPage from "./pages/EventsPage";
import NotFoundPage from "./components/NotFoundPage";
import HeroAnnouncementTicker from "./components/HeroAnnouncementTicker";
import AnnouncementDetail from "./pages/AnnouncementDetail";

export default function App() {
  return (
    <AuthProvider>

      <ToastContainer />
      <Router>
        <ScrollToTop />
        <Navbar />
        {/* <HeroAnnouncementTicker /> */}

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <Userprofilepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={<AllJobs />}
          />

          <Route
            path="/user-profile-filling"
            element={
              <ProtectedRoute>
                <Userprofilefillingpage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/UserProfile"
            element={
              <ProtectedRoute>
                <ProfileLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <BlogList />
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <BlogDetail />
            }
          />
          <Route path="/author/:authorId" element={<AuthorProfile />} />

          <Route
            path="/about-us"
            element={
              <AboutPage />
            }
          />
          <Route
            path="/internship-guide"
            element={
              <InternshipGuide />
            }
          />
          <Route
            path="/career-guide"
            element={
              <CareerGuide />
            }
          />
          <Route path="/events" element={<EventsPage />} />
          <Route
            path="/contact-us"
            element={
              <Contact />
            }
          />
          <Route
            path="/coming-soon"
            element={
              <ComingSoon />
            }
          />
          <Route path="/announcements/:slug" element={<AnnouncementDetail />} />
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
        {/* <AIChatBot /> */}
        <Footer />

      </Router>
    </AuthProvider>
  );
}