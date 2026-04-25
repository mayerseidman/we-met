import { useEffect, useState } from 'react';
import Avatar from './Avatar';
import styles from '../styles/components/ScanQR.module.scss';

export default function ScanSuccessModal({ name, photo, onDismiss, isMobile }) {
    const [closing, setClosing] = useState(false);

    const handleDismiss = () => {
        setClosing(true);
        setTimeout(onDismiss, 280);
    };

    useEffect(() => {
        const timer = setTimeout(handleDismiss, 4500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`${styles.successOverlay} ${isMobile ? styles.successMobile : styles.successDesktop} ${closing && isMobile ? styles.successMobileClosing : ''} ${closing && !isMobile ? styles.successDesktopClosing : ''}`}
            onClick={handleDismiss}
        >
            <div className={styles.successCard} onClick={e => e.stopPropagation()}>
                <button className={styles.successClose} onClick={handleDismiss}>×</button>
                <Avatar src={photo} name={name} size={44} />
                <div className={styles.successText}>
                    <div className={styles.successTitle}>New Connection Added</div>
                    <div className={styles.successName}>{name}</div>
                </div>
            </div>
        </div>
    );
}