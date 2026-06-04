import styles from './Skeleton.module.css';

const Skeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className={styles.skeletonCard}>
        <div className={`${styles.skeletonLine} ${styles.wide}`} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonChart} />
      </div>
    );
  }
  
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonCircle} />
      <div className={styles.skeletonBar} />
      <div className={styles.skeletonText} />
    </div>
  );
};

export default Skeleton;
