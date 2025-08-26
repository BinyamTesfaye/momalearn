import React, { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Trash2, ExternalLink, Info } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, course:course_id (id, title, thumbnail, description)')
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) {
        console.error('Error loading enrollments:', error);
        if (mounted) setEnrollments([]);
      } else {
        if (mounted) setEnrollments(data ?? []);
      }
      if (mounted) setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, [user]);

  const deleteEnrollment = async (enrollmentId) => {
    if (!user) {
      alert('You must be logged in to perform this action.');
      return;
    }

    const ok = window.confirm('Are you sure you want to remove this enrollment? This will only remove it for you.');
    if (!ok) return;

    try {
      setDeletingId(enrollmentId);

      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', enrollmentId)
        .eq('student_id', user.id);

      if (error) {
        console.error('Delete error:', error);
        alert('Failed to remove enrollment: ' + error.message);
        return;
      }

      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Welcome 👋</h2>
      <p className="mt-2 text-gray-600">Please log in to view your personalized learning dashboard.</p>
      <Link to="/courses" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded shadow">Browse courses</Link>
    </div>
  );

  if (loading) return <div className="p-6">Loading your courses…</div>;

  return (
    <div className="pt-20 px-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">My Courses</h2>
        </div>
        <div>
          <Link to="/courses" className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Find more courses</Link>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.length === 0 && (
          <div className="col-span-full p-6 border rounded-lg text-center">
            <h3 className="text-xl font-semibold">No enrollments yet</h3>
            <p className="mt-2 text-gray-600">When you enroll in a course it'll appear here with progress and quick actions.</p>
            <Link to="/courses" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Browse courses</Link>
          </div>
        )}

        {enrollments.map(e => {
          const course = e.course || {};
          const progress = Math.max(0, Math.min(100, Math.round(e.progress ?? 0)));

          return (
            <article key={e.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                {course.thumbnail ? (
                  // thumbnail from your DB
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  // fallback placeholder with initials
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
                    {course.title ? course.title.split(' ').slice(0,2).map(t=>t[0]).join('') : '📚'}
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col justify-between h-44">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-3">{course.description ?? 'No description available.'}</p>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div>Enrolled: <span className="font-medium text-gray-700">{new Date(e.enrolled_at).toLocaleDateString()}</span></div>
                    <div>Progress: <span className="font-medium text-gray-700">{progress}%</span></div>
                  </div>

                  <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div style={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-300"></div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Link to={`/courses/${course.id}`} className="inline-flex items-center px-3 py-1.5 border rounded text-sm hover:bg-gray-50">
                        <ExternalLink size={14} className="mr-2" /> Open
                      </Link>
{/* Assuming you have a route to view enrollment details 
                      <Link to={`/student/enrollments/${e.id}`} className="inline-flex items-center px-3 py-1.5 border rounded text-sm text-gray-600 hover:bg-gray-50">
                        <Info size={14} className="mr-2" /> Details
                      </Link>
                      */}
                    </div>

                    <button
                      onClick={() => deleteEnrollment(e.id)}
                      disabled={deletingId === e.id}
                      className="inline-flex items-center px-3 py-1.5 rounded text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} className="mr-2" /> {deletingId === e.id ? 'Removing…' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="mt-8 text-sm text-gray-500">Tip: You can remove an enrollment and re-enroll later if you change your mind.</footer>
    </div>
  );
}
