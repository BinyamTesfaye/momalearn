// src/features/instructor/ManageCourseLessons.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../lib/supabaseClient";

export default function ManageCourseLessons() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ title: "", position: 1 });
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [docFiles, setDocFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", position: 1 });
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [editPdfFiles, setEditPdfFiles] = useState([]);
  const [editDocFiles, setEditDocFiles] = useState([]);
  const [editContents, setEditContents] = useState([]);
  const [editSaving, setEditSaving] = useState(false);

  const BUCKET = "course-media";

  // Load lessons
  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("position", { ascending: true });
      if (error) console.error(error);
      else if (mounted) setLessons(data ?? []);
    }
    load();
    return () => { mounted = false; };
  }, [courseId]);

  // ---------- Helpers ----------
  async function uploadFileToBucket(file, prefix = "") {
    const fileName = `${prefix}${Date.now()}_${file.name}`;
    const path = `${courseId}/${fileName}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: urlData.publicUrl, name: file.name };
  }

async function uploadSelectedFiles(pdfFilesLocal, docFilesLocal) {
  const contents = [];
  for (const file of pdfFilesLocal) {
    const uploaded = await uploadFileToBucket(file, "pdf_");
    contents.push({ type: "pdf", url: uploaded.url, name: uploaded.name }); // Fixed typo here
  }
  for (const file of docFilesLocal) {
    const uploaded = await uploadFileToBucket(file, "doc_");
    contents.push({ type: "doc", url: uploaded.url, name: uploaded.name }); // Fixed typo here
  }
  return contents;
}


function computeContentType(contents = []) {
  if (!contents || contents.length === 0) return 'none';

  // Get all unique content types
  const types = new Set();
  contents.forEach(content => {
    if (content.type) types.add(content.type.toLowerCase());
  });

  // Determine the content type based on unique types
  if (types.size === 0) return 'none';
  if (types.size === 1) return types.values().next().value;
  return 'mixed';
}

  async function tryInsertLesson(payloadBase, contents) {
    const payload = { ...payloadBase, contents, content_type: computeContentType(contents) };
    const { data, error } = await supabase.from("lessons").insert([payload]).select().single();
    if (error) throw error;
    return data;
  }

  async function tryUpdateLesson(id, updates, contents) {
    const payload = { ...updates, contents, content_type: computeContentType(contents) };
    const { data, error } = await supabase.from("lessons").update(payload).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  // ---------- Add Lesson ----------
 // ... existing code ...

async function addLesson(e) {
  e.preventDefault();
  if (!form.title.trim()) return alert("Please enter a lesson title.");
  setSaving(true);
  try {
    const contents = [];

    if (videoUrl.trim()) contents.push({ type: "video", url: videoUrl.trim(), name: "Video URL" });
    if (videoFile) {
      const uploaded = await uploadFileToBucket(videoFile, "video_");
      contents.push({ type: "video", url: uploaded.url, name: uploaded.name });
    }

    const uploadedFiles = await uploadSelectedFiles(pdfFiles, docFiles);
    contents.push(...uploadedFiles);

    // Fixed the typo here - changed payloadBase to payloadBase
    const payloadBase = { title: form.title, course_id: courseId, position: lessons.length > 0 ? lessons.length + 1 : 1 };

    const inserted = await tryInsertLesson(payloadBase, contents);
    setLessons(prev => [...prev, inserted]);

    setForm({ title: "", position: lessons.length + 2 });
    setVideoUrl(""); setVideoFile(null);
    setPdfFiles([]); setDocFiles([]);
    alert("Lesson added successfully.");
  } catch (err) {
    console.error(err);
    alert("Add failed: " + (err?.message || err));
  } finally { setSaving(false); }
}

// ... rest of the code ...

  // ---------- Delete Lesson ----------
  async function removeLesson(id) {
    if (!confirm("Delete lesson?")) return;
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) return alert("Delete failed: " + error.message);
    setLessons(prev => prev.filter(l => l.id !== id));
  }

  // ---------- Edit ----------
  function startEdit(lesson) {
    setEditingId(lesson.id);
    setEditForm({ title: lesson.title, position: lesson.position });
    setEditContents(Array.isArray(lesson.contents) ? lesson.contents.map(c => ({ ...c })) : []);
    const firstVideo = (lesson.contents || []).find(c => c.type === "video");
    setEditVideoUrl(firstVideo ? firstVideo.url : "");
    setEditVideoFile(null);
    setEditPdfFiles([]); setEditDocFiles([]);
  }

  function removeContentItemFromEdit(index) {
    if (!confirm("Remove this content item? This won't delete the file from storage.")) return;
    setEditContents(prev => prev.filter((_, i) => i !== index));
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editingId) return;
    setEditSaving(true);
    try {
      const contents = [...editContents];

      if (editVideoUrl && !contents.some(c => c.type === "video" && c.url === editVideoUrl)) {
        contents.unshift({ type: "video", url: editVideoUrl, name: "Video URL" });
      }
      if (editVideoFile) {
        const uploaded = await uploadFileToBucket(editVideoFile, "video_");
        contents.unshift({ type: "video", url: uploaded.url, name: uploaded.name });
      }

      const uploadedFiles = await uploadSelectedFiles(editPdfFiles, editDocFiles);
      contents.push(...uploadedFiles);

      const updates = { title: editForm.title, position: editForm.position };
      const updated = await tryUpdateLesson(editingId, updates, contents);
      setLessons(prev => prev.map(l => (l.id === editingId ? updated : l)));

      setEditingId(null); setEditForm({ title: "", position: 1 });
      setEditVideoUrl(""); setEditVideoFile(null);
      setEditPdfFiles([]); setEditDocFiles([]); setEditContents([]);
      alert("Lesson updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Update failed: " + (err?.message || err));
    } finally { setEditSaving(false); }
  }

  return (
    <div className="pt-10 px-10">
      <h2 className="text-2xl font-semibold">Manage Lessons</h2>

      {/* Add Lesson Form */}
      <form onSubmit={addLesson} className="mt-4 space-y-4 max-w-2xl">
        <input
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
          placeholder="Lesson Title"
          className="w-full border p-3 rounded"
        />

        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input type="radio" checked={!videoFile} onChange={() => setVideoFile(null)} /> Video URL
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={!!videoFile} onChange={() => setVideoUrl("")} /> Video File
          </label>
        </div>

        {!videoFile ? (
          <input
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="Video URL"
            className="w-full border p-3 rounded"
          />
        ) : (
          <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} />
        )}

        {/* PDF */}
        <div>
          <label className="font-medium">PDF Files</label>
          <input type="file" accept="application/pdf" multiple onChange={e => setPdfFiles(Array.from(e.target.files||[]))} />
          {pdfFiles.length > 0 && <p className="text-xs text-gray-500">{pdfFiles.length} file(s) selected</p>}
        </div>

        {/* DOC */}
        <div>
          <label className="font-medium">DOC Files</label>
          <input type="file" accept=".doc,.docx" multiple onChange={e => setDocFiles(Array.from(e.target.files||[]))} />
          {docFiles.length > 0 && <p className="text-xs text-gray-500">{docFiles.length} file(s) selected</p>}
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded">
          {saving ? "Saving..." : "Add Lesson"}
        </button>
      </form>

      {/* Lessons List */}
      <ul className="mt-6 space-y-3 max-w-3xl">
        {lessons.map(l => (
          <li key={l.id} className="p-3 border rounded flex justify-between items-start">
            <div>
              <div className="font-medium">{l.position}. {l.title}</div>
              <div className="text-xs text-gray-600 mt-1">
                {l.contents?.length>0 ? (
                  <>
                    {l.contents.filter(c=>c.type==="video").length>0 && <span className="mr-2">🎬 Video</span>}
                    {l.contents.filter(c=>c.type==="pdf").length>0 && <span className="mr-2">📄 PDF ({l.contents.filter(c=>c.type==="pdf").length})</span>}
                    {l.contents.filter(c=>c.type==="doc").length>0 && <span className="mr-2">📝 DOC ({l.contents.filter(c=>c.type==="doc").length})</span>}
                  </>
                ) : <span className="text-gray-400">No content</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>startEdit(l)} className="text-yellow-600">Edit</button>
              <button onClick={()=>removeLesson(l.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative z-60 bg-white rounded-lg max-w-2xl w-full shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">Edit Lesson</h3>
              <button onClick={()=>setEditingId(null)} className="text-gray-600 hover:text-gray-800">✕</button>
            </div>
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <form onSubmit={saveEdit} id="edit-lesson-form" className="space-y-4">
                <input
                  value={editForm.title}
                  onChange={e=>setEditForm({...editForm,title:e.target.value})}
                  className="w-full border p-2 rounded"
                  placeholder="Lesson Title"
                />

                {/* Video */}
                <div className="flex gap-4 items-center">
                  <label>
                    <input type="radio" checked={!editVideoFile} onChange={()=>setEditVideoFile(null)} /> URL
                  </label>
                  <label>
                    <input type="radio" checked={!!editVideoFile} onChange={()=>setEditVideoUrl("")} /> File
                  </label>
                </div>
                {!editVideoFile ? (
                  <input value={editVideoUrl} onChange={e=>setEditVideoUrl(e.target.value)} placeholder="Video URL" className="w-full border p-2 rounded"/>
                ) : (
                  <input type="file" accept="video/*" onChange={e=>setEditVideoFile(e.target.files[0])}/>
                )}

                {/* Existing contents */}
                <div>
                  <p className="font-medium text-sm mb-2">Existing Content</p>
                  {editContents.length===0 ? <p className="text-gray-500 text-xs">No content</p> : (
                    <ul className="space-y-2">
                      {editContents.map((c,i)=>(
                        <li key={i} className="flex justify-between border p-2 rounded">
                          <span>{c.name} ({c.type})</span>
                          <button type="button" onClick={()=>removeContentItemFromEdit(i)} className="text-red-600">Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* PDF/DOC upload */}
                <div>
                  <label>PDF Files</label>
                  <input type="file" accept="application/pdf" multiple onChange={e=>setEditPdfFiles(Array.from(e.target.files||[]))}/>
                  {editPdfFiles.length>0 && <p className="text-xs text-gray-500">{editPdfFiles.length} file(s) selected</p>}
                </div>
                <div>
                  <label>DOC Files</label>
                  <input type="file" accept=".doc,.docx" multiple onChange={e=>setEditDocFiles(Array.from(e.target.files||[]))}/>
                  {editDocFiles.length>0 && <p className="text-xs text-gray-500">{editDocFiles.length} file(s) selected</p>}
                </div>
              </form>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-3 flex justify-end gap-2">
              <button type="button" onClick={()=>setEditingId(null)} className="px-3 py-2 border rounded">Cancel</button>
              <button type="submit" form="edit-lesson-form" disabled={editSaving} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">
                {editSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
