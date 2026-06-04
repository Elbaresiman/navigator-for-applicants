import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PhotoSwiper from '../../components/PhotoSwiper/PhotoSwiper';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <motion.div 
          className={styles.hero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>Найди свою IT-траекторию</h1>
          <motion.button
            className={styles.ctaButton}
            onClick={handleStartQuiz}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Определи свою IT-траекторию →
          </motion.button>
          <p className={styles.slogan}>
            18 вопросов — и ты узнаешь, какая IT-специальность твоя
          </p>
        </motion.div>
        
        <motion.div
          className={styles.gallerySection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PhotoSwiper />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
