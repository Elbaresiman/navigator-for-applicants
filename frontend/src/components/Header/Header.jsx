import logo from '../../assets/images/logo.png';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <img src={logo} alt="ИУБиП" className={styles.logo} />
        <p className={styles.subtitle}>
          Профориентационный бот для абитуриентов Академии Цифрового Развития
        </p>
      </div>
    </header>
  );
};

export default Header;
