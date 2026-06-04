import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadQuizState, saveQuizState, clearQuizState, saveResult } from '../utils/localStorage';
import { api } from '../services/api';

const QuizContext = createContext(null);

const initialState = {
  currentQuestion: 1,  // В React нумерация с 1 (фильтр-вопрос)
  answers: {},
  isComplete: false,
  questions: [],
  isLoading: true,
  error: null,
  isCalculating: false
};

function quizReducer(state, action) {
  switch (action.type) {
    case 'SET_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.answerIndex }
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1
      };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CALCULATING':
      return { ...state, isCalculating: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, isCalculating: false };
    case 'COMPLETE_QUIZ':
      return { ...state, isComplete: true, isCalculating: false };
    case 'RESTORE_STATE':
      return {
        ...state,
        answers: action.payload.answers || {},
        currentQuestion: action.payload.currentQuestion || 1,
        isLoading: false
      };
    case 'RESET':
      return {
        ...initialState,
        questions: state.questions,
        isLoading: false
      };
    default:
      return state;
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Загружаем вопросы
  useEffect(() => {
    let isMounted = true;
    
    async function loadQuestions() {
      try {
        const questions = await api.getQuestions();
        if (isMounted) {
          // Вопросы из API уже имеют правильные id (0-17)
          // Но в React мы будем использовать индекс+1 для удобства
          dispatch({ type: 'SET_QUESTIONS', payload: questions });
          
          // Восстанавливаем сохранённое состояние
          const savedState = loadQuizState();
          if (savedState && !savedState.isComplete) {
            dispatch({ 
              type: 'RESTORE_STATE', 
              payload: { 
                answers: savedState.answers, 
                currentQuestion: savedState.currentQuestion 
              } 
            });
          }
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
        if (isMounted) {
          dispatch({ type: 'SET_ERROR', payload: error.message });
        }
      }
    }
    
    loadQuestions();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Сохраняем состояние
  useEffect(() => {
    if (!state.isLoading && !state.isCalculating && state.questions.length > 0) {
      saveQuizState({
        currentQuestion: state.currentQuestion,
        answers: state.answers,
        isComplete: state.isComplete
      });
    }
  }, [state.currentQuestion, state.answers, state.isComplete, state.isLoading, state.isCalculating, state.questions.length]);

  const completeQuiz = useCallback(async () => {
    console.log('completeQuiz called');
    console.log('Raw answers:', state.answers);
    dispatch({ type: 'SET_CALCULATING', payload: true });
    
    try {
      const sessionId = localStorage.getItem('quizSessionId') || crypto.randomUUID();
      localStorage.setItem('quizSessionId', sessionId);
      
      const result = await api.calculateResults(sessionId, state.answers);
      console.log('Result saved:', result);
      
      saveResult(result);
      dispatch({ type: 'COMPLETE_QUIZ' });
      return result;
    } catch (error) {
      console.error('Failed to calculate results:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.answers]);

  const resetQuiz = useCallback(() => {
    clearQuizState();
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <QuizContext.Provider value={{ state, dispatch, resetQuiz, completeQuiz }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
}