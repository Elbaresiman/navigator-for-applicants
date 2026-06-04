import styles from './ProgressBar.module.css';

const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;
  
  return (
    <div className={styles.progressContainer}>
      <span className={styles.progressText}>Вопрос {current} / {total}</span>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
