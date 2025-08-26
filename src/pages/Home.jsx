import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import logo from "../assets/momalogo.png";

const Home = () => {
  const [showCourses, setShowCourses] = useState(true);
  const [activeCourse, setActiveCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollData, setEnrollData] = useState({
    studentName: '',
    anonymous: false,
  });

  // Fetch courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.error('Error fetching courses:', error);
      else setCourses(data);
    };
    fetchCourses();
  }, []);

  const handleEnrollChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnrollData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const submitEnrollment = async (e) => {
  e.preventDefault();
  if (!activeCourse) return;

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("You must be logged in to enroll.");
    return;
  }

  // Check if already enrolled
  const { data: existingEnrollment, error: checkError } = await supabase
    .from('enrollments')
    .select('*')
    .eq('course_id', activeCourse.id)
    .eq('student_id', user.id)
    .single(); // single() returns null if not found

  if (existingEnrollment) {
    alert(`You are already enrolled in ${activeCourse.name}.`);
    return;
  }

  // Fetch profile (username)
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single();

  if (profileError) {
    alert('Failed to fetch profile: ' + profileError.message);
    return;
  }

  // Insert enrollment
  const { error } = await supabase.from('enrollments').insert([
    {
      course_id: activeCourse.id,
      student_id: user.id,
      student_name: profile.full_name,
      enrolled_at: new Date(),
    },
  ]);

  if (error) {
    // If unique constraint prevents duplicate
    if (error.code === '23505') {
      alert(`You are already enrolled in ${activeCourse.name}.`);
    } else {
      alert('Failed to enroll: ' + error.message);
    }
    return;
  }

  alert(`Successfully enrolled in ${activeCourse.name}!`);
  setActiveCourse(null);
};



  return (
    <div className="bg-gradient-to-b from-white to-gray-200 min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 mb-5 mt-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
             {/* 
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
              */}
          </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
             
          <h2 className="text-5xl md:text-7xl font-bold mb-0  h-30 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Learn Today, Lead Tomorrow
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Moma empowers learners with practical courses, expert guidance, and flexible learning to unlock opportunities and succeed.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowCourses(!showCourses)}
              className="btn-primary"
            >
              {showCourses ? "Hide Courses" : "Show Courses"}
            </button>
            <Link to="/courses" className="btn-secondary text-gray-400">
              Explore
            </Link>
          </div>
            <div className="flex flex-wrap justify-center gap-4 mt-0">
            <img src={logo} alt="Moma Logo" className="h-50 w-auto" />
          </div>
     
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-gray-800 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-400 mb-3">{courses.length}+</div>
              <div className="text-gray-300 uppercase tracking-wider">Courses</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-purple-400 mb-3">4K+</div>
              <div className="text-gray-300 uppercase tracking-wider">Students</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-pink-400 mb-3">20+</div>
              <div className="text-gray-300 uppercase tracking-wider">Categories</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-400 mb-3">5+</div>
              <div className="text-gray-300 uppercase tracking-wider">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700">
              Featured <span className="text-gray-700">Courses</span>
            </h2>
          </div>

          {showCourses && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
               <div 
  key={course.id} 
  className="campaign-card group cursor-pointer"
  onClick={() => setActiveCourse(course)}
>
  {/* Thumbnail */}
  <div className="h-48 w-full  mb-0 overflow-hidden bg-gray-700 flex items-center justify-center">
    {course.thumbnail ? (
      <img 
        src={course.thumbnail} 
        alt={course.name} 
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    ) : (
      <span className="text-white text-xl font-bold">No Thumbnail</span>
    )}
  </div>

  <div className="p-6 bg-gray-800">
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
      {course.title}
    </h3>
    <p className="text-gray-400 mb-5 min-h-[60px]">
      {course.description}
    </p>
    <button
      className="text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
      onClick={(e) => { e.stopPropagation(); setActiveCourse(course); }}
    >
      Enroll Now
    </button>
  </div>
</div>

              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Modal */}
      {activeCourse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">
                  Enroll to  {activeCourse.name}
                </h3>
                <button 
                  onClick={() => setActiveCourse(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 mt-2">{activeCourse.description}</p>
            </div>

            <form onSubmit={submitEnrollment} className="p-6">
             

              

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Enroll
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
