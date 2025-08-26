// src/components/FileUploader.jsx
import React, { useState } from 'react';
import supabase from '../lib/supabaseClient';

/**
 * FileUploader
 * Props:
 *  - bucket (string) default: 'public' or your storage bucket name
 *  - onComplete(url: string) callback when upload finishes with public URL
 */
export function FileUploader({ bucket = 'course-media', onComplete }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // upload file
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // NOTE: getPublicUrl is synchronous in supabase-js and returns { data: { publicUrl } }
      const { data: publicData, error: pubErr } = await supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      if (pubErr) {
        // some supabase versions return the public url directly; try the fallback below
        console.warn('getPublicUrl returned error:', pubErr.message || pubErr);
      }

      // Try several possible places for the URL to be present to be robust across SDK versions
      const publicUrl =
        (publicData && (publicData.publicUrl || publicData.publicURL)) ||
        // fallback: construct URL for public bucket (only if your bucket is public)
        `${process.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}`;

      setUploading(false);
      setProgress(100);
      onComplete && onComplete(publicUrl);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed: ' + (err.message || err));
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className="space-y-2">
      <input type="file" onChange={handleFile} />
      {uploading && (
        <div className="w-full bg-gray-100 rounded overflow-hidden">
          <div style={{ width: `${progress}%` }} className="h-2 bg-indigo-600 transition-all" />
        </div>
      )}
    </div>
  );
}

// default export too (so `import FileUploader from '.../FileUploader'` works)
export default FileUploader;
