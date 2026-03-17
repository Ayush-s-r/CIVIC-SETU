import { Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import AdminLayout from "./layouts/AdminLayouts";
import UserLayout from "./layouts/UserLayout";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Complaint from "./pages/Complaint";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminAnalytics from "./pages/AdminAnalytics";

// Citizen Pages
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenComplaints from "./pages/CitizenComplaints";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Header />
            <main className="flex-grow bg-gray-50">
              <Home />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/about" element={
          <>
            <Header />
            <main className="flex-grow bg-gray-50">
              <About />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/contact" element={
          <>
            <Header />
            <main className="flex-grow bg-gray-50">
              <Contact />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/complaint" element={
          <>
            <Header />
            <main className="flex-grow bg-gray-50">
              <Complaint />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/login" element={
          <>
            <Header />
            <main className="flex-grow bg-gray-50">
              <Login />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/signup" element={
          <>
            <Header />
            <main className="flex-grow bg-gray-50">
              <Signup />
            </main>
            <Footer />
          </>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/complaints" element={<AdminLayout><AdminComplaints /></AdminLayout>} />
        <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1><p>User management functionality coming soon...</p></div></AdminLayout>} />
        <Route path="/admin/departments" element={<AdminLayout><div className="p-6"><h1 className="text-2xl font-bold">Departments Management</h1><p>Department management functionality coming soon...</p></div></AdminLayout>} />

        {/* Citizen Routes */}
        <Route path="/citizen" element={<UserLayout><CitizenDashboard /></UserLayout>} />
        <Route path="/citizen/complaints" element={<UserLayout><CitizenComplaints /></UserLayout>} />
        <Route path="/citizen/report" element={<UserLayout><Complaint /></UserLayout>} />
        <Route path="/citizen/profile" element={<UserLayout><div className="p-6"><h1 className="text-2xl font-bold">Profile</h1><p>Profile management functionality coming soon...</p></div></UserLayout>} />

        {/* 404 Route */}
        <Route path="*" element={
          <>
            <Header />
            <main className="flex-grow bg-gray-50">
              <NotFound />
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}
