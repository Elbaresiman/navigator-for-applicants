import { useState, useEffect } from 'react';
import { Globe, MessageCircle, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { socialLinks } from '../../data/questions';
import styles from './SocialLinks.module.css';

const SocialLinks = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'vk':
      case 'telegram':
        return <MessageCircle size={20} />;
      case 'globe':
        return <Globe size={20} />;
      default:
        return <Globe size={20} />;
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Будь с нами</h3>
      <div className={styles.linksGrid}>
        {socialLinks.map((link, index) => (
          <div key={index} className={styles.linkItem}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {getIcon(link.icon)}
              <span>{link.name}</span>
            </a>
            {isMobile ? (
              <div className={styles.qrAlways}>
                <QRCodeSVG
                  value={link.url}
                  size={80}
                  bgColor="#FFFFFF"
                  fgColor="#1A2A3A"
                  level="M"
                />
              </div>
            ) : (
              <div className={styles.qrPopup}>
                <QrCode size={16} className={styles.qrIcon} />
                <div className={styles.qrContent}>
                  <QRCodeSVG
                    value={link.url}
                    size={100}
                    bgColor="#FFFFFF"
                    fgColor="#1A2A3A"
                    level="M"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
