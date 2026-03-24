import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/explanations.css";

export default function ExplanationsPage() {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state || {};
  const wrongAnswers = Array.isArray(data.wrongAnswers) ? data.wrongAnswers : [];

  return (
    <div className="exp-wrap">
      <div className="exp-header">
        <div className="exp-badge">Answer Review</div>
        <h1 className="exp-title">Explanations for Wrong Answers</h1>
        <p className="exp-sub">
          These explanations help you understand where you went wrong and what the correct concept should be.
        </p>
      </div>

      <div className="exp-meta">
        <div className="exp-meta-card">
          <span className="exp-meta-label">Video ID</span>
          <div className="exp-meta-value">{videoId}</div>
        </div>

        <div className="exp-meta-card">
          <span className="exp-meta-label">Wrong Answers</span>
          <div className="exp-meta-value">{wrongAnswers.length}</div>
        </div>
      </div>

      {wrongAnswers.length === 0 ? (
        <div className="exp-empty">
          <h2>No wrong answers found</h2>
          <p>Great job. There are no explanations to review.</p>
        </div>
      ) : (
        <div className="exp-list">
          {wrongAnswers.map((item, index) => (
            <div key={index} className="exp-card">
              <div className="exp-number">{item.questionNumber}</div>

              <div className="exp-content">
                <div className="exp-section">
                  <div className="exp-label">Question</div>
                  <div className="exp-question">{item.question}</div>
                </div>

                <div className="exp-answers-grid">
                  <div className="exp-answer-box wrong">
                    <div className="exp-label">Your Answer</div>
                    <div className="exp-answer-text">{item.selectedAnswer}</div>
                  </div>

                  <div className="exp-answer-box correct">
                    <div className="exp-label">Correct Answer</div>
                    <div className="exp-answer-text">{item.correctAnswer}</div>
                  </div>
                </div>

                <div className="exp-section">
                  <div className="exp-label">Explanation</div>
                  <div className="exp-explanation">
                    {item.explanation || "No explanation available for this question."}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="exp-back" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
}