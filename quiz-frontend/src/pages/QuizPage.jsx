// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { generateQuizByVideo, predictUserLevel } from "../services/quizService";
// import "../styles/quiz.css";

// export default function QuizPage() {
//   const { videoId } = useParams();
//   const navigate = useNavigate();

//   const [quizMeta, setQuizMeta] = useState(null);
//   const [questions, setQuestions] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [loadingSeconds, setLoadingSeconds] = useState(0);
//   const [error, setError] = useState("");

//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [time, setTime] = useState(0);

//   const [finished, setFinished] = useState(false);

//   // ✅ NEW: predicted level API state
//   const [predicting, setPredicting] = useState(false);
//   const [predictedLevel, setPredictedLevel] = useState("");

//   // --------- Creative loading stages ----------
//   const stages = useMemo(
//     () => [
//       "Fetching transcript…",
//       "Cleaning & chunking content…",
//       "Generating questions & options…",
//       "Validating answers…",
//       "Preparing your quiz UI…",
//     ],
//     []
//   );
//   const stageText = stages[Math.floor((loadingSeconds / 12) % stages.length)];

//   // --------- Loading timer while waiting ----------
//   useEffect(() => {
//     if (!loading) return;
//     const t = setInterval(() => setLoadingSeconds((s) => s + 1), 1000);
//     return () => clearInterval(t);
//   }, [loading]);

//   // --------- Fetch quiz on mount ----------
//   useEffect(() => {
//     let cancelled = false;

//     async function run() {
//       setLoading(true);
//       setError("");
//       setLoadingSeconds(0);

//       try {
//         const data = await generateQuizByVideo(videoId, "medium", 10);

//         if (cancelled) return;

//         setQuizMeta({
//           video_id: data.video_id,
//           difficulty: data.difficulty,
//           total_questions: data.total_questions,
//         });

//         setQuestions(Array.isArray(data.questions) ? data.questions : []);
//         setCurrent(0);
//         setAnswers({});
//         setFinished(false);
//         setTime(0);

//         // reset prediction state
//         setPredictedLevel("");
//         setPredicting(false);

//         setLoading(false);
//       } catch (e) {
//         if (cancelled) return;
//         setError(e?.message || "Failed to generate quiz.");
//         setLoading(false);
//       }
//     }

//     run();
//     return () => {
//       cancelled = true;
//     };
//   }, [videoId]);

//   // --------- Quiz timer starts ONLY after quiz loaded ----------
//   useEffect(() => {
//     if (loading || finished) return;
//     const timer = setInterval(() => setTime((t) => t + 1), 1000);
//     return () => clearInterval(timer);
//   }, [loading, finished]);

//   const selectOption = (idx) => {
//     setAnswers((prev) => ({ ...prev, [current]: idx }));
//   };

//   const prev = () => {
//     if (current > 0) setCurrent((c) => c - 1);
//   };

//   // ✅ calculate score (count correct)
//   const calculateScore = () => {
//     let correct = 0;
//     for (let i = 0; i < questions.length; i++) {
//       if (answers[i] === questions[i].correct_index) correct++;
//     }
//     return correct;
//   };

//   // ✅ collect wrong answered questions
//   const getWrongAnswers = () => {
//     return questions
//       .map((q, i) => ({
//         questionNumber: i + 1,
//         question: q.question,
//         selectedAnswer:
//           answers[i] !== undefined ? q.options[answers[i]] : "Not answered",
//         correctAnswer: q.options[q.correct_index],
//         explanation: q.explanation || "",
//       }))
//       .filter((item, i) => answers[i] !== questions[i].correct_index);
//   };

//   // ✅ UPDATED: Finish quiz -> call predict-level API
//   const finishQuiz = async () => {
//     setPredicting(true);

//     try {
//       const score = calculateScore();        // e.g. 10
//       const timeSpent = time;               // seconds

//       // ✅ get wrong answers and print them to console
//       const wrongAnswers = getWrongAnswers();
//       console.log("Wrong Answers List:", wrongAnswers);
      
//       const levelRes = await predictUserLevel(score, timeSpent);

//       setPredictedLevel(levelRes?.predicted_level || "Unknown");
//       setFinished(true);
//     } catch (e) {
//       // if level API fails, still finish quiz with fallback
//       setPredictedLevel("Unknown");
//       setFinished(true);
//     } finally {
//       setPredicting(false);
//     }
//   };

//   const next = () => {
//     if (current < questions.length - 1) {
//       setCurrent((c) => c + 1);
//     } else {
//       // last question -> finish (calls API)
//       finishQuiz();
//     }
//   };

//   // =======================
//   // Loading UI
//   // =======================
//   if (loading) {
//     return (
//       <div className="quiz-loading">
//         <div className="loader-circle" />
//         <h2 className="loading-title">Generating your quiz…</h2>
//         <p className="loading-sub">{stageText}</p>

//         <div className="loading-stats">
//           <span className="pill">Video: {videoId}</span>
//           <span className="pill">Difficulty: medium</span>
//           <span className="pill">Questions: 10</span>
//           <span className="pill">Waiting: {loadingSeconds}s</span>
//         </div>

//         <div className="loading-bar" />
//         <p className="loading-hint">
//           This can take a few minutes because the AI is processing the transcript.
//           Please keep this tab open.
//         </p>
//       </div>
//     );
//   }

//   // Error UI
//   if (error) {
//     return (
//       <div className="quiz-loading">
//         <h2 style={{ marginBottom: 8 }}>⚠️ {error}</h2>
//         <p className="loading-hint">Try again, or check if backend is running.</p>

//         <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
//           <button className="quiz-btn ghost" onClick={() => navigate(-1)}>
//             ← Go Back
//           </button>
//           <button className="quiz-btn" onClick={() => window.location.reload()}>
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!questions.length) {
//     return (
//       <div className="quiz-loading">
//         <h2>No questions returned</h2>
//         <button className="quiz-btn back" onClick={() => navigate(`/video/${videoId}`)}>
//           ← Back to Video
//         </button>
//       </div>
//     );
//   }

//   const scoreNow = calculateScore();
//   const accuracyNow = questions.length ? Math.round((scoreNow / questions.length) * 100) : 0;

//   // =======================
//   // Quiz UI
//   // =======================
//   return (
//     <div className="quiz-wrap">
//       <div className="quiz-top">
//         <div>
//           <h1 style={{ margin: 0 }}>Quiz</h1>
//           {quizMeta && (
//             <div className="quiz-meta">
//               <span className="pill">Difficulty: {quizMeta.difficulty}</span>
//               <span className="pill">Total: {quizMeta.total_questions}</span>
//             </div>
//           )}
//         </div>

//         <div className="quiz-timer">⏱ {time}s</div>
//       </div>

//       {!finished ? (
//         <div className="quiz-card">
//           <div className="quiz-q">
//             Q{current + 1}. {questions[current].question}
//           </div>

//           <div className="quiz-options">
//             {questions[current].options.map((op, idx) => (
//               <div
//                 key={idx}
//                 className={"quiz-option " + (answers[current] === idx ? "selected" : "")}
//                 onClick={() => selectOption(idx)}
//               >
//                 {op}
//               </div>
//             ))}
//           </div>

//           <div className="quiz-nav">
//             <button
//               className="quiz-btn ghost"
//               disabled={current === 0 || predicting}
//               onClick={prev}
//             >
//               ← Previous
//             </button>

//             <button className="quiz-btn" onClick={next} disabled={predicting}>
//               {current === questions.length - 1
//                 ? predicting
//                   ? "Finishing..."
//                   : "Finish Quiz"
//                 : "Next →"}
//             </button>
//           </div>

//           {/* ✅ Optional: show small status when finishing */}
//           {predicting && (
//             <div className="predicting-box">
//               <div className="mini-spinner" />
//               Predicting your level… please wait
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="quiz-result">
//           <h2>🎉 Quiz Completed</h2>

//           <p><b>Time Taken:</b> {time} seconds</p>
//           <p><b>Score:</b> {scoreNow}/{questions.length}</p>
//           <p><b>Accuracy:</b> {accuracyNow}%</p>

//           <p><b>Predicted Level:</b> {predictedLevel || "Unknown"}</p>
//           <div className="level-badge">{predictedLevel || "Unknown"}</div>

//           <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
//             <button
//               className="quiz-btn ghost"
//               onClick={() => {
//                 // review mode: go to first question (keep answers)
//                 setFinished(false);
//                 setCurrent(0);
//               }}
//             >
//               Review
//             </button>

//             <button
//               className="quiz-btn back"
//               onClick={() => navigate(`/video/${videoId}`)}
//             >
//               ← Back to Video
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generateQuizByVideo, predictUserLevel } from "../services/quizService";
import "../styles/quiz.css";

export default function QuizPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [quizMeta, setQuizMeta] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [error, setError] = useState("");

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(0);

  const [finished, setFinished] = useState(false);
  const [predicting, setPredicting] = useState(false);

  const stages = useMemo(
    () => [
      "Fetching transcript…",
      "Cleaning & chunking content…",
      "Generating questions & options…",
      "Validating answers…",
      "Preparing your quiz UI…",
    ],
    []
  );

  const stageText = stages[Math.floor((loadingSeconds / 12) % stages.length)];

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadingSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [loading]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");
      setLoadingSeconds(0);

      try {
        const data = await generateQuizByVideo(videoId, "medium", 10);

        if (cancelled) return;

        setQuizMeta({
          video_id: data.video_id,
          difficulty: data.difficulty,
          total_questions: data.total_questions,
        });

        setQuestions(Array.isArray(data.questions) ? data.questions : []);
        setCurrent(0);
        setAnswers({});
        setFinished(false);
        setTime(0);
        setPredicting(false);

        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Failed to generate quiz.");
        setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  useEffect(() => {
    if (loading || finished) return;
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [loading, finished]);

  const selectOption = (idx) => {
    setAnswers((prev) => ({ ...prev, [current]: idx }));
  };

  const prev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const calculateScore = () => {
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correct_index) correct++;
    }
    return correct;
  };

  const getWrongAnswers = () => {
    return questions
      .map((q, i) => ({
        questionNumber: i + 1,
        question: q.question,
        selectedAnswer:
          answers[i] !== undefined ? q.options[answers[i]] : "Not answered",
        correctAnswer: q.options[q.correct_index],
        explanation: q.explanation || "",
      }))
      .filter((item, i) => answers[i] !== questions[i].correct_index);
  };

  const finishQuiz = async () => {
    setPredicting(true);

    try {
      const score = calculateScore();
      const timeSpent = time;
      const wrongAnswers = getWrongAnswers();

      console.log("Wrong Answers List:", wrongAnswers);

      const levelRes = await predictUserLevel(score, timeSpent);
      const predictedLevel = levelRes?.predicted_level || "Unknown";
      const accuracy = questions.length
        ? Math.round((score / questions.length) * 100)
        : 0;

      setFinished(true);

      navigate(`/quiz-result/${videoId}`, {
        state: {
          videoId,
          score,
          totalQuestions: questions.length,
          timeTaken: timeSpent,
          accuracy,
          predictedLevel,
          friendlyDetailed: levelRes?.friendly_detailed || "",
          wrongAnswers,
        },
      });
    } catch (e) {
      const score = calculateScore();
      const wrongAnswers = getWrongAnswers();
      const accuracy = questions.length
        ? Math.round((score / questions.length) * 100)
        : 0;

      console.log("Wrong Answers List:", wrongAnswers);

      setFinished(true);

      navigate(`/quiz-result/${videoId}`, {
        state: {
          videoId,
          score,
          totalQuestions: questions.length,
          timeTaken: time,
          accuracy,
          predictedLevel: "Unknown",
          wrongAnswers,
        },
      });
    } finally {
      setPredicting(false);
    }
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      finishQuiz();
    }
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loader-circle" />
        <h2 className="loading-title">Generating your quiz…</h2>
        <p className="loading-sub">{stageText}</p>

        <div className="loading-stats">
          <span className="pill">Video: {videoId}</span>
          <span className="pill">Difficulty: medium</span>
          <span className="pill">Questions: 10</span>
          <span className="pill">Waiting: {loadingSeconds}s</span>
        </div>

        <div className="loading-bar" />
        <p className="loading-hint">
          This can take a few minutes because the AI is processing the transcript.
          Please keep this tab open.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-loading">
        <h2 style={{ marginBottom: 8 }}>⚠️ {error}</h2>
        <p className="loading-hint">Try again, or check if backend is running.</p>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="quiz-btn ghost" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
          <button className="quiz-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="quiz-loading">
        <h2>No questions returned</h2>
        <button className="quiz-btn ghost" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-wrap">
      <div className="quiz-top">
        <div>
          <h1 style={{ margin: 0 }}>Quiz</h1>
          {quizMeta && (
            <div className="quiz-meta">
              <span className="pill">Difficulty: {quizMeta.difficulty}</span>
              <span className="pill">Total: {quizMeta.total_questions}</span>
            </div>
          )}
        </div>

        <div className="quiz-timer">⏱ {time}s</div>
      </div>

      <div className="quiz-card">
        <div className="quiz-q">
          Q{current + 1}. {questions[current].question}
        </div>

        <div className="quiz-options">
          {questions[current].options.map((op, idx) => (
            <div
              key={idx}
              className={"quiz-option " + (answers[current] === idx ? "selected" : "")}
              onClick={() => selectOption(idx)}
            >
              {op}
            </div>
          ))}
        </div>

        <div className="quiz-nav">
          <button
            className="quiz-btn ghost"
            disabled={current === 0 || predicting}
            onClick={prev}
          >
            ← Previous
          </button>

          <button className="quiz-btn" onClick={next} disabled={predicting}>
            {current === questions.length - 1
              ? predicting
                ? "Finishing..."
                : "Finish Quiz"
              : "Next →"}
          </button>
        </div>

        {predicting && (
          <div className="predicting-box">
            <div className="mini-spinner" />
            Predicting your level… please wait
          </div>
        )}
      </div>
    </div>
  );
}