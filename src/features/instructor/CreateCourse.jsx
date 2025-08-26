import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Image, Upload, PlusCircle, Check } from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'Data Science',
  'Mobile Development',
  'Design',
  'Marketing',
  'Business',
  'DevOps',
  'Other',
];

export default function CreateCourse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', level: 'beginner', category: CATEGORIES[0], thumbnail: '' });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return alert('Please select an image file');
    const max = 5 * 1024 * 1024; // 5MB
    if (f.size > max) return alert('Please pick an image smaller than 5MB');

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to create a course');
    if (!form.title.trim()) return alert('Please provide a course title');

    setSaving(true);

    try {
      let thumbnailUrl = form.thumbnail;

      if (file) {
        setUploading(true);
        // place thumbnails inside folder by instructor id for easier management
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const bucket = 'course-thumbnails';

        const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
        if (uploadError) {
          console.error('Upload error', uploadError);
          throw new Error(uploadError.message || 'Upload failed');
        }

        // get public url (sdk shapes vary) — handle common variants
        const getUrlResult = supabase.storage.from(bucket).getPublicUrl(fileName);
        const publicUrl = getUrlResult?.data?.publicUrl ?? getUrlResult?.publicURL ?? null;

        // fallback build public url if necessary
        if (!publicUrl) {
          const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || window.location.origin;
          thumbnailUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodeURIComponent(fileName)}`;
        } else {
          thumbnailUrl = publicUrl;
        }

        setUploading(false);
      }

      const payload = {
        title: form.title,
        description: form.description,
        level: form.level,
        category: form.category,
        thumbnail: thumbnailUrl,
        instructor_id: user.id,
      };

      const { error } = await supabase.from('courses').insert([payload]);

      if (error) {
        console.error('Create course error', error);
        throw new Error(error.message || 'Failed to create course');
      }

      // success
      navigate('/instructor');
    } catch (err) {
      alert(err.message || 'An error occurred');
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  return (
    <div className="pt-20 px-6 max-w-4xl mx-auto">
      <form onSubmit={handleCreate} className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <header className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">Create a new course</h2>
            <p className="mt-1 text-sm text-gray-500">Fill in the details below to publish your course. Keep the title short and descriptive.</p>
          </div>
          <div className="text-sm text-gray-500">Signed in as <span className="font-medium">{user?.email}</span></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2 space-y-4">
            <label className="block">
              <div className="text-sm font-medium text-gray-700 mb-2">Course title</div>
              <input
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Intro to React — build real apps"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>

            <label className="block">
              <div className="text-sm font-medium text-gray-700 mb-2">Description</div>
              <textarea
                className="w-full p-3 border rounded min-h-[140px] focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Write a short pitch for your course. What will students learn? Any prereqs?"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <div className="text-sm font-medium text-gray-700 mb-2">Level</div>
                <select
                  className="w-full p-3 border rounded"
                  value={form.level}
                  onChange={e => setForm({ ...form, level: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>

              <label className="block">
                <div className="text-sm font-medium text-gray-700 mb-2">Category</div>
                <select
                  className="w-full p-3 border rounded"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <aside className="flex flex-col items-center gap-4">
            <div className="w-full">
              <div className="text-sm font-medium text-gray-700 mb-2">Thumbnail</div>

              <div className="w-full h-40 border rounded-md bg-gray-50 overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="thumbnail preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <Image className="mx-auto mb-2" />
                    <div className="text-sm">No thumbnail yet</div>
                  </div>
                )}
              </div>

              <label className="mt-3 inline-flex items-center gap-2 w-full">
                <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                <span className="flex-1 inline-flex items-center justify-center px-3 py-2 border rounded cursor-pointer hover:bg-gray-50">
                  <Upload className="mr-2" /> Choose image
                </span>
              </label>

              <div className="mt-2 text-xs text-gray-500">Recommended: JPG/PNG under 5MB. Will be shown on course cards.</div>
            </div>

            <div className="w-full">
              <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
              <div className="w-full p-3 border rounded bg-gray-50 text-sm text-gray-700">This is how your course card will appear in lists and search results.</div>
            </div>
          </aside>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">By publishing you agree to our community guidelines.</div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/instructor')}
              className="px-4 py-2 border rounded text-sm"
              disabled={saving || uploading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded shadow-sm disabled:opacity-50"
            >
              {saving || uploading ? (
                <>
                  <PlusCircle className="animate-pulse" /> Saving...
                </>
              ) : (
                <>
                  <Check /> Create course
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
