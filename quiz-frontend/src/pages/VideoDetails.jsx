// import { useParams } from "react-router-dom";
// import "../styles/videoDetails.css";

// export default function VideoDetails() {
//   const { videoId } = useParams();

//   return (
//     <div className="vd-wrap">
//       <h1 className="vd-title">Video Learning Materials</h1>
//       <p className="vd-sub">
//         Content generated for video ID: <b>{videoId}</b>
//       </p>

//       <div className="vd-grid">
//         {/* REQUIRED */}
//         <div className="vd-card required">
//           <h3>📝 Quiz</h3>
//           <p>MCQ questions generated from the video transcript.</p>
//           {/* <button className="vd-btn">View Quiz</button> */}
//           <button
//             className="vd-btn"
//             onClick={() => window.location.href = `/quiz/${videoId}`}
//             >
//             Start Quiz
//           </button>
//         </div>

//         {/* OPTIONAL */}
//         <div className="vd-card">
//           <h3>🧠 Mind Map</h3>
//           <p>Visual learning path generated from key concepts.</p>
//           <button className="vd-btn ghost">View Mind Map</button>
//         </div>

//         <div className="vd-card">
//           <h3>📖 Personalized Notes</h3>
//           <p>Notes tailored to the learner level.</p>
//           <button className="vd-btn ghost">View Notes</button>
//         </div>

//         <div className="vd-card">
//           <h3>💬 Comment Answers</h3>
//           <p>AI-generated answers for YouTube comments.</p>
//           <button className="vd-btn ghost">View Answers</button>
//         </div>

//         <div className="vd-card">
//           <h3>🎯 Recommendations</h3>
//           <p>What to learn next from this topic.</p>
//           <button className="vd-btn ghost">View Recommendations</button>
//         </div>

//         <div className="vd-card">
//           <h3>📘 Explanation</h3>
//           <p>Detailed explanation of quiz questions.</p>
//           <button className="vd-btn ghost">View Explanation</button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useParams } from "react-router-dom";
import "../styles/videoDetails.css";

export default function VideoDetails() {
  const { videoId } = useParams();

  return (
    <div className="vd-wrap">
      <div className="vd-hero-card">
        <div className="vd-badge">Personalized Learning Step</div>

        <h1 className="vd-title">Start with the Quiz</h1>

        <p className="vd-sub">
          Before unlocking personalized notes, mind maps, explanations, and
          recommendations, take this quiz first. Your answers help the system
          understand your current knowledge level and generate learning content
          that better matches your strengths and weak areas.
        </p>

        <div className="vd-info-box">
          <p className="vd-info-text">
            This short quiz acts as the starting point of your learning path.
            Once completed, the system can tailor the next materials specially
            for you instead of giving the same content to every learner.
          </p>
        </div>

        <div className="vd-video-meta">
          <span className="vd-pill">Video ID: {videoId}</span>
          <span className="vd-pill">Step 1 of Personalized Flow</span>
        </div>

        <button
          className="vd-btn"
          onClick={() => (window.location.href = `/quiz/${videoId}`)}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}