import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';


export default function EditCourse() {
const { courseId } = useParams();
const navigate = useNavigate();
const [form, setForm] = useState({ title: '', description: '', level: 'beginner', category: '', thumbnail: '' });
const [loading, setLoading] = useState(true);


useEffect(() => {
let mounted = true;
async function load() {
const { data } = await supabase.from('courses').select('*').eq('id', courseId).single();
if (mounted && data) setForm({ title: data.title, description: data.description, level: data.level, category: data.category, thumbnail: data.thumbnail });
setLoading(false);
}
load();
return () => { mounted = false; };
}, [courseId]);


async function save(e) {
e.preventDefault();
await supabase.from('courses').update(form).eq('id', courseId);
navigate('/instructor');
}


if (loading) return <div className="p-6">Loading...</div>;


return (
<form onSubmit={save} className="space-y-3">
<h2 className="text-2xl font-semibold">Edit Course</h2>
<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-2 border rounded" />
<textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded" />
<input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full p-2 border rounded" />
<select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="w-full p-2 border rounded">
<option value="beginner">Beginner</option>
<option value="intermediate">Intermediate</option>
<option value="advanced">Advanced</option>
</select>
<input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} className="w-full p-2 border rounded" />
<div>
<button className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
</div>
</form>
);
}