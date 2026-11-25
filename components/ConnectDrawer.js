import { useState, useEffect } from "react";
import CloseButton from "../components/CloseButton";
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

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 220);
    };

    const handleSelect = (id) => {
        setClosing(true);
        setTimeout(() => onSelectAction(id), 220);
    };

    return (
        <>
            <div
                className={`${styles.backdrop} ${closing ? styles.backdropClosing : ""}`}
                onClick={handleClose}
            />
            <div className={`${styles.drawer} ${closing ? styles.drawerClosing : ""}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Connect</h2>
                    <CloseButton onClick={handleClose} />
                </div>

                <div className={styles.body}>
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
    </button>
);