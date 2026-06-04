import { useState, useEffect, useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './PhotoSwiper.module.css';

const photos = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  src: `/images/photo${i + 1}.jpg`
}));

const PhotoSwiper = () => {
  const [slidesPerView, setSlidesPerView] = useState(2);
  const [showNavigation, setShowNavigation] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const swiperInstance = useRef(null);

  useEffect(() => {
    const updateView = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setSlidesPerView(5);
        setShowNavigation(true);
      } else if (width >= 768) {
        setSlidesPerView(3);
        setShowNavigation(false);
      } else {
        setSlidesPerView(2);
        setShowNavigation(false);
      }
    };

    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeLightbox]);

  return (
    <>
      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={slidesPerView}
          navigation={showNavigation}
          grabCursor
          freeMode={true}
          className={styles.swiper}
          preventClicksPropagation={true}
        >
          {photos.map((photo, index) => (
            <SwiperSlide key={photo.id}>
              <div className={styles.photoWrapper}>
                <img
                  src={photo.src}
                  alt={`Студент ${photo.id}`}
                  className={styles.photo}
                  loading="lazy"
                  draggable={false}
                  onClick={() => openLightbox(index)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <p className={styles.caption}>Наши студенты в проектах и учёбе</p>
      </div>

      {lightboxIndex !== null && (
        <div className={styles.lightbox}>
          <div className={styles.lightboxBackdrop} onClick={closeLightbox} />
          <button className={styles.lightboxClose} onClick={closeLightbox}>
            &times;
          </button>
          <div className={styles.lightboxContent}>
            <Swiper
              modules={[Navigation]}
              initialSlide={lightboxIndex}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              grabCursor
              className={styles.lightboxSwiper}
              onSlideChange={(swiper) => setLightboxIndex(swiper.activeIndex)}
              onSwiper={(swiper) => (swiperInstance.current = swiper)}
            >
              {photos.map((photo) => (
                <SwiperSlide key={photo.id}>
                  <div className={styles.lightboxSlide}>
                    <img
                      src={photo.src}
                      alt={`Студент ${photo.id}`}
                      className={styles.lightboxImage}
                      draggable={false}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className={styles.lightboxCounter}>
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoSwiper;
