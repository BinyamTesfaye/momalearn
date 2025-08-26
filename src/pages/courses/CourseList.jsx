// src/pages/courses/CourseList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';

export default function CourseList() {
  const { courses, loading, page, total, nextPage, prevPage, setQuery, setCategory } = useCourses({ perPage: 9 });

  return (
    <div className="p-30">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold">Courses</h2>
          <div className="flex gap-2">
            <input onChange={e => setQuery(e.target.value)} placeholder="Search courses..." className="p-2 border rounded" />
            <select onChange={e => setCategory(e.target.value)} className="p-2 border rounded">
              <option value="">All categories</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </header>

        {loading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map(c => (
              <article key={c.id} className="rounded-lg shadow p-4 bg-white">
                {c.thumbnail && <img src={c.thumbnail} alt={c.title} className="h-40 w-full object-cover rounded" />}
                <h3 className="mt-3 font-semibold text-lg">{c.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{c.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <Link to={`/courses/${c.id}`} className="text-indigo-600">Open course</Link>
                  <span className="text-xs text-gray-500">{c.level}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-6 flex items-center justify-between">
          <div>Showing page {page} • {total} results</div>
          <div className="space-x-2">
            <button onClick={prevPage} className="px-3 py-1 border rounded">Prev</button>
            <button onClick={nextPage} className="px-3 py-1 border rounded">Next</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
