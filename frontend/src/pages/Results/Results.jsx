import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, RotateCcw, Zap, TrendingUp, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown'
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RadarChart from '../../components/RadarChart/RadarChart';
import BarChart from '../../components/BarChart/BarChart';
import SocialLinks from '../../components/SocialLinks/SocialLinks';
import Skeleton from '../../components/Skeleton/Skeleton';
import { loadResult, clearQuizState } from '../../utils/localStorage';
import { specialties, subCompetencies } from '../../data/questions';
import styles from './Results.module.css';

const Results = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const downloadRef = useRef(null);

  useEffect(() => {
    try {
      const savedResult = loadResult();
      console.log('Loaded result:', savedResult); // Для отладки
      
      if (savedResult) {
        // Трансформируем данные для компонентов, если нужно
        setResult(savedResult);
      } else {
        setError('Не удалось загрузить результат. Пройдите опрос заново.');
      }
    } catch (err) {
      console.error('Error loading result:', err);
      setError('Ошибка загрузки результата');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRestart = () => {
    clearQuizState();
    localStorage.removeItem('it_navigator_result');
    navigate('/quiz');
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = downloadRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#F7F9FC',
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1200
      });

      const link = document.createElement('a');
      link.download = 'it-navigator-result.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Ошибка экспорта:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <Skeleton type="card" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.restartButton} onClick={handleRestart}>
              Пройти опрос заново
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!result) return null;

  // Подготавливаем данные для компонентов
  // Компоненты ожидают данные в определённом формате
  const chartData = {
    // Для RadarChart — нужен объект с ключами cognitive, social, digital
    meta_percent: result.percentages?.meta || {},
    
    // Для горизонтального BarChart (специальности) — нужен specs_percent
    specs_percent: result.percentages?.specs || {},
    
    // Для вертикального BarChart (подкомпетенции) — нужен sub_percent
    sub_percent: result.percentages?.sub || {},
    
    // Уровень фильтрации
    level_filter: result.level_filter || 'all',
    
    // Для отображения рекомендаций
    superpower: result.recommendations?.superpower || '',
    growth_zone: result.recommendations?.growth_zone || '',
    top_specs: result.recommendations?.top_specs || [],
    final_text: result.final_text || ''
  };

  console.log('Chart data prepared:', chartData); // Для отладки

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div ref={downloadRef} className={styles.downloadContent}>
            <h2 className={styles.pageTitle}>Результаты тестирования</h2>
            
            {/* Радарная диаграмма — передаём meta_percent */}
            <RadarChart meta_percent={chartData.meta_percent} />
            
            {/* Горизонтальная диаграмма специальностей */}
            <BarChart 
              type="horizontal" 
              data={chartData} 
              level_filter={chartData.level_filter} 
            />
            
            {/* Вертикальная диаграмма компетенций */}
            <BarChart 
              type="vertical" 
              data={chartData} 
            />
            
            <motion.div 
              className={styles.resultCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className={styles.resultTitle}>
                <Award size={24} className={styles.titleIcon} />
                <span className={styles.gradientText}>ТВОЙ РЕЗУЛЬТАТ</span>
              </h3>
              <div className={styles.resultContent}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>
                    <Zap size={16} className={styles.labelIcon} />
                    Суперсила:
                  </span>
                  <span className={styles.resultValue}>{chartData.superpower}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>
                    <TrendingUp size={16} className={styles.labelIcon} />
                    Зона роста:
                  </span>
                  <span className={styles.resultValue}>{chartData.growth_zone}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Рекомендуемые специальности:</span>
                  <span className={styles.resultValue}>
                    {chartData.top_specs?.map(code => specialties[code]?.name || code).join(', ')}
                  </span>
                </div>
                <div className={styles.finalText}>
                  <ReactMarkdown
                    components={{
                      // Custom styling for markdown elements
                      strong: ({ children }) => <strong style={{ color: 'var(--color-accent-2)' }}>{children}</strong>,
                      p: ({ children }) => <>{children}</>,
                    }}
                  >
                    {chartData.final_text}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>

            <SocialLinks />
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.downloadButton} 
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download size={18} />
              {downloading ? 'Сохранение...' : 'Скачать результат'}
            </button>
            <button className={styles.restartButtonOutline} onClick={handleRestart}>
              <RotateCcw size={18} />
              Пройти опрос заново
            </button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;