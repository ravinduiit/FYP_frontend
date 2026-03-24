import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { generateNotes, getPdfPreviewBlobUrl } from "../services/noteService";
import "../styles/notes.css";

export default function NotesPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Removed hasCalledApi Ref - it was causing the "infinite loading" bug in Strict Mode

  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [error, setError] = useState("");
  const [notesData, setNotesData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  const stateData = location.state || {};

  const rawVideoId = params.videoId;
  const userLevel = stateData.user_level || "beginner";
  const weakPoints = Array.isArray(stateData.weak_points)
    ? stateData.weak_points
    : [];

  const videoId =
    typeof rawVideoId === "string" && rawVideoId !== "[object Promise]"
      ? rawVideoId
      : "";

  const stages = useMemo(
    () => [
      "Analyzing your quiz weak points…",
      "Adapting note structure to your level…",
      "Generating personalized summary…",
      "Finalizing your note document…",
    ],
    []
  );

  const stageText = stages[Math.floor((loadingSeconds / 10) % stages.length)];

  useEffect(() => {
    if (!loadingNotes) return;
    const timer = setInterval(() => setLoadingSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [loadingNotes]);

  useEffect(() => {
    let cancelled = false;
    let createdBlobUrl = null;

    async function run() {
      try {
        setLoadingNotes(true);
        setLoadingPreview(true);
        setError("");

        if (!videoId) {
          throw new Error("Invalid video_id. It is missing or not a valid string.");
        }

        const payload = {
          video_id: videoId,
          user_level: String(userLevel || "beginner"),
          note_type: "personalized",
          weak_points: weakPoints.map((item) => String(item)),
        };

        console.log("generate_notes payload:", payload);

        // 1) Generate notes first
        const notesResponse = await generateNotes(payload);

        // If component unmounted during fetch, stop here
        if (cancelled) return;

        setNotesData(notesResponse);
        setLoadingNotes(false);

        // 2) Load PDF preview separately in background
        try {
          const previewBlobUrl = await getPdfPreviewBlobUrl(
            notesResponse?.video_id || payload.video_id,
            notesResponse?.user_level || payload.user_level
          );

          if (cancelled) {
            URL.revokeObjectURL(previewBlobUrl);
            return;
          }

          createdBlobUrl = previewBlobUrl;
          setPdfUrl(previewBlobUrl);
        } catch (previewErr) {
          console.error("PDF preview error:", previewErr);
        } finally {
          if (!cancelled) setLoadingPreview(false);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("generate_notes / pdf preview error:", err);
        setError(err.message || "Failed to generate notes");
        setLoadingNotes(false);
        setLoadingPreview(false);
      }
    }

    run();

    return () => {
      cancelled = true;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [videoId, userLevel]); // Dependencies ensure it runs when ID or Level changes

  if (loadingNotes) {
    return (
      <div className="notes-loading-wrap">
        <div className="notes-loading-card">
          <div className="notes-loader-ring"></div>
          <div className="notes-loading-badge">Personalized Notes</div>

          <h1 className="notes-loading-title">Generating Your Notes...</h1>
          <p className="notes-loading-sub">{stageText}</p>

          <div className="notes-loading-info">
            <span className="notes-pill">Video: {videoId || "Invalid"}</span>
            <span className="notes-pill">Level: {userLevel}</span>
            <span className="notes-pill">Weak Points: {weakPoints.length}</span>
            <span className="notes-pill">Waiting: {loadingSeconds}s</span>
          </div>

          <div className="notes-progress-bar"></div>

          <p className="notes-loading-hint">
            The system is generating your personalized note document.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notes-loading-wrap">
        <div className="notes-loading-card">
          <h2 className="notes-error-title">⚠️ {error}</h2>
          <p className="notes-loading-hint">
            Something went wrong while generating notes or loading the preview.
          </p>

          <div className="notes-error-actions">
            <button className="notes-btn notes-btn-ghost" onClick={() => navigate(-1)}>
              ← Go Back
            </button>
            <button className="notes-btn" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-wrap">
      <div className="notes-header">
        <div>
          <div className="notes-page-badge">Preview Ready</div>
          <h1 className="notes-title">Personalized Notes PDF Preview</h1>
          <p className="notes-sub">
            Your personalized note document has been generated successfully and
            is ready to preview below.
          </p>
        </div>

        <div className="notes-header-actions">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="notes-btn notes-link-btn"
            >
              Open PDF in New Tab
            </a>
          )}
          <button className="notes-btn notes-btn-ghost" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>

      <div className="notes-meta-grid">
        <div className="notes-meta-card">
          <span className="notes-meta-label">Video ID</span>
          <div className="notes-meta-value">{notesData?.video_id || videoId}</div>
        </div>

        <div className="notes-meta-card">
          <span className="notes-meta-label">User Level</span>
          <div className="notes-meta-value">{notesData?.user_level || userLevel}</div>
        </div>

        <div className="notes-meta-card">
          <span className="notes-meta-label">Note Type</span>
          <div className="notes-meta-value">{notesData?.note_type || "personalized"}</div>
        </div>
      </div>

      <div className="notes-preview-only-card">
        <div className="notes-preview-head">
          <h2 className="notes-preview-title">PDF Preview</h2>
          <p className="notes-preview-sub">
            Live preview of the generated PDF note document.
          </p>
        </div>

        {loadingPreview ? (
          <div className="notes-preview-loading">
            <div className="notes-preview-spinner"></div>
            <p>Loading PDF preview...</p>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="Generated Notes PDF Preview"
            className="notes-pdf-frame"
            style={{ width: "100%", height: "800px", border: "none" }}
          />
        ) : (
          <div className="notes-preview-empty">
            PDF preview is not available.
          </div>
        )}
      </div>
    </div>
  );
}