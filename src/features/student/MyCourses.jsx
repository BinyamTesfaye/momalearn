import React, { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';

export default function MyCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
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
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user]);

  if (!user) return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">My Courses</h2>
      <p className="mt-2 text-gray-600">Please sign in to see the courses you're enrolled in.</p>
      <Link to="/courses" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Browse courses</Link>
    </div>
  );

  if (loading) return <div className="p-6">Loading your courses…</div>;

  return (
    <div className="pt-20 px-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">My Courses</h2>
        </div>
        <div>
          <Link to="/courses" className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Find more courses</Link>
        </div>
      </header>

      <div className="mt-6 space-y-4">
        {enrollments.length === 0 && (
          <div className="p-6 border rounded-lg text-center">
            <h3 className="text-xl font-semibold">No enrolled courses yet</h3>
            <p className="mt-2 text-gray-600">When you enroll in a course it will appear here with your progress and quick actions.</p>
            <Link to="/courses" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Browse courses</Link>
          </div>
        )}

        {enrollments.map(e => {
          const course = e.course || {};
          const progress = Math.max(0, Math.min(100, Math.round(e.progress ?? 0)));

          return (
            <div key={e.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
              <div className="w-28 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-lg font-bold text-gray-300">{course.title ? course.title.split(' ').slice(0,2).map(t=>t[0]).join('') : '📚'}</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link to={`/courses/${course.id}`} className="text-lg font-semibold text-gray-800 hover:underline truncate">{course.title}</Link>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description ?? 'No description provided.'}</p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="w-2/3">
                    <div className="text-xs text-gray-500">Progress <span className="font-medium text-gray-700">{progress}%</span></div>
                    <div className="mt-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div style={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-300"></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to={`/courses/${course.id}`} className="inline-flex items-center px-3 py-1.5 border rounded text-sm">
                      <Play size={14} className="mr-2" /> Continue
                    </Link>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={14} /> <span>{new Date(e.enrolled_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mt-8 text-sm text-gray-500">Tip: Click "Continue" to jump back into any course.</footer>
    </div>
  );
}
