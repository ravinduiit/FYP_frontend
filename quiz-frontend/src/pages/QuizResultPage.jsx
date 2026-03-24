import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/quizResult.css";

export default function QuizResultPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state || {};

  const {
    score = 0,
    totalQuestions = 0,
    timeTaken = 0,
    accuracy = 0,
    predictedLevel = "Unknown",
    wrongAnswers = [],
    friendlyDetailed = "",
  } = data;

  return (
    <div className="qr-wrap">
      <div className="qr-glow qr-glow-1"></div>
      <div className="qr-glow qr-glow-2"></div>

      <div className="qr-card">
        <div className="qr-top-badge">Quiz Analysis Complete</div>

        <h1 className="qr-title">Your Learning Profile Is Ready</h1>

        <p className="qr-sub">
          Your answers, time taken, and accuracy were analyzed to understand
          your current knowledge level. You can now continue with personalized
          learning materials created for your level and weak areas.
        </p>

        <div className="qr-level-box">
          <span className="qr-level-label">Detected Level</span>
          <div className="qr-level-value">{predictedLevel}</div>
        </div>

        <div className="qr-stats-grid">
          <div className="qr-stat-card">
            <span className="qr-stat-label">Score</span>
            <div className="qr-stat-value">
              {score}/{totalQuestions}
            </div>
          </div>

          <div className="qr-stat-card">
            <span className="qr-stat-label">Accuracy</span>
            <div className="qr-stat-value">{accuracy}%</div>
          </div>

          <div className="qr-stat-card">
            <span className="qr-stat-label">Time Taken</span>
            <div className="qr-stat-value">{timeTaken}s</div>
          </div>

          <div className="qr-stat-card">
            <span className="qr-stat-label">Weak Points</span>
            <div className="qr-stat-value">{wrongAnswers.length}</div>
          </div>
        </div>

        <div className="qr-explanation-card">
          <div className="qr-explanation-head">
            <div className="qr-explanation-badge">Prediction Insight</div>
            <h2 className="qr-explanation-title">
              Why this level was predicted
            </h2>
          </div>

          <p className="qr-explanation-text">
            {friendlyDetailed ||
              "A detailed explanation for the predicted level is not available yet."}
          </p>
        </div>

        <div className="qr-next-section">
          <h2 className="qr-next-title">Choose Your Next Step</h2>
          <p className="qr-next-sub">
            Continue your learning journey with materials generated from your
            quiz performance and identified weak points.
          </p>

          <div className="qr-actions-grid">
            <button
              className="qr-action-card qr-action-primary"
              onClick={() =>
                navigate(`/notes/${videoId}`, {
                  state: {
                    videoId,
                    user_level: predictedLevel,
                    weak_points: wrongAnswers.map((item) => item.question),
                  },
                })
              }
            >
              <div className="qr-action-icon">📝</div>
              <div className="qr-action-title">Generate Notes</div>
              <div className="qr-action-text">
                Move to the note generation page and create personalized notes
                based on your level and weak quiz areas.
              </div>
            </button>

            <button
              className="qr-action-card"
              onClick={() =>
                navigate(`/mindmap/${videoId}`, {
                  state: {
                    videoId,
                    user_level: predictedLevel,
                    weak_points: wrongAnswers.map((item) => item.question),
                    strong_points: [],
                  },
                })
              }
            >
              <div className="qr-action-icon">🧠</div>
              <div className="qr-action-title">Mind Map</div>
              <div className="qr-action-text">
                Build a visual understanding of the topic structure.
              </div>
            </button>

            <button
              className="qr-action-card"
              onClick={() =>
                navigate(`/recommendations/${videoId}`, {
                  state: {
                    videoId,
                    user_level: predictedLevel,
                    weak_points: wrongAnswers.map((item) => item.question),
                  },
                })
              }
            >
              <div className="qr-action-icon">🎯</div>
              <div className="qr-action-title">Recommendations</div>
              <div className="qr-action-text">
                See what concepts and topics you should focus on next.
              </div>
            </button>

            <button
              className="qr-action-card"
              onClick={() =>
                navigate(`/explanations/${videoId}`, {
                  state: {
                    videoId,
                    wrongAnswers,
                  },
                })
              }
            >
              <div className="qr-action-icon">📘</div>
              <div className="qr-action-title">Explanations</div>
              <div className="qr-action-text">
                Review concept explanations for better understanding.
              </div>
            </button>

            <button
              className="qr-action-card"
              onClick={() =>
                navigate(`/comments/${videoId}`, {
                  state: {
                    videoId,
                    user_level: predictedLevel,
                  },
                })
              }
            >
              <div className="qr-action-icon">💬</div>
              <div className="qr-action-title">Comment Answers</div>
              <div className="qr-action-text">
                View AI-generated answers related to video discussions.
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}