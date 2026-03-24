import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateQuiz from "./pages/CreateQuiz";
import VideoDetails from "./pages/VideoDetails";
import QuizPage from "./pages/QuizPage";
import QuizResultPage from "./pages/QuizResultPage";
import NotesPage from "./pages/NotesPage";
import MindMapPage from "./pages/MindMapPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import CommentsQA from "./pages/CommentsQA";
import ExplanationsPage from "./pages/ExplanationsPage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* protected routes */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateQuiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/video/:videoId"
          element={
            <ProtectedRoute>
              <VideoDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes/:videoId"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:videoId"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        <Route path="/quiz-result/:videoId" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />

        <Route path="/mindmap/:videoId" element={<ProtectedRoute><MindMapPage /></ProtectedRoute>} />

        <Route path="/recommendations/:videoId" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
        
        <Route
          path="/comments/:videoId"
          element={
            <ProtectedRoute>
              <CommentsQA />
            </ProtectedRoute>
          }
        />

        <Route
          path="/explanations/:videoId"
          element={
            <ProtectedRoute>
              <ExplanationsPage />
            </ProtectedRoute>
          }
        />

      </Routes>

      
    </>
  );
}