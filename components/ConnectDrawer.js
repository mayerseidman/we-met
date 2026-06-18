import { useState } from "react";
import styles from "../styles/components/ConnectDrawer.module.scss";

const ACTIONS = [
    {
        id: "show",
        label: "SHOW QR",
        description: "Let them scan you",
        icon: <img src="/icons/pop/qr-code.svg" alt="" width={32} height={32} />,
    },
    {
        id: "scan",
        label: "SCAN QR",
        description: "Scan someone else",
        icon: <img src="/icons/pop/camera.svg" alt="" width={32} height={32} />,
    },
];

export default function ConnectDrawer({ onSelectAction, onClose }) {
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 280);
    };

    const handleSelect = (id) => {
        setClosing(true);
        setTimeout(() => onSelectAction(id), 280);
    };

    return (
        <>
            <div className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`} onClick={handleClose} />
            <div className={`${styles.drawer} ${closing ? styles.drawerClosing : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>CONNECT</h2>
                    <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
                        <img src="/icons/pop/close.svg" alt="" width={20} height={20} />
                    </button>
                </div>
                <div className={styles.actions}>
                    {ACTIONS.map((action) => (
                        <ActionCard
                            key={action.id}
                            action={action}
                            onClick={() => handleSelect(action.id)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

const ActionCard = ({ action, onClick }) => (
    <button className={styles.actionCard} onClick={onClick}>
        <div className={styles.actionIcon}>{action.icon}</div>
        <div className={styles.actionText}>
            <h3 className={styles.actionLabel}>{action.label}</h3>
            <p className={styles.actionDescription}>{action.description}</p>
        </div>
        <span className={styles.actionArrow}>→</span>
    </button>
);