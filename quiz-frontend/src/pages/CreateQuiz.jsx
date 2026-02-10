import { useMemo, useState } from "react";
import "../styles/createQuiz.css";

function extractVideoId(url) {
  if (!url) return null;

  const patterns = [
    /v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

export default function CreateQuiz() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });

  // ✅ Later you can load these from DB (API)
  const previousItems = useMemo(
    () => [
      {
        title: "Binary Search Explained",
        topic: "Algorithms",
        videoId: "dQw4w9WgXcQ",
        date: "2026-02-10",
      },
      {
        title: "React useState in 10 Minutes",
        topic: "React Basics",
        videoId: "dQw4w9WgXcQ",
        date: "2026-02-08",
      },
      {
        title: "What is RAG? (Beginner)",
        topic: "AI / NLP",
        videoId: "dQw4w9WgXcQ",
        date: "2026-02-06",
      },
      
    ],
    []
  );

  const onGenerate = async () => {
    const vid = extractVideoId(url);

    if (!vid) {
      setStatus({ type: "error", message: "Please enter a valid YouTube URL." });
      return;
    }

    setStatus({ type: "loading", message: "Generating quiz..." });

    try {
      // ✅ API call later
      // const res = await fetch("http://localhost:5000/generate-quiz", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ url }),
      // });
      // const data = await res.json();

      await new Promise((r) => setTimeout(r, 600));

      setStatus({
        type: "success",
        message: `OK! Video ID: ${vid}. (Next step: connect to backend)`,
      });
    } catch (e) {
      setStatus({ type: "error", message: "Something went wrong. Try again." });
    }
  };

  return (
    <div className="cq-wrap">
      <div className="cq-top">
        <div>
          <b><h1 className="cq-title">Create Quiz</h1></b>
          <p className="cq-subtitle">
            Paste a YouTube link and generate questions. Your recent videos/topics show above.
          </p>
        </div>
      </div>

      {/* ✅ Previous videos/topics */}
      <section className="cq-card">
        <div className="cq-card-header">
          <h2 className="cq-h2">Previous Videos / Topics</h2>
          <span className="cq-pill">Recent</span>
        </div>

        <div className="cq-grid">
          {previousItems.map((x, idx) => (
            <div
                key={idx}
                className="cq-item"
                style={{ cursor: "pointer" }}
                onClick={() => window.location.href = `/video/${x.videoId}`}
                >
              <div className="cq-item-title">{x.title}</div>
              <div className="cq-item-meta">
                <span className="cq-tag">{x.topic}</span>
                <span className="cq-dot">•</span>
                <span className="cq-date">{x.date}</span>
              </div>

              <div className="cq-actions">
                <a
                  className="cq-link"
                  href={`https://www.youtube.com/watch?v=${x.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open video
                </a>
                <button
                  className="cq-small-btn"
                  onClick={() => {
                    setUrl(`https://www.youtube.com/watch?v=${x.videoId}`);
                    setStatus({ type: "idle", message: "" });
                  }}
                >
                  Use again
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ URL input */}
      <section className="cq-card">
        <div className="cq-card-header">
          <h2 className="cq-h2">Enter YouTube URL</h2>
          <span className="cq-pill cq-pill-gradient">New</span>
        </div>

        <div className="cq-form">
          <label className="cq-label">YouTube link</label>
          <div className="cq-input-row">
            <input
              className="cq-input"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="cq-btn" onClick={onGenerate}>
              Generate
            </button>
          </div>

          {status.type !== "idle" && (
            <div
              className={
                "cq-alert " +
                (status.type === "error"
                  ? "cq-alert-error"
                  : status.type === "success"
                  ? "cq-alert-success"
                  : "cq-alert-loading")
              }
            >
              {status.message}
            </div>
          )}

          <div className="cq-help">
            Supports: <code>?v=VIDEOID</code>, <code>youtu.be/VIDEOID</code>,{" "}
            <code>/embed/VIDEOID</code>
          </div>
        </div>
      </section>
    </div>
  );
}
