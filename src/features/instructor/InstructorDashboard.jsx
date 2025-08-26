import React, { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Edit3, Play, Trash2, Eye, Plus, BarChart2 } from 'lucide-react';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*, enrollments(id)')
          .eq('instructor_id', user.id)
          .order('created_at', { ascending: false });

        if (error) console.error('Error loading courses:', error);
        else if (mounted) setCourses(data ?? []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user]);

  const filtered = courses.filter(c => {
    if (!query) return true;
    return (c.title || '').toLowerCase().includes(query.toLowerCase()) || (c.category || '').toLowerCase().includes(query.toLowerCase());
  });

  // Delete course function
  const deleteCourse = async (courseId) => {
    if (!user) return alert('Please log in');
    const confirm = window.confirm('Are you sure you want to delete this course? This action cannot be undone.');
    if (!confirm) return;

    setProcessingId(courseId);
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
      .eq('instructor_id', user.id);

    setProcessingId(null);

    if (error) {
      alert('Failed to delete course: ' + error.message);
    } else {
      setCourses(prev => prev.filter(c => c.id !== courseId));
      alert('Course deleted successfully');
    }
  };

  const togglePublish = async (course) => {
    if (!user) return;
    setProcessingId(course.id);
    const { error } = await supabase
      .from('courses')
      .update({ published: !course.published })
      .eq('id', course.id)
      .eq('instructor_id', user.id);

    setProcessingId(null);

    if (error) alert('Failed to update publish status: ' + error.message);
    else setCourses(prev => prev.map(c => c.id === course.id ? { ...c, published: !c.published } : c));
  };

  if (!user) return <div className="p-6">Please log in as an instructor.</div>;
  if (loading) return <div className="p-6">Loading your courses…</div>;

  return (
    <div className="pt-20 px-6 max-w-6xl mx-auto">
      <header className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold">Instructor Dashboard</h2>
          <p className="mt-1 text-gray-500">Manage your courses, track students, and publish updates.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search by title or category"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="px-3 py-2 border rounded-md w-64"
          />
          <button
            onClick={() => navigate('/instructor/courses/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded shadow-sm"
          >
            <Plus size={16} /> Create course
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && (
          <div className="col-span-full p-6 border rounded-lg text-center">
            <h3 className="text-xl font-semibold">No courses found</h3>
            <p className="mt-2 text-gray-600">Create your first course to share knowledge with students.</p>
            <button onClick={() => navigate('/instructor/courses/new')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Create course</button>
          </div>
        )}

        {filtered.map(c => {
          const students = Array.isArray(c.enrollments) ? c.enrollments.length : 0;
          return (
            <article key={c.id} className="bg-white border rounded-lg pb-10 shadow-sm overflow-hidden">
              <div className="h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                {c.thumbnail ? <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" /> :
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-300">{(c.title || '📚').split(' ').slice(0,2).map(s=>s[0]).join('')}</div>}
              </div>

              <div className="p-4 flex flex-col justify-between h-48">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{c.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{c.category} • {c.level}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{c.description ?? 'No description provided.'}</p>
                </div>

                <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><BarChart2 size={14} /> <span className="font-medium text-gray-800">{students}</span> students</div>
                    <div className="text-xs">Created: {new Date(c.created_at).toLocaleDateString()}</div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* PUBLISH/UNPUBLISH BUTTON 
                    <button
                      onClick={() => togglePublish(c)}
                      disabled={processingId === c.id}
                      className={`px-3 py-1.5 rounded text-sm border ${c.published ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}
                    >
                      {processingId === c.id ? 'Updating...' : (c.published ? 'Published' : 'Unpublished')}
                    </button>
                    */}

                    <Link to={`/instructor/courses/${c.id}/edit`} className="px-3 py-1.5 border rounded text-sm inline-flex items-center gap-2"><Edit3 size={14} /> Edit</Link>
                    <Link to={`/instructor/courses/${c.id}/lessons`} className="px-3 py-1.5 border rounded text-sm inline-flex items-center gap-2"><Play size={14} /> Add Lessons</Link>
                    <a href={`/courses/${c.id}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 border rounded text-sm inline-flex items-center gap-2 text-gray-600"><Eye size={14} /> Public</a>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => deleteCourse(c.id)}
                      disabled={processingId === c.id}
                      className="px-3 py-1.5 rounded text-sm text-red-600 border hover:bg-red-50 inline-flex items-center gap-2"
                    >
                      {processingId === c.id ? 'Deleting...' : <><Trash2 size={14} /> Delete</>}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
