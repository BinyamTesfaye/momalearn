import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../lib/supabaseClient";

// Professional, compact & manageable ManageCourseLessons component
// Features:
// - Upload video/pdf/doc files to Supabase Storage (bucket: course-media)
// - Add / Edit / Delete lessons
// - Reorder lessons (move up / move down) and persist positions
// - Content preview list and content-type auto-detection
// - Small toast notifications and loading / saving states

export default function ManageCourseLessons() {
  const { courseId } = useParams();
  const BUCKET = "course-media"; // change if needed

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Add form
  const [form, setForm] = useState({ title: "", position: 1 });
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [docFiles, setDocFiles] = useState([]);

  // Edit form
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", position: 1 });
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [editPdfFiles, setEditPdfFiles] = useState([]);
  const [editDocFiles, setEditDocFiles] = useState([]);
  const [editContents, setEditContents] = useState([]);
  const [editSaving, setEditSaving] = useState(false);

  // refs
  const fileInputPdfRef = useRef(null);
  const fileInputDocRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function loadLessons() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .order("position", { ascending: true });
        if (error) throw error;
        if (mounted) setLessons(data ?? []);
      } catch (err) {
        console.error("Failed to load lessons", err);
        showToast("Failed to load lessons");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadLessons();
    return () => { mounted = false; };
  }, [courseId]);

  // ---------- Utilities ----------
  function showToast(message, ms = 3000) {
    setToast(message);
    setTimeout(() => setToast(null), ms);
  }

  function computeContentType(contents = []) {
    if (!contents || contents.length === 0) return "none";
    const types = new Set();
    contents.forEach(c => c.type && types.add(c.type.toLowerCase()));
    if (types.size === 0) return "none";
    if (types.size === 1) return Array.from(types)[0];
    return "mixed";
  }

  async function uploadFileToBucket(file, prefix = "") {
    if (!file) throw new Error("No file provided");
    // small safety: limit files to 500MB for videos and 20MB for docs/pdfs
    const maxVideo = 500 * 1024 * 1024;
    const maxDocPdf = 20 * 1024 * 1024;
    if (file.type.startsWith("video/") && file.size > maxVideo) throw new Error("Video too large (max 500MB)");
    if (!file.type.startsWith("video/") && file.size > maxDocPdf) throw new Error("File too large (max 20MB)");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${courseId}/${prefix}${Date.now()}_${safeName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path);
    // urlData.publicUrl exists when bucket is public. If bucket is private, you may want to store the path and generate signed URLs when serving.
    const publicUrl = urlData?.publicUrl ?? uploadData.path;
    return { url: publicUrl, name: file.name, path: uploadData.path };
  }

  async function uploadSelectedFiles(pdfFilesLocal = [], docFilesLocal = []) {
    const contents = [];
    for (const file of pdfFilesLocal) {
      const uploaded = await uploadFileToBucket(file, "pdf_");
      contents.push({ type: "pdf", url: uploaded.url, name: uploaded.name });
    }
    for (const file of docFilesLocal) {
      const uploaded = await uploadFileToBucket(file, "doc_");
      contents.push({ type: "doc", url: uploaded.url, name: uploaded.name });
    }
    return contents;
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
  async function addLesson(e) {
    e.preventDefault();
    if (!form.title.trim()) return showToast("Please enter a lesson title");
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

      // pick a position: if user set position use it, otherwise append
      const nextPosition = form.position && Number(form.position) > 0 ? Number(form.position) : (lessons.length > 0 ? lessons[lessons.length - 1].position + 1 : 1);
      const payloadBase = { title: form.title, course_id: courseId, position: nextPosition };

      const inserted = await tryInsertLesson(payloadBase, contents);
      // maintain order in client
      setLessons(prev => {
        const newList = [...prev, inserted].sort((a, b) => a.position - b.position);
        // normalize positions client-side (optional) -> keep DB as source of truth
        return newList;
      });

      // reset form
      setForm({ title: "", position: nextPosition + 1 });
      setVideoUrl(""); setVideoFile(null);
      setPdfFiles([]); setDocFiles([]);
      if (fileInputPdfRef.current) fileInputPdfRef.current.value = null;
      if (fileInputDocRef.current) fileInputDocRef.current.value = null;

      showToast("Lesson added");
    } catch (err) {
      console.error(err);
      showToast("Add failed: " + (err?.message || err));
    } finally { setSaving(false); }
  }

  // ---------- Delete Lesson ----------
  async function removeLesson(id) {
    if (!window.confirm("Are you sure you want to delete this lesson? This won't remove files from storage.")) return;
    try {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
      setLessons(prev => prev.filter(l => l.id !== id));
      showToast("Lesson deleted");
    } catch (err) {
      console.error(err);
      showToast("Delete failed: " + (err?.message || err));
    }
  }

  // ---------- Reorder ----------
  // Simple swap up/down approach
  async function swapPositions(a, b) {
    try {
      // optimistic UI change
      setLessons(prev => prev.map(l => {
        if (l.id === a.id) return { ...l, position: b.position };
        if (l.id === b.id) return { ...l, position: a.position };
        return l;
      }).sort((x, y) => x.position - y.position));

      // persist to DB
      const { error: e1 } = await supabase.from("lessons").update({ position: b.position }).eq("id", a.id);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("lessons").update({ position: a.position }).eq("id", b.id);
      if (e2) throw e2;

      showToast("Reordered");
    } catch (err) {
      console.error("Swap positions failed", err);
      showToast("Reorder failed");
      // reload to recover state
      reloadLessons();
    }
  }

  function moveUp(lesson) {
    const idx = lessons.findIndex(l => l.id === lesson.id);
    if (idx > 0) swapPositions(lesson, lessons[idx - 1]);
  }

  function moveDown(lesson) {
    const idx = lessons.findIndex(l => l.id === lesson.id);
    if (idx < lessons.length - 1) swapPositions(lesson, lessons[idx + 1]);
  }

  async function reloadLessons() {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("position", { ascending: true });
      if (error) throw error;
      setLessons(data ?? []);
    } catch (err) {
      console.error("Reload failed", err);
      showToast("Failed to reload lessons");
    }
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
    if (!window.confirm("Remove this content item? This won't delete the file from storage.")) return;
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

      const updates = { title: editForm.title, position: Number(editForm.position) };
      const updated = await tryUpdateLesson(editingId, updates, contents);
      setLessons(prev => prev.map(l => (l.id === editingId ? updated : l)).sort((a, b) => a.position - b.position));

      setEditingId(null);
      setEditForm({ title: "", position: 1 });
      setEditVideoUrl(""); setEditVideoFile(null);
      setEditPdfFiles([]); setEditDocFiles([]); setEditContents([]);

      showToast("Lesson updated");
    } catch (err) {
      console.error(err);
      showToast("Update failed: " + (err?.message || err));
    } finally { setEditSaving(false); }
  }

  // ---------- UI ----------
  return (
    <div className="pt-20 px-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Lessons</h2>
      {//}  <div className="text-sm text-gray-500">Course ID: <span className="font-mono">{courseId}</span></div>
}
      </div>

      {/* Toast */}
      {toast && <div className="fixed top-6 right-6 bg-black text-white px-4 py-2 rounded shadow">{toast}</div>}

      {/* Add form card */}
      <form onSubmit={addLesson} className="bg-white shadow rounded p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="col-span-2 border p-2 rounded" placeholder="Lesson title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
          <input className="border p-2 rounded" type="number" min={1} value={form.position} onChange={e=>setForm({...form, position:e.target.value})} />
        </div>

        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Video URL</label>
            <input value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://..." className="w-full border p-2 rounded mt-1" />
            <div className="text-xs text-gray-400 mt-1">Or upload a video file below</div>
          </div>

          <div>
            <label className="text-sm font-medium">Upload Video</label>
            <input type="file" accept="video/*" onChange={e=>setVideoFile(e.target.files?.[0] ?? null)} className="w-full mt-1" />
            {videoFile && <div className="text-xs text-gray-600 mt-1">Selected: {videoFile.name}</div>}
          </div>
        </div>

        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">PDFs</label>
            <input ref={fileInputPdfRef} type="file" accept="application/pdf" multiple onChange={e=>setPdfFiles(Array.from(e.target.files||[]))} className="w-full mt-1" />
            {pdfFiles.length>0 && <div className="text-xs text-gray-600 mt-1">{pdfFiles.length} file(s) selected</div>}
          </div>

          <div>
            <label className="text-sm font-medium">Docs</label>
            <input ref={fileInputDocRef} type="file" accept=".doc,.docx" multiple onChange={e=>setDocFiles(Array.from(e.target.files||[]))} className="w-full mt-1" />
            {docFiles.length>0 && <div className="text-xs text-gray-600 mt-1">{docFiles.length} file(s) selected</div>}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">Files are uploaded to <span className="font-mono">{BUCKET}</span> (create this bucket in Supabase).</div>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60">
            {saving ? "Saving..." : "Add Lesson"}
          </button>
        </div>
      </form>

      {/* Lessons list */}
      <ul className="space-y-3">
        {loading ? <li className="text-gray-500">Loading lessons...</li> : (
          lessons.map(l => (
            <li key={l.id} className="bg-white shadow rounded p-3 flex items-start justify-between">
              <div>
                <div className="font-medium">{l.position}. {l.title}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {l.contents?.length > 0 ? (
                    <>
                      {l.contents.filter(c=>c.type==="video").length>0 && <span className="mr-2">🎬 Video</span>}
                      {l.contents.filter(c=>c.type==="pdf").length>0 && <span className="mr-2">📄 PDF ({l.contents.filter(c=>c.type==="pdf").length})</span>}
                      {l.contents.filter(c=>c.type==="doc").length>0 && <span className="mr-2">📝 DOC ({l.contents.filter(c=>c.type==="doc").length})</span>}
                    </>
                  ) : <span className="text-gray-400">No content</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button title="Move up" onClick={()=>moveUp(l)} className="px-2 py-1 border rounded">↑</button>
                <button title="Move down" onClick={()=>moveDown(l)} className="px-2 py-1 border rounded">↓</button>
                <button onClick={()=>startEdit(l)} className="px-3 py-1 border rounded text-yellow-700">Edit</button>
                <button onClick={()=>removeLesson(l.id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Edit modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={()=>setEditingId(null)} />
          <div className="relative z-60 bg-white rounded-lg w-full max-w-3xl shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold">Edit Lesson</h3>
              <button onClick={()=>setEditingId(null)} className="text-gray-600">✕</button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <form id="edit-form" onSubmit={saveEdit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input value={editForm.title} onChange={e=>setEditForm({...editForm, title:e.target.value})} className="col-span-2 border p-2 rounded" placeholder="Lesson title" />
                  <input type="number" min={1} value={editForm.position} onChange={e=>setEditForm({...editForm, position:e.target.value})} className="border p-2 rounded" />
                </div>

                <div>
                  <label className="text-sm font-medium">Video URL</label>
                  <input value={editVideoUrl} onChange={e=>setEditVideoUrl(e.target.value)} placeholder="https://..." className="w-full border p-2 rounded mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Upload Video</label>
                  <input type="file" accept="video/*" onChange={e=>setEditVideoFile(e.target.files?.[0] ?? null)} className="w-full mt-1" />
                  {editVideoFile && <div className="text-xs text-gray-600 mt-1">Selected: {editVideoFile.name}</div>}
                </div>

                <div>
                  <p className="font-medium">Existing Content</p>
                  {editContents.length===0 ? <div className="text-xs text-gray-500 mt-1">No content</div> : (
                    <ul className="space-y-2 mt-2">
                      {editContents.map((c, i) => (
                        <li className="flex justify-between items-center border p-2 rounded" key={i}>
                          <div className="text-sm">{c.name} <span className="text-xs text-gray-500">({c.type})</span></div>
                          <div className="flex items-center gap-2">
                            {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600">Open</a>}
                            <button type="button" onClick={()=>removeContentItemFromEdit(i)} className="text-red-600 text-xs">Remove</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label>PDF files</label>
                    <input type="file" accept="application/pdf" multiple onChange={e=>setEditPdfFiles(Array.from(e.target.files||[]))} className="w-full mt-1" />
                    {editPdfFiles.length>0 && <div className="text-xs text-gray-600">{editPdfFiles.length} selected</div>}
                  </div>
                  <div>
                    <label>DOC files</label>
                    <input type="file" accept=".doc,.docx" multiple onChange={e=>setEditDocFiles(Array.from(e.target.files||[]))} className="w-full mt-1" />
                    {editDocFiles.length>0 && <div className="text-xs text-gray-600">{editDocFiles.length} selected</div>}
                  </div>
                </div>

              </form>
            </div>
            <div className="flex justify-end gap-2 p-3 border-t">
              <button onClick={()=>setEditingId(null)} className="px-3 py-1 border rounded">Cancel</button>
              <button form="edit-form" type="submit" disabled={editSaving} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60">
                {editSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
