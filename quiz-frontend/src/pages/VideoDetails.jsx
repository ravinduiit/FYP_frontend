import { useParams } from "react-router-dom";
import "../styles/videoDetails.css";

export default function VideoDetails() {
  const { videoId } = useParams();

  return (
    <div className="vd-wrap">
      <h1 className="vd-title">Video Learning Materials</h1>
      <p className="vd-sub">
        Content generated for video ID: <b>{videoId}</b>
      </p>

      <div className="vd-grid">
        {/* REQUIRED */}
        <div className="vd-card required">
          <h3>📝 Quiz</h3>
          <p>MCQ questions generated from the video transcript.</p>
          {/* <button className="vd-btn">View Quiz</button> */}
          <button
            className="vd-btn"
            onClick={() => window.location.href = `/quiz/${videoId}`}
            >
            Start Quiz
          </button>
        </div>

        {/* OPTIONAL */}
        <div className="vd-card">
          <h3>🧠 Mind Map</h3>
          <p>Visual learning path generated from key concepts.</p>
          <button className="vd-btn ghost">View Mind Map</button>
        </div>

        <div className="vd-card">
          <h3>📖 Personalized Notes</h3>
          <p>Notes tailored to the learner level.</p>
          <button className="vd-btn ghost">View Notes</button>
        </div>

        <div className="vd-card">
          <h3>💬 Comment Answers</h3>
          <p>AI-generated answers for YouTube comments.</p>
          <button className="vd-btn ghost">View Answers</button>
        </div>

        <div className="vd-card">
          <h3>🎯 Recommendations</h3>
          <p>What to learn next from this topic.</p>
          <button className="vd-btn ghost">View Recommendations</button>
        </div>

        <div className="vd-card">
          <h3>📘 Explanation</h3>
          <p>Detailed explanation of quiz questions.</p>
          <button className="vd-btn ghost">View Explanation</button>
        </div>
      </div>
    </div>
  );
}
