import { Check } from 'lucide-react';
import styles from './QuestionCard.module.css';

const QuestionCard = ({ question, selectedAnswer, onSelect }) => {
  return (
    <div className={styles.questionCard}>
      <h3 className={styles.questionText}>{question.text}</h3>
      <div className={styles.answers}>
        {question.answers.map((answer, idx) => (
          <button
            key={idx}
            className={`${styles.answerOption} ${selectedAnswer === idx ? styles.selected : ''}`}
            onClick={() => onSelect(idx)}
          >
            <span className={styles.answerText}>{answer.text}</span>
            {selectedAnswer === idx && <Check className={styles.checkIcon} size={20} />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
