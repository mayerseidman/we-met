import { useEffect, useState } from 'react';
import styles from '../styles/components/ScanQR.module.scss';

export default function AlreadyConnectedModal({ name, daysAgo, onDismiss, isMobile }) {
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
            className={`${styles.successOverlay} ${isMobile ? styles.successMobile : styles.successDesktop} ${closing ? styles.successClosing : ''}`}
            onClick={handleDismiss}
        >
            <div className={styles.successCard} onClick={e => e.stopPropagation()}>
                <button className={styles.successClose} onClick={handleDismiss} aria-label="Close"><img src="/icons/pop/close.svg" alt="" width={18} height={18} /></button>
                <div className={styles.successEmoji}><img src="/icons/pop/handshake.svg" alt="" width={48} height={48} /></div>
                <div className={styles.successText}>
                    <div className={styles.successTitle}>Already Connected</div>
                    <div className={styles.successName}>
                        {name} · {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}
                    </div>
                </div>
            </div>
        </div>
    );
}