import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Loader } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import { useQuiz } from '../../context/QuizContext';
import styles from './Quiz.module.css';

const Quiz = () => {
  const navigate = useNavigate();
  const { state, dispatch, resetQuiz, completeQuiz } = useQuiz();
  const { questions, currentQuestion, answers, isLoading, error, isCalculating } = state;
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Отладка
  console.log('Quiz render:', { 
    questionsLength: questions.length, 
    currentQuestion, 
    isLoading, 
    error,
    answersCount: Object.keys(answers).length
  });

  const currentQuestionData = questions[currentQuestion - 1];

  // Восстановление выбранного ответа
  useEffect(() => {
    const savedAnswer = answers[currentQuestion];
    if (savedAnswer !== undefined) {
      setSelectedAnswer(savedAnswer);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestion, answers]);

  // Проверка загрузки вопросов
  if (isLoading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loaderContainer}>
            <Loader size={40} className="animate-spin" />
            <p>Загрузка вопросов...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Проверка ошибки
  if (error) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
            <button onClick={() => window.location.reload()}>Повторить</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Проверка наличия вопросов
  if (!questions.length || !currentQuestionData) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loaderContainer}>
            <p>Нет доступных вопросов</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSelectAnswer = (index) => {
    console.log('Answer selected:', index);
    setSelectedAnswer(index);
    dispatch({
      type: 'SET_ANSWER',
      questionId: currentQuestion,
      answerIndex: index
    });
  };

  const handleNext = async () => {
    console.log('handleNext called, selectedAnswer:', selectedAnswer);
    
    if (selectedAnswer === null) return;

    if (currentQuestion < questions.length) {
      // Переход к следующему вопросу
      dispatch({ type: 'NEXT_QUESTION' });
      setSelectedAnswer(null);
    } else {
      // Последний вопрос - отправка результатов
      console.log('Last question, completing quiz...');
      try {
        await completeQuiz();
        console.log('Quiz completed, navigating to result');
        navigate('/result');
      } catch (err) {
        console.error('Failed to complete quiz:', err);
        // Обработка ошибки
      }
    }
  };

  const handleReset = () => {
    if (showResetConfirm) {
      resetQuiz();
      setSelectedAnswer(null);
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  const isLastQuestion = currentQuestion === questions.length;
  const hasNext = selectedAnswer !== null;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <ProgressBar current={currentQuestion} total={questions.length} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.questionWrapper}
          >
            <QuestionCard
              question={currentQuestionData}
              selectedAnswer={selectedAnswer}
              onSelect={handleSelectAnswer}
            />
          </motion.div>
        </AnimatePresence>

        <div className={styles.navigation}>
          <button
            className={`${styles.nextButton} ${!hasNext || isCalculating ? styles.disabled : ''}`}
            onClick={handleNext}
            disabled={!hasNext || isCalculating}
          >
            {isCalculating ? (
              <>
                <Loader size={18} className="animate-spin" />
                Обработка...
              </>
            ) : (
              isLastQuestion ? 'Узнать результат' : 'Далее'
            )}
          </button>
        </div>

        <button
          className={styles.resetButton}
          onClick={handleReset}
          title="Сбросить всё"
          disabled={isCalculating}
        >
          <RotateCcw size={16} />
          {showResetConfirm ? 'Нажмите ещё раз для подтверждения' : 'Сбросить всё'}
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default Quiz;