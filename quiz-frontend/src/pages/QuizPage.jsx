import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/quiz.css";

const QUESTIONS = [
  {
    q: "What is React?",
    options: [
      "A database",
      "A JavaScript library for UI",
      "A backend framework",
      "A programming language",
    ],
    answer: 1,
  },
  {
    q: "What hook is used for state?",
    options: ["useRef", "useEffect", "useState", "useMemo"],
    answer: 2,
  },
  {
    q: "JSX stands for?",
    options: [
      "Java Syntax XML",
      "JavaScript XML",
      "JSON XML",
      "Java Source X",
    ],
    answer: 1,
  },
  {
    q: "Which company created React?",
    options: ["Google", "Facebook", "Microsoft", "Amazon"],
    answer: 1,
  },
  {
    q: "What is a component?",
    options: [
      "CSS file",
      "Reusable UI block",
      "API",
      "Database table",
    ],
    answer: 1,
  },
  {
    q: "useEffect is mainly for?",
    options: ["Styling", "Routing", "Side effects", "State"],
    answer: 2,
  },
  {
    q: "Virtual DOM improves?",
    options: ["Security", "Speed", "SEO", "Storage"],
    answer: 1,
  },
  {
    q: "Props are?",
    options: [
      "Mutable state",
      "Functions",
      "Read-only inputs",
      "Hooks",
    ],
    answer: 2,
  },
  {
    q: "React uses which language?",
    options: ["Python", "Java", "JavaScript", "PHP"],
    answer: 2,
  },
  {
    q: "Key prop is used for?",
    options: [
      "Security",
      "Styling",
      "Identifying list items",
      "Hooks",
    ],
    answer: 2,
  },
];

export default function QuizPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(0);
  const [finished, setFinished] = useState(false);

  // ⏱ Timer
  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [finished]);

  const selectOption = (idx) => {
    setAnswers({ ...answers, [current]: idx });
  };

  const next = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  // ✅ NEW: previous question
  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const calculateResult = () => {
    let correct = 0;
    QUESTIONS.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });

    const accuracy = Math.round((correct / QUESTIONS.length) * 100);

    let level = "Beginner";
    if (accuracy > 80) level = "Advanced";
    else if (accuracy >= 50) level = "Intermediate";

    return { correct, accuracy, level };
  };

  const result = finished ? calculateResult() : null;

  return (
    <div className="quiz-wrap">
      <div className="quiz-top">
        <h1>Quiz</h1>
        <div className="quiz-timer">⏱ {time}s</div>
      </div>

      {!finished ? (
        <div className="quiz-card">
          <div className="quiz-q">
            Q{current + 1}. {QUESTIONS[current].q}
          </div>

          <div className="quiz-options">
            {QUESTIONS[current].options.map((op, idx) => (
              <div
                key={idx}
                className={
                  "quiz-option " +
                  (answers[current] === idx ? "selected" : "")
                }
                onClick={() => selectOption(idx)}
              >
                {op}
              </div>
            ))}
          </div>

          {/* ✅ Navigation buttons */}
          <div className="quiz-nav">
            <button
              className="quiz-btn ghost"
              disabled={current === 0}
              onClick={prev}
            >
              ← Previous
            </button>

            <button className="quiz-btn" onClick={next}>
              {current === QUESTIONS.length - 1 ? "Finish Quiz" : "Next →"}
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-result">
          <h2>🎉 Quiz Completed</h2>

          <p><b>Time Taken:</b> {time} seconds</p>
          <p><b>Accuracy:</b> {result.accuracy}%</p>
          <p><b>User Level:</b> {result.level}</p>

          <div className="level-badge">{result.level}</div>

          {/* ✅ NEW: Back to video details */}
          <button
            className="quiz-btn back"
            onClick={() => navigate(`/video/${videoId}`)}
          >
            ← Back to Video
          </button>
        </div>
      )}
    </div>
  );
}
