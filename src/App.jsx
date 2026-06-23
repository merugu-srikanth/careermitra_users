import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";
import { BlogProvider } from "./context/BlogContext";
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
import ArticleList from "./pages/Articles/ArticleList";
import ArticleDetail from "./pages/Articles/ArticleDetail";
import TwoSegmentResolver from "./pages/Articles/TwoSegmentResolver";
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
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import BlogCategory from "./pages/Blogs/BlogCategory";
import PWAUpdatePrompt from "./components/PWAUpdatePrompt";

export default function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <BlogProvider>
          <ToastContainer />
          <Router>
            <ScrollToTop />
            <Navbar />
            {/* <HeroAnnouncementTicker /> */}

            <Routes>
              {/* ── Active Routes ── */}
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
                path="/latest-job-notifications"
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
              <Route path="/government-jobs" element={<BlogList />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/internship-guide" element={<InternshipGuide />} />
              <Route path="/career-guide" element={<CareerGuide />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/contact-us" element={<Contact />} />
              <Route path="/announcements/:slug" element={<AnnouncementDetail />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              {/* Clean URLs — must be last before wildcard * */}
              {/* 3-segment: always an article under child category */}
              <Route path="/:parentSlug/:childSlug/:articleSlug" element={<ArticleDetail />} />
              {/* 2-segment: resolves to child category list OR article */}
              <Route path="/:parentSlug/:slug" element={<TwoSegmentResolver />} />
              {/* 1-segment: parent category listing */}
              <Route path="/:parentSlug" element={<ArticleList />} />

              {/* ── Commented Out / Inactive Routes ── */}
              {/*
              <Route
                path="/UserProfile"
                element={
                  <ProtectedRoute>
                    <ProfileLayout />
                  </ProtectedRoute>
                }
              />
              <Route path="/articles" element={<ArticleList />} />
              <Route path="/articles/:parentSlug/:childSlug/:slug" element={<ArticleDetail />} />
              <Route path="/articles/:parentSlug/:slug" element={<ArticleDetail />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/category/:categorySlug" element={<BlogCategory />} />
              <Route path="/author/:authorId" element={<AuthorProfile />} />
              <Route
                path="/coming-soon"
                element={
                  <ComingSoon />
                }
              />
              <Route path="/blogs"         element={<Navigate to="/articles" replace />} />
              <Route path="/blogs/:a"      element={<NotFoundPage />} />
              <Route path="/blogs/:a/:b"   element={<NotFoundPage />} />
              <Route path="/blogs/*"       element={<NotFoundPage />} />
              <Route path="/blog"          element={<Navigate to="/articles" replace />} />
              <Route path="/blog/:a"       element={<NotFoundPage />} />
              <Route path="/blog/:a/:b"    element={<NotFoundPage />} />
              <Route path="/blog/*"        element={<NotFoundPage />} />
              */}

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            {/* <AIChatBot /> */}
            <Footer />
            <PWAUpdatePrompt />

          </Router>
        </BlogProvider>
      </JobProvider>
    </AuthProvider>
  );
}