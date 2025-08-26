import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

// Courses (public & detail)
import CourseList from './pages/courses/CourseList';
import CoursePage from './pages/courses/CoursePage';
import LessonPlayer from './pages/courses/LessonPlayer';

// Student area
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './features/student/StudentDashboard';
import MyCourses from './features/student/MyCourses';
import EnrollmentPage from './features/student/EnrollmentPage';
import Profile from './features/student/Profile';

// Instructor area
import InstructorLayout from './layouts/InstructorLayout';
import InstructorDashboard from './features/instructor/InstructorDashboard';
import CreateCourse from './features/instructor/CreateCourse';
import EditCourse from './features/instructor/EditCourse';
import ManageCourseLessons from './features/instructor/ManageCourseLessons';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './features/admin/AdminDashboard';
import ManageUsers from './features/admin/ManageUsers';
import ManageCourses from './features/admin/ManageCourses';
import ManageCampaigns from './features/admin/ManageCampaigns';

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    // Futuristic cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'futuristic-cursor';
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    document.addEventListener('mousemove', moveCursor);
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);

  return (
    <div className="futuristic-theme min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<CoursePage />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPlayer />} />

          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

          {/* Student routes (protected for role: student) */}
          <Route path="/student" element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="enrollments" element={<EnrollmentPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Instructor routes (protected for role: instructor) */}
          <Route path="/instructor" element={
            <ProtectedRoute role="instructor">
              <InstructorLayout />
            </ProtectedRoute>
          }>
            <Route index element={<InstructorDashboard />} />
            <Route path="courses/new" element={<CreateCourse />} />
            <Route path="courses/:courseId/edit" element={<EditCourse />} />
            <Route path="courses/:courseId/lessons" element={<ManageCourseLessons />} />
                        <Route path="profile" element={<Profile />} />

          </Route>

          {/* Admin routes (protected for role: admin) */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="campaigns" element={<ManageCampaigns />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
