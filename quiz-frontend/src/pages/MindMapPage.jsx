import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { generateMindMap } from "../services/mindMapService";
import "../styles/mindmap.css";

function StatusBadge({ status }) {
  const normalized = (status || "normal").toLowerCase();

  return (
    <span className={`mm-status mm-status-${normalized}`}>
      {normalized}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const normalized = (priority || "medium").toLowerCase();

  return (
    <span className={`mm-priority mm-priority-${normalized}`}>
      {normalized}
    </span>
  );
}

function MindMapNodeCard({ node, level = 0 }) {
  const children = Array.isArray(node.children) ? node.children : [];
  const recommendedNext = Array.isArray(node.recommended_next)
    ? node.recommended_next
    : [];

  const [expanded, setExpanded] = useState(level === 0);
  const hasChildren = children.length > 0;

  return (
    <div className="mm-tree-node">
      <div className={`mm-card mm-level-${Math.min(level, 3)}`}>
        <div className="mm-card-top">
          <div className="mm-card-title-wrap">
            <h3 className="mm-card-title">{node.name}</h3>

            {hasChildren && (
              <button
                className="mm-toggle-btn"
                onClick={() => setExpanded((prev) => !prev)}
                type="button"
              >
                <span className={`mm-toggle-arrow ${expanded ? "open" : ""}`}>
                  ▸
                </span>
                {expanded ? "Hide subtopics" : "Show subtopics"}
              </button>
            )}
          </div>

          <div className="mm-badges">
            <StatusBadge status={node.status} />
            <PriorityBadge priority={node.priority} />
          </div>
        </div>

        {recommendedNext.length > 0 && (
          <div className="mm-recommended-box">
            <div className="mm-recommended-title">Recommended Next</div>
            <div className="mm-recommended-list">
              {recommendedNext.map((item, idx) => (
                <span key={idx} className="mm-recommended-item">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="mm-children">
          {children.map((child, index) => (
            <MindMapNodeCard key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MindMapPage() {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const hasCalled = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mindMap, setMindMap] = useState(null);

  const stateData = location.state || {};

  const userLevel = stateData.user_level || "beginner";
  const weakPoints = Array.isArray(stateData.weak_points)
    ? stateData.weak_points
    : [];
  const strongPoints = Array.isArray(stateData.strong_points)
    ? stateData.strong_points
    : [];

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    async function loadMindMap() {
      try {
        setLoading(true);

        const payload = {
          video_id: videoId,
          user_level: userLevel,
          weak_points: weakPoints,
          strong_points: strongPoints,
        };

        console.log("MindMap payload:", payload);

        const res = await generateMindMap(payload);

        setMindMap(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to generate mind map");
        setLoading(false);
      }
    }

    loadMindMap();
  }, [videoId, userLevel, weakPoints, strongPoints]);

  if (loading) {
    return (
      <div className="mm-loading">
        <div className="mm-loader"></div>
        <h2>Generating Mind Map...</h2>
        <p>Building your personalized learning structure</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mm-loading">
        <h2>⚠️ {error}</h2>
        <button className="mm-back" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  if (!mindMap) {
    return (
      <div className="mm-loading">
        <h2>No mind map data found</h2>
        <button className="mm-back" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const children = Array.isArray(mindMap.children) ? mindMap.children : [];
  const needMoreFocus = Array.isArray(mindMap.need_more_focus)
    ? mindMap.need_more_focus
    : [];

  return (
    <div className="mm-page">
      <div className="mm-page-glow mm-page-glow-1"></div>
      <div className="mm-page-glow mm-page-glow-2"></div>

      <div className="mm-wrap">
        <div className="mm-header">
          <div>
            <div className="mm-badge">Personalized Learning Map</div>
            <h1 className="mm-title">Mind Map</h1>
            <p className="mm-sub">
              A visual learning structure based on your quiz analysis, weak
              points, and current knowledge level.
            </p>
          </div>

          <button className="mm-back mm-back-top" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <div className="mm-meta-grid">
          <div className="mm-meta-card">
            <span className="mm-meta-label">Video ID</span>
            <div className="mm-meta-value">{mindMap.video_id}</div>
          </div>

          <div className="mm-meta-card">
            <span className="mm-meta-label">User Level</span>
            <div className="mm-meta-value">{mindMap.user_level}</div>
          </div>

          <div className="mm-meta-card">
            <span className="mm-meta-label">Source Chunks Used</span>
            <div className="mm-meta-value">{mindMap.source_chunks_used}</div>
          </div>
        </div>

        <div className="mm-legend-box">
          <h3 className="mm-legend-title">How to Read This Mind Map</h3>
          <p className="mm-legend-sub">
            Each topic is marked with a <b>status</b> and a <b>priority</b> so
            you can quickly understand where to focus next.
          </p>

          <div className="mm-legend-grid">
            <div className="mm-legend-card">
              <div className="mm-legend-badges">
                <StatusBadge status="weak" />
                <PriorityBadge priority="high" />
              </div>
              <div className="mm-legend-text">
                This topic clearly matches a weak point from your quiz, so it
                needs the most attention.
              </div>
            </div>

            <div className="mm-legend-card">
              <div className="mm-legend-badges">
                <StatusBadge status="normal" />
                <PriorityBadge priority="medium" />
              </div>
              <div className="mm-legend-text">
                This is an important foundation topic. It may not be a direct
                weak point, but it still matters for understanding the subject well.
              </div>
            </div>

            <div className="mm-legend-card">
              <div className="mm-legend-badges">
                <StatusBadge status="strong" />
                <PriorityBadge priority="low" />
              </div>
              <div className="mm-legend-text">
                This topic seems to be understood well, so it usually needs less
                immediate focus.
              </div>
            </div>
          </div>
        </div>

        <div className="mm-main-topic-wrap">
          <div className="mm-main-topic-card">
            <div className="mm-main-topic-label">Main Topic</div>
            <h2 className="mm-main-topic-title">{mindMap.main_topic}</h2>
          </div>
        </div>

        {needMoreFocus.length > 0 && (
          <div className="mm-focus-box">
            <h3 className="mm-focus-title">Need More Focus</h3>
            <div className="mm-focus-list">
              {needMoreFocus.map((item, idx) => (
                <span key={idx} className="mm-focus-item">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mm-tree-root">
          {children.map((child, index) => (
            <MindMapNodeCard key={index} node={child} />
          ))}
        </div>
      </div>
    </div>
  );
}