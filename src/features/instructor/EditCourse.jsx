import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', level: 'beginner', category: '', thumbnail: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  // NOTE: this expects a Supabase storage bucket named 'course-thumbnails'.
  // Create it in your Supabase project (or change the bucket name below).
  const BUCKET = 'course-thumbnails';

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { data, error: fetchError } = await supabase.from('courses').select('title,description,level,category,thumbnail').eq('id', courseId).single();
        if (fetchError) throw fetchError;
        if (mounted && data) {
          setForm({ title: data.title || '', description: data.description || '', level: data.level || 'beginner', category: data.category || '', thumbnail: data.thumbnail || '' });
          setPreview(data.thumbnail || '');
        }
      } catch (err) {
        console.error('Failed loading course', err);
        setError('Failed to load course.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [courseId]);

  // handle file selection + upload to Supabase storage
  async function handleFileChange(e) {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // preview locally immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // upload to Supabase
    try {
      setUploading(true);
      // build a path: courseId + timestamp + original name
      const filePath = `course-${courseId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;

      const { data: uploadData, error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      // get public url (bucket must allow public access) — if bucket is private you'll need to generate signed URLs instead
      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path);
      if (!publicData || !publicData.publicUrl) {
        // fallback: store the storage path and rely on server-side rendering or signed URLs later
        setForm(prev => ({ ...prev, thumbnail: uploadData.path }));
      } else {
        setForm(prev => ({ ...prev, thumbnail: publicData.publicUrl }));
      }

      setSuccess('Thumbnail uploaded. Don\'t forget to save the course.');
    } catch (err) {
      console.error('Upload error', err);
      setError('Failed to upload thumbnail. Make sure the storage bucket exists and is configured.');
    } finally {
      setUploading(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // basic validation
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.description.trim()) return setError('Description is required.');

    try {
      setSaving(true);
      const { error: updateError } = await supabase.from('courses').update({
        title: form.title,
        description: form.description,
        level: form.level,
        category: form.category,
        thumbnail: form.thumbnail,
      }).eq('id', courseId);

      if (updateError) throw updateError;
      setSuccess('Course updated successfully.');
      // small delay so user can see success message
      setTimeout(() => navigate('/instructor'), 900);
    } catch (err) {
      console.error('Save error', err);
      setError('Failed to save course.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading course...</div>;

  return (
    <div className="pt-12 px-6 max-w-3xl mx-auto">
      <form onSubmit={save} className="space-y-6 bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">Edit Course</h2>
          <div className="text-sm text-gray-500">Course ID: <span className="font-mono">{form.title}</span></div>
        </div>

        {error && <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        {success && <div className="text-green-700 bg-green-50 p-3 rounded">{success}</div>}

        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Title</span>
            <input
              className="mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Enter course title"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Description</span>
            <textarea
              className="mt-1 block w-full p-3 border rounded-md min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Write a compelling course description"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium">Category</span>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1 block w-full p-3 border rounded-md" placeholder="e.g. Design, Development" />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Level</span>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="mt-1 block w-full p-3 border rounded-md">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
          </div>

          <div>
            <span className="text-sm font-medium">Thumbnail</span>
            <div className="mt-2 flex items-center gap-4">
              <div className="w-36 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center border">
                {preview ? (
                  // preview could be a blob URL or a public url
                  <img src={preview} alt="thumbnail preview" className="object-cover w-full h-full" />
                ) : (
                  <div className="text-xs text-gray-500 p-2 text-center">No thumbnail yet<br/>Add a file</div>
                )}
              </div>

              <div className="flex-1">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-700" />
                <div className="mt-2 text-xs text-gray-500">Upload an image instead of entering a URL — it will be stored in Supabase Storage.</div>
                {uploading && <div className="mt-2 text-sm">Uploading thumbnail...</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/instructor')} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" disabled={saving} className={`px-4 py-2 rounded-md text-white ${saving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" strokeDasharray="60" strokeDashoffset="0"></circle></svg>
                  Saving...
                </span>
              ) : 'Save'}
            </button>
          </div>

          <div className="text-sm text-gray-500">
            {form.thumbnail ? <span>Thumbnail set</span> : <span className="italic">No thumbnail</span>}
          </div>
        </div>
      </form>

      <div className="mt-6 text-xs text-gray-400">Tip: Make sure your Supabase storage bucket (<span className="font-mono">{BUCKET}</span>) exists and is public if you want simple public URLs. For private buckets, adapt the code to use signed URLs.</div>
    </div>
  );
}
