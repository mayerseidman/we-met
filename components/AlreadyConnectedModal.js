import { useEffect, useState } from 'react';
import CloseButton from "../components/CloseButton";
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
                <CloseButton onClick={handleDismiss} className={styles.closeButtonPosition} />
                <div className={styles.successEmoji}><img src="/icons/pop/handshake.svg" alt="" width={48} height={48} /></div>
                <div className={styles.successText}>
                    <div className={styles.successTitle}>Already Connected</div>
                    <div className={styles.successName}>
                        {name} <span style={{ color: 'rgba(0,0,0,0.3)', margin: '0 2px' }}>|</span> {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}
                    </div>
                </div>
            </div>
        </div>
    );
}