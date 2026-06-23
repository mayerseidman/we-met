import { useEffect, useState } from 'react';
import Avatar from './Avatar';
import toastStyles from '../styles/components/Toast.module.scss';
import styles from '../styles/components/ScanQR.module.scss';

export default function ScanSuccessModal({ name, photo, onDismiss }) {
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
            className={`${toastStyles.toast} ${styles.toastLight} ${closing ? toastStyles.toastClosing : ''}`}
            onClick={handleDismiss}
        >
            <Avatar src={photo} name={name} size={44} />
            <div className={styles.successText}>
                <div className={styles.successTitle}>New Connection Added</div>
                <div className={styles.successName}>{name}</div>
            </div>
        </div>
    );
}