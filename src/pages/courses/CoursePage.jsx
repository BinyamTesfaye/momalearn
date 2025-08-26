// src/pages/courses/CoursePage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import FileUploader from '../../components/FileUploader'; // default import supported by uploader code

export default function CoursePage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data: courseData } = await supabase
        .from('courses')
        .select('*, instructor:instructor_id (id, full_name)')
        .eq('id', courseId)
        .single();
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('position', { ascending: true });

      if (mounted) {
        setCourse(courseData);
        setLessons(lessonsData ?? []);
      }

      if (user) {
        const { data: e } = await supabase
          .from('enrollments')
          .select('*')
          .match({ student_id: user.id, course_id: courseId });
        if (mounted) setEnrolled(Array.isArray(e) && e.length > 0);
      }

      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, [courseId, user]);

  async function handleEnroll() {
    if (!user) return alert('Please login');
    const { error } = await supabase.from('enrollments').insert([{ student_id: user.id, course_id: courseId }]);
    if (error) return alert('Enroll failed: ' + error.message);
    setEnrolled(true);
  }

  async function handleUploadComplete(url) {
    const pos = lessons.length + 1;
    const { data } = await supabase
      .from('lessons')
      .insert([{ course_id: courseId, title: `Lesson ${pos}`, content_type: 'video', content_url: url, position: pos }])
      .select()
      .single();
    setLessons(prev => [...prev, data]);
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!course) return <div className="p-6">Course not found.</div>;

  return (
    <div className="p-30 max-w-4xl mx-auto">
      <header className="flex items-start gap-6">
        {course.thumbnail && <img src={course.thumbnail} className="w-48 h-32 object-cover rounded" alt="thumbnail" />}
        <div>
          <h2 className="text-2xl font-bold">{course.title}</h2>
          <p className="text-sm text-gray-600 mt-2">{course.description}</p>
          <div className="mt-4">
            {!enrolled ? (
              <button onClick={handleEnroll} className="px-4 py-2 bg-indigo-600 text-white rounded">Enroll</button>
            ) : (
              <Link to="/student/my-courses" className="px-4 py-2 bg-green-600 text-white rounded">Go to my courses</Link>
            )}
          </div>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="font-semibold">Lessons</h2>
        <ul className="mt-3 space-y-2">
          {lessons.map(l => (
            <li key={l.id} className="p-3 bg-white rounded shadow-sm flex items-center justify-between">
              <div>
                <div className="font-medium">{l.title}</div>
                <div className="text-xs text-gray-500">{l.content_type}</div>
              </div>
              <Link to={`/courses/${courseId}/lessons/${l.id}`} className="text-indigo-600">Open</Link>
            </li>
          ))}
        </ul>
      </section>

      {user && user.id === course.instructor_id && (
        <section className="mt-8">
          <h3 className="font-semibold">Instructor Tools</h3>
          <p className="text-sm text-gray-500">Upload a video to add a lesson directly.</p>
          <FileUploader bucket="course-media" onComplete={handleUploadComplete} />
        </section>
      )}
    </div>
  );
}
