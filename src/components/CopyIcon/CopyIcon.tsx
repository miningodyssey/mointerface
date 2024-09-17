import { motion } from 'framer-motion';
import styles from './CopyIcon.module.css'; // Подключите свой CSS модуль

const CopyComponent = () => (
    <motion.svg className={styles.copyImage} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path  fillRule="evenodd" clipRule="evenodd" d="M9.85842 4L15.2001 4C17.4092 4 19.2001 5.79086 19.2001 8C19.2001 8.88366 18.4837 9.6 17.6001 9.6C16.7164 9.6 16.0001 8.88366 16.0001 8C16.0001 7.55818 15.6419 7.2 15.2001 7.2H9.92009C8.99761 7.2 8.40197 7.20125 7.94863 7.23829C7.51397 7.2738 7.35282 7.33408 7.27371 7.37439C6.97265 7.52779 6.72788 7.77256 6.57448 8.07362C6.53417 8.15273 6.47389 8.31388 6.43837 8.74854C6.40134 9.20188 6.40009 9.79752 6.40009 10.72V14.4C6.40009 15.2201 6.40784 15.3965 6.43083 15.5121C6.55709 16.1469 7.05324 16.643 7.68795 16.7693C7.80354 16.7923 7.97995 16.8 8.80009 16.8C9.68375 16.8 10.4001 17.5163 10.4001 18.4C10.4001 19.2837 9.68375 20 8.80009 20C8.7549 20 8.71016 20 8.66587 20.0001C8.05676 20.0006 7.53222 20.001 7.06366 19.9078C5.15954 19.529 3.67107 18.0406 3.29232 16.1364C3.19912 15.6679 3.19954 15.1433 3.20002 14.5342C3.20006 14.4899 3.20009 14.4452 3.20009 14.4L3.20009 10.6583C3.20006 9.81489 3.20004 9.08727 3.249 8.48796C3.30068 7.85541 3.41479 7.22626 3.72326 6.62085C4.18345 5.71767 4.91776 4.98336 5.82094 4.52317C6.42634 4.2147 7.05549 4.1006 7.68805 4.04891C8.28736 3.99995 9.01498 3.99997 9.85842 4ZM19.4584 12H22.1418C22.9852 12 23.7128 11.9999 24.3121 12.0489C24.9447 12.1006 25.5738 12.2147 26.1792 12.5232C27.0824 12.9834 27.8167 13.7177 28.2769 14.6208C28.5854 15.2263 28.6995 15.8554 28.7512 16.488C28.8001 17.0873 28.8001 17.8149 28.8001 18.6584V21.3416C28.8001 22.1851 28.8001 22.9127 28.7512 23.512C28.6995 24.1446 28.5854 24.7738 28.2769 25.3792C27.8167 26.2823 27.0824 27.0166 26.1792 27.4768C25.5738 27.7853 24.9447 27.8994 24.3121 27.9511C23.7128 28.0001 22.9852 28 22.1417 28H19.4585C18.615 28 17.8874 28.0001 17.288 27.9511C16.6555 27.8994 16.0263 27.7853 15.4209 27.4768C14.5178 27.0166 13.7835 26.2823 13.3233 25.3792C13.0148 24.7738 12.9007 24.1446 12.849 23.512C12.8 22.9127 12.8001 22.1851 12.8001 21.3417V18.6583C12.8001 17.8149 12.8 17.0873 12.849 16.488C12.9007 15.8554 13.0148 15.2263 13.3233 14.6208C13.7835 13.7177 14.5178 12.9834 15.4209 12.5232C16.0263 12.2147 16.6555 12.1006 17.288 12.0489C17.8874 11.9999 18.615 12 19.4584 12ZM17.5486 15.2383C17.114 15.2738 16.9528 15.3341 16.8737 15.3744C16.5726 15.5278 16.3279 15.7726 16.1745 16.0736C16.1342 16.1527 16.0739 16.3139 16.0384 16.7485C16.0013 17.2019 16.0001 17.7975 16.0001 18.72V21.28C16.0001 22.2025 16.0013 22.7981 16.0384 23.2515C16.0739 23.6861 16.1342 23.8473 16.1745 23.9264C16.3279 24.2274 16.5726 24.4722 16.8737 24.6256C16.9528 24.6659 17.114 24.7262 17.5486 24.7617C18.002 24.7988 18.5976 24.8 19.5201 24.8H22.0801C23.0026 24.8 23.5982 24.7988 24.0516 24.7617C24.4862 24.7262 24.6474 24.6659 24.7265 24.6256C25.0275 24.4722 25.2723 24.2274 25.4257 23.9264C25.466 23.8473 25.5263 23.6861 25.5618 23.2515C25.5988 22.7981 25.6001 22.2025 25.6001 21.28V18.72C25.6001 17.7975 25.5988 17.2019 25.5618 16.7485C25.5263 16.3139 25.466 16.1527 25.4257 16.0736C25.2723 15.7726 25.0275 15.5278 24.7265 15.3744C24.6474 15.3341 24.4862 15.2738 24.0516 15.2383C23.5982 15.2012 23.0026 15.2 22.0801 15.2H19.5201C18.5976 15.2 18.002 15.2012 17.5486 15.2383Z" fill="currentColor"/>
    </motion.svg>
);

export default CopyComponent;
