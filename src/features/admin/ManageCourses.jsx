
// Save as: src/features/admin/ManageCourses.jsx
import React, { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { FileUploader } from '../../components/FileUploader';


export default function ManageCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => { (async () => {
    const { data } = await supabase.from('courses').select('*, instructor:instructor_id (id, full_name)').order('created_at', { ascending: false });
    setCourses(data ?? []);
  })(); }, []);

  async function removeCourse(id) {
    if (!confirm('Delete course?')) return;
    await supabase.from('courses').delete().eq('id', id);
    setCourses(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Manage Courses</h1>
      <div className="mt-4 space-y-2">
        {courses.map(c => (
          <div key={c.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-gray-500">By {c.instructor?.full_name}</div>
            </div>
            <div className="space-x-2">
              <Link to={`/admin/courses/${c.id}`} className="text-indigo-600">Open</Link>
              <button onClick={() => removeCourse(c.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
