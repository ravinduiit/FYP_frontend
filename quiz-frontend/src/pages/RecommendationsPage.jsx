import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { generateRecommendations } from "../services/recommendationService";
import "../styles/recommendations.css";

export default function RecommendationsPage() {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const hasCalled = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const stateData = location.state || {};
  const userLevel = stateData.user_level || "beginner";
  const weakPoints = stateData.weak_points || [];

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    async function loadData() {
      try {
        setLoading(true);

        const payload = {
          video_id: videoId,
          user_level: userLevel,
          weak_points: weakPoints,
          top_k: 5,
        };

        const res = await generateRecommendations(payload);
        setData(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load recommendations");
        setLoading(false);
      }
    }

    loadData();
  }, [videoId, userLevel, weakPoints]);

  if (loading) {
    return (
      <div className="rec-loading">
        <div className="rec-loader"></div>
        <h2>Finding the best resources for you...</h2>
        <p>Analyzing weak areas and matching useful learning materials</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rec-loading">
        <h2>⚠️ {error}</h2>
        <button className="rec-back" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="rec-wrap">
      <div className="rec-header">
        <div className="rec-badge">Personalized Resource Guide</div>
        <h1>Smart Learning Recommendations</h1>
        <p>
          These resources are selected to help you strengthen weak areas and
          continue learning with more confidence.
        </p>
      </div>

      <div className="rec-list">
        {data?.recommendations?.map((rec, idx) => (
          <div key={idx} className="rec-item">
            <div className="rec-left">
              <div className="rec-index">{idx + 1}</div>
            </div>

            <div className="rec-content">
              <div className="rec-top-row">
                <span className="rec-source-pill">
                  {rec.source_type || "resource"}
                </span>
              </div>

              <h3 className="rec-title">{rec.title}</h3>

              <p className="rec-reason">{rec.reason}</p>

              <div className="rec-match-box">
                <div className="rec-match-title">Matched weak points</div>
                <div className="rec-weak">
                  {rec.matched_weak_points?.length > 0 ? (
                    rec.matched_weak_points.map((w, i) => (
                      <span key={i} className="rec-tag">
                        ⚠ {w}
                      </span>
                    ))
                  ) : (
                    <span className="rec-empty-tag">No direct weak point matches</span>
                  )}
                </div>
              </div>

              <div className="rec-footer">
                <div className="rec-confidence-text">
                  Match confidence: {Math.round((rec.confidence || 0) * 100)}%
                </div>

                <a
                  href={rec.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rec-open-btn"
                >
                  Explore Resource →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="rec-back" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
}