import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import Home from './pages/Home/Home';
import Quiz from './pages/Quiz/Quiz';
import Results from './pages/Results/Results';
import './styles/variables.css';
import './styles/animations.css';

function App() {
  return (
    <BrowserRouter>
      <QuizProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<Results />} />
          </Routes>
        </div>
      </QuizProvider>
    </BrowserRouter>
  );
}

export default App;
