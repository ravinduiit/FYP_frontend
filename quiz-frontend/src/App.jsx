import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateQuiz from "./pages/CreateQuiz";
import VideoDetails from "./pages/VideoDetails";
import QuizPage from "./pages/QuizPage";


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateQuiz />} />
        <Route path="/register" element={<Register />} />
        <Route path="/video/:videoId" element={<VideoDetails />} />
        <Route path="/quiz/:videoId" element={<QuizPage />} />
      </Routes>
    </>
  );
}
