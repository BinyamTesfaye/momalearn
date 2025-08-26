// src/pages/courses/LessonPlayer.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../lib/supabaseClient"; // keep same import style you already use

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const STORAGE_BUCKET = "lesson-contents"; // <- change to your bucket name if different

  // Helper: convert possible storage path to public URL (if needed)
  function getPublicUrlIfNeeded(pathOrUrl) {
    if (!pathOrUrl) return null;
    if (pathOrUrl.startsWith("http")) return pathOrUrl;

    // treat it as storage path
    try {
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(pathOrUrl);
      return data?.publicUrl ?? null;
    } catch (err) {
      console.error("getPublicUrl error:", err);
      return null;
    }
  }

  // Helper: normalize different youtube variants to embeddable url
  function youtubeEmbedUrl(url) {
    if (!url) return null;
    // youtu.be short link
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    // youtube watch?v=...
    if (url.includes("youtube.com/watch")) {
      return url.replace("watch?v=", "embed/");
    }
    // already embed url
    if (url.includes("youtube.com/embed/")) return url;
    return null;
  }

  useEffect(() => {
    let mounted = true;

    async function fetchLesson() {
      setLoading(true);

      // 1) fetch the lesson row (simple select)
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();

      if (error) {
        console.error("Error fetching lesson:", error);
        if (mounted) {
          setLesson(null);
          setLoading(false);
        }
        return;
      }

      // 2) Build a normalized contents array
      // Support either:
      // - data.contents (an array of {type, url})
      // - or legacy fields like content_type + content_url
      let contents = [];

      if (Array.isArray(data.contents) && data.contents.length) {
        contents = data.contents.map((c) => ({ ...c })); // shallow copy
      } else if (data.content_type && data.content_url) {
        // legacy single content
        contents.push({ type: data.content_type, url: data.content_url });
      } else {
        // also support some alternate fields: video_url, pdf_url, doc_url
        if (data.video_url) contents.push({ type: "video", url: data.video_url });
        if (data.pdf_url) contents.push({ type: "pdf", url: data.pdf_url });
        if (data.doc_url) contents.push({ type: "doc", url: data.doc_url });
        if (data.content_url) contents.push({ type: data.content_type || "file", url: data.content_url });
      }

      // 3) For each content, if url looks like a storage path (no http), convert to public URL
      const processed = await Promise.all(
        contents.map(async (c) => {
          if (!c?.url) return c;
          // if URL doesn't start with http -> assume storage path
          if (!c.url.startsWith("http")) {
            const publicUrl = getPublicUrlIfNeeded(c.url);
            // getPublicUrlIfNeeded is synchronous with supabase-js v2 response, but we keep it simple
            c.url = publicUrl || c.url; // if conversion failed keep original
          }
          return c;
        })
      );

      data.contents = processed;

      if (mounted) {
        setLesson(data);
        setLoading(false);
      }
    }

    fetchLesson();

    return () => {
      mounted = false;
    };
  }, [lessonId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!lesson) return <div className="p-6">Lesson not found</div>;

  return (
    <div className="pt-10 pb-10 max-w-4xl mx-auto space-y-8">
      <h2 className="font-semibold text-2xl">{lesson.title}</h2>

      {lesson.contents && lesson.contents.length > 0 ? (
        lesson.contents.map((c, idx) => {
          const url = c.url;
          const type = (c.type || "").toLowerCase();

          // VIDEO: prefer youtube embed if possible, otherwise <video> for direct files
          if (type === "video") {
            const embed = youtubeEmbedUrl(url);
            if (embed) {
              return (
                <div key={idx} className="mb-6">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      width="100%"
                      height="480"
                      src={embed}
                      title={`Video ${idx + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              );
            }
            // fallback to <video> for direct file urls
            return (
              <div key={idx} className="mb-6">
                <video controls src={url} className="w-full rounded shadow" />
              </div>
            );
          }

          // PDF preview (iframe) + download
          if (type === "pdf") {
            return (
              <div key={idx} className="mb-6">
                <div className="mb-2 font-medium">PDF {idx + 1}</div>
                <iframe src={url} className="w-full h-[700px] border rounded" title={`PDF ${idx + 1}`} />
                <div className="mt-2">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-600 text-white rounded">
                    Download PDF
                  </a>
                </div>
              </div>
            );
          }

          // Docs / other files -> download link (and optionally use google viewer)
          if (type === "doc" || type === "file" || type === "docx" || type === "ppt" || type === "pptx" || type === "xls" || type === "xlsx") {
            return (
              <div key={idx} className="mb-4">
                <div className="mb-1 font-medium">{(type || "File").toUpperCase()} {idx + 1}</div>
                <a href={url} download target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Download {type.toUpperCase()} {idx + 1}
                </a>
              </div>
            );
          }

          // fallback for unknown types: show open link
          return (
            <div key={idx} className="mb-3">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                Open content {idx + 1}
              </a>
            </div>
          );
        })
      ) : (
        <p>No content available for this lesson.</p>
      )}
    </div>
  );
}
