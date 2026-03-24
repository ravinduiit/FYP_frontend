import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { generateCommentQA } from "../services/commentQaService";
import "../styles/commentsQA.css";

export default function CommentsQA() {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const hasCalled = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [expandedMap, setExpandedMap] = useState({});

  const stateData = location.state || {};
  const userLevel = stateData.user_level || "beginner";

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    async function loadCommentQA() {
      try {
        setLoading(true);

        const payload = {
          video_id: videoId,
          max_comments: 50,
          only_questions: true,
          min_relevant_chunks: 5,
          user_level: userLevel,
        };

        console.log("comment-qa payload:", payload);

        const res = await generateCommentQA(payload);
        setData(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load comment answers");
        setLoading(false);
      }
    }

    loadCommentQA();
  }, [videoId, userLevel]);

  const toggleExpand = (index) => {
    setExpandedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="cqa-loading">
        <div className="cqa-loader"></div>
        <h2>Generating Comment Answers...</h2>
        <p>Analyzing related question comments and building answers</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cqa-loading">
        <h2>⚠️ {error}</h2>
        <button className="cqa-back" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="cqa-wrap">
      <div className="cqa-header">
        <div className="cqa-badge">Comment Q&A Assistant</div>
        <h1>Related Question Comments</h1>
        <p>
          These are question-style comments related to the video, along with
          generated answers and supporting transcript chunks.
        </p>
      </div>

      <div className="cqa-summary-grid">
        <div className="cqa-summary-card">
          <span className="cqa-summary-label">Video ID</span>
          <div className="cqa-summary-value">{data?.video_id}</div>
        </div>

        <div className="cqa-summary-card">
          <span className="cqa-summary-label">Total Comments Fetched</span>
          <div className="cqa-summary-value">{data?.total_comments_fetched}</div>
        </div>

        <div className="cqa-summary-card highlight">
          <span className="cqa-summary-label">Related Question Comments</span>
          <div className="cqa-summary-value">{data?.total_related_question_comments}</div>
        </div>
      </div>

      <div className="cqa-list">
        {data?.results?.map((item, index) => {
          const relatedChunks = Array.isArray(item.related_chunks)
            ? item.related_chunks
            : [];

          return (
            <div key={item.comment_id || index} className="cqa-card">
              <div className="cqa-card-top">
                <div className="cqa-index">{index + 1}</div>
                <div className="cqa-main">
                  <div className="cqa-section">
                    <div className="cqa-label">Original Comment</div>
                    <div className="cqa-comment">{item.original_comment}</div>
                  </div>

                  <div className="cqa-section">
                    <div className="cqa-label">Generated Answer</div>
                    <div className="cqa-answer">{item.answer}</div>
                  </div>

                  <div className="cqa-section">
                    <button
                      className="cqa-toggle"
                      onClick={() => toggleExpand(index)}
                      type="button"
                    >
                      <span className={`cqa-arrow ${expandedMap[index] ? "open" : ""}`}>
                        ▸
                      </span>
                      {expandedMap[index]
                        ? "Hide Supporting Chunks"
                        : "Show Supporting Chunks"}
                    </button>

                    {expandedMap[index] && (
                      <div className="cqa-chunks">
                        {relatedChunks.map((chunk, i) => (
                          <div key={i} className="cqa-chunk-card">
                            <div className="cqa-chunk-title">Support Chunk {i + 1}</div>
                            <div className="cqa-chunk-text">
                              {chunk.chunk_text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="cqa-back" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
}