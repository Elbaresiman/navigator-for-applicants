import styles from './Toast.module.css';

const Toast = ({ message, type = 'error', onClose }) => {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Toast;
