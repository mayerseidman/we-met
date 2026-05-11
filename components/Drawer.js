import { useState, useEffect } from 'react';
import styles from '../styles/components/Drawer.module.scss';

// ══════════════════════════════════════════════════════════════
// Shared Drawer + Modal shell
// Usage:
//   <Drawer title="Choose Event" onClose={onClose} isModal={isModal}>
//     ...content...
//   </Drawer>
// ══════════════════════════════════════════════════════════════

export default function Drawer({ title, onClose, isModal = false, children }) {
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            onClose();
        }, 280); // match animation duration
    };

    if (isModal) {
        return (
            <div className={`${styles.modalOverlay} ${closing ? styles.modalOverlayClosing : ''}`} onClick={handleClose}>
                <div className={`${styles.modal} ${closing ? styles.modalClosing : ''}`} onClick={e => e.stopPropagation()}>
                    <button className={styles.closeButton} onClick={handleClose} aria-label="Close"><img src="/icons/pop/close.svg" alt="" width={20} height={20} /></button>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`} onClick={handleClose} />
            <div className={`${styles.drawer} ${closing ? styles.drawerClosing : ''}`}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <button className={styles.closeButton} onClick={handleClose} aria-label="Close"><img src="/icons/pop/close.svg" alt="" width={20} height={20} /></button>
                </div>
                {children}
            </div>
        </>
    );
}