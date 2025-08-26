import React, { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({ full_name: '', bio: '', profile_image: '' });
  const [loading, setLoading] = useState(true);

  // local file state for preview + upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('full_name, bio, profile_image')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Failed to load profile:', error);
          if (mounted) setProfile({ full_name: '', bio: '', profile_image: '' });
        } else if (mounted && data) {
          setProfile({
            full_name: data.full_name ?? '',
            bio: data.bio ?? '',
            profile_image: data.profile_image ?? '',
          });
          setPreviewUrl(data.profile_image ?? '');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user]);

  // When user selects a file, create preview and keep file in state
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Basic validation: image only and size limit (e.g., 5MB)
    if (!file.type.startsWith('image/')) {
      return alert('Please pick an image file.');
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return alert('Image too large — please use a file under 5MB.');
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Upload selectedFile to Supabase Storage and return public URL (or null on failure)
  async function uploadAvatarFile(file) {
    if (!file || !user) return null;
    try {
      setUploading(true);

      // define a path: avatars/{userId}/{timestamp}_{filename}
      const fileExt = file.name.split('.').pop();
      const filename = `${user.id}/${Date.now()}.${fileExt}`;
      const bucket = 'avatars'; // change if your bucket name is different

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Upload failed: ' + uploadError.message);
        return null;
      }

      // Try getting a public URL. Different supabase clients sometimes return different shapes,
      // so handle both common responses.
      let publicUrl = null;
      try {
        const getUrl = supabase.storage.from(bucket).getPublicUrl(filename);
        // v1 returns { publicURL }, v2 returns { data: { publicUrl } } in some SDK builds.
        if (getUrl?.publicURL) publicUrl = getUrl.publicURL;
        else if (getUrl?.data?.publicUrl) publicUrl = getUrl.data.publicUrl;
        else if (getUrl?.data?.publicURL) publicUrl = getUrl.data.publicURL;
      } catch (err) {
        console.warn('getPublicUrl error:', err);
      }

      // Fallback: construct the public path for Supabase hosted public buckets.
      // This works if the bucket is public. Format: /storage/v1/object/public/{bucket}/{path}
      // We can build it from your supabase client URL (if available).
      if (!publicUrl) {
        try {
          const supabaseUrl = supabase?.auth?.url?.split('/').slice(0,3).join('/') || process.env.REACT_APP_SUPABASE_URL;
          if (supabaseUrl) {
            publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodeURIComponent(filename)}`;
          }
        } catch (err) {
          console.warn('fallback url build failed', err);
        }
      }

      return publicUrl;
    } finally {
      setUploading(false);
    }
  }

  const removeAvatar = async () => {
    // Just clear the profile_image field (does not delete storage object)
    if (!user) return;
    const ok = window.confirm('Remove your avatar from your profile? This will not delete the file from storage.');
    if (!ok) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('users').update({ profile_image: '' }).eq('id', user.id);
      if (error) {
        alert('Failed to remove avatar: ' + error.message);
      } else {
        setProfile(prev => ({ ...prev, profile_image: '' }));
        setPreviewUrl('');
        alert('Avatar removed.');
        refreshUser && refreshUser();
      }
    } finally {
      setSaving(false);
    }
  };

  async function save() {
    if (!user) {
      alert('You must be logged in to save.');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = profile.profile_image;

      // If user selected a file, upload it first
      if (selectedFile) {
        const uploadedUrl = await uploadAvatarFile(selectedFile);
        if (!uploadedUrl) {
          // upload failed; abort save
          return;
        }
        imageUrl = uploadedUrl;
      }

      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          profile_image: imageUrl ?? '',
        })
        .eq('id', user.id);

      if (error) {
        alert('Save failed: ' + error.message);
        return;
      }

      alert('Profile saved.');
      setProfile(prev => ({ ...prev, profile_image: imageUrl ?? '' }));
      setSelectedFile(null);
      refreshUser && refreshUser();
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <div className="p-6">Please log in to edit your profile.</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="pt-20 px-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Your Profile</h2>

      <div className="mt-6 bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              // previewUrl could be local object URL or a public url
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img src={previewUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="text-3xl text-gray-300">{(profile.full_name || 'U').split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
            )}
          </div>

          <div className="flex-1">
            <div className="text-sm text-gray-600">Profile photo</div>
            <div className="mt-2 flex items-center gap-3">
              <label className="inline-flex items-center px-3 py-2 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {uploading ? 'Uploading...' : 'Choose photo'}
              </label>

              {profile.profile_image && !selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    // show existing image in preview
                    setPreviewUrl(profile.profile_image);
                  }}
                  className="px-3 py-2 border rounded text-sm"
                >
                  Preview current
                </button>
              )}

              {(previewUrl || profile.profile_image) && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  disabled={saving}
                  className="px-3 py-2 border rounded text-sm text-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="text-xs text-gray-500 mt-2">Recommended: JPG/PNG under 5MB</div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <label className="block">
            <div className="text-sm text-gray-600 mb-1">Full name</div>
            <input
              value={profile.full_name}
              onChange={e => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full p-3 border rounded"
              placeholder="Your full name"
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-600 mb-1">Bio</div>
            <textarea
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 border rounded"
              rows={4}
              placeholder="A short bio for your profile"
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving || uploading}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save profile'}
            </button>

            <button
              onClick={() => {
                // reset preview if user cancels selection
                setSelectedFile(null);
                setPreviewUrl(profile.profile_image || '');
              }}
              className="px-4 py-2 border rounded text-sm"
              disabled={saving || uploading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
