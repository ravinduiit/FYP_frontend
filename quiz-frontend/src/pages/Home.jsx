import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/home.css";

function HeroIllustration() {
  // Simple SVG “tech + learning” illustration using your color palette
  return (
    <div className="illustration">
      <svg viewBox="0 0 560 320" width="100%" height="auto" role="img" aria-label="Learning illustration">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#98C5FE" stopOpacity="0.95" />
            <stop offset="1" stopColor="#BEB1FE" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="g2" cx="50%" cy="35%" r="65%">
            <stop offset="0" stopColor="#C2E3FF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#0B0F1A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="560" height="320" rx="18" fill="rgba(255,255,255,0.03)" />
        <circle cx="170" cy="115" r="140" fill="url(#g2)" />
        <circle cx="405" cy="135" r="120" fill="url(#g2)" />

        {/* "Book" */}
        <path
          d="M150 210c70-26 140-26 210 0v60c-70-26-140-26-210 0v-60z"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.12)"
        />
        <path
          d="M360 210c70-26 140-26 210 0v60c-70-26-140-26-210 0v-60z"
          transform="translate(-70,0)"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.12)"
        />

        {/* Play / AI bubble */}
        <g transform="translate(230,70)">
          <path
            d="M50 10c-26 0-48 18-48 44 0 16 8 30 20 38v18l18-10c3 1 6 1 10 1h70c26 0 48-18 48-44S146 10 120 10H50z"
            fill="url(#g1)"
            opacity="0.95"
          />
          <polygon points="90,35 90,82 126,58" fill="#0B0F1A" opacity="0.85" />
          {/* nodes */}
          <circle cx="34" cy="24" r="6" fill="rgba(11,15,26,0.70)" />
          <circle cx="160" cy="24" r="6" fill="rgba(11,15,26,0.70)" />
          <circle cx="34" cy="96" r="6" fill="rgba(11,15,26,0.70)" />
          <path d="M34 24 L70 45" stroke="rgba(11,15,26,0.55)" strokeWidth="3" />
          <path d="M160 24 L132 45" stroke="rgba(11,15,26,0.55)" strokeWidth="3" />
          <path d="M34 96 L72 78" stroke="rgba(11,15,26,0.55)" strokeWidth="3" />
        </g>

        {/* small sparkles */}
        <circle cx="70" cy="50" r="2" fill="rgba(255,255,255,0.45)" />
        <circle cx="480" cy="55" r="2" fill="rgba(255,255,255,0.45)" />
        <circle cx="520" cy="100" r="2" fill="rgba(255,255,255,0.35)" />
        <circle cx="90" cy="120" r="2" fill="rgba(255,255,255,0.35)" />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge">
              <span>⚡</span>
              <span>Generate quizzes from YouTube transcripts</span>
            </div>

            <h1 className="hero-title">
              Turn any YouTube video into a <span className="grad">Quiz + Notes</span> in seconds.
            </h1>

            <p className="hero-desc">
              This system extracts the video transcript, understands the content, and creates
              MCQ questions, short notes, and recommendations based on the learner level —
              so students can study faster and smarter.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Get Started
                <span aria-hidden>→</span>
              </Link>

              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>

              <a href="#about" className="btn">
                Learn More
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-logo">
              <img src={logo} alt="System logo" />
              <div>
                <div className="hero-mini-title">QuizGen</div>
                <div className="hero-mini-sub">AI-powered learning companion</div>
              </div>
            </div>

            <HeroIllustration />

            <div style={{ marginTop: 12, color: "rgba(255,255,255,0.70)", fontSize: 13, lineHeight: 1.6 }}>
              Paste a link → transcript → quiz + notes → save per video. Perfect for exam prep and quick revision.
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <span className="kicker">What you get</span>
          <h2 className="section-title">Everything needed to learn from videos</h2>

          <div className="grid-3" style={{ marginTop: 14 }}>
            <div className="card">
              <h3>Auto Quiz Generation</h3>
              <p>
                Generates MCQs (question, options, correct option) from the transcript with good coverage.
              </p>
            </div>

            <div className="card">
              <h3>Notes by User Level</h3>
              <p>
                Summarized notes tailored for beginner / intermediate / advanced learners.
              </p>
            </div>

            <div className="card">
              <h3>Recommendations</h3>
              <p>
                Suggests what to learn next: key topics, related terms, and revision points from the same video.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS + ABOUT */}
      <section className="section" id="about">
        <div className="container split">
          <div>
            <span className="kicker">How it works</span>
            <h2 className="section-title">Simple flow, fast results</h2>

            <div className="steps" style={{ marginTop: 14 }}>
              <div className="step">
                <div className="step-num">1</div>
                <div>
                  <b>Paste a YouTube link</b>
                  <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.6 }}>
                    The system extracts the video ID and fetches the transcript (captions / auto captions).
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-num">2</div>
                <div>
                  <b>Process the transcript</b>
                  <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.6 }}>
                    Cleans the text, chunks it, and prepares it for question generation and summaries.
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-num">3</div>
                <div>
                  <b>Generate learning outputs</b>
                  <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.6 }}>
                    Creates quiz questions, level-based notes, and recommendations — all saved per video.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <span className="kicker">About the system</span>
            <h2 className="section-title" style={{ marginBottom: 8 }}>Why this exists</h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.68)", lineHeight: 1.7 }}>
              Students spend a lot of time re-watching videos to find important points. This platform converts
              YouTube learning content into structured study materials:
              quizzes for practice, notes for revision, and recommendations to guide learning.
              <br /><br />
              It is designed for your Final Year Project workflow: multiple videos, saved by video ID, and
              easy access to questions, notes, and suggestions anytime.
            </p>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div className="btn" style={{ cursor: "default" }}>📌 Video-based saving</div>
              <div className="btn" style={{ cursor: "default" }}>🧠 RAG-friendly design</div>
              <div className="btn" style={{ cursor: "default" }}>📝 Study-focused UI</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} QuizGen — YouTube Transcript → Quiz + Notes
        </div>
      </footer>
    </div>
  );
}
