import styles from "../styles/components/ConnectPopover.module.scss";

const ACTIONS = [
    {
        id: "show",
        label: "SHOW QR",
        description: "Let them scan you",
        icon: <img src="/icons/pop/qr-code.svg" alt="" width={24} height={24} />,
    },
    {
        id: "scan",
        label: "SCAN QR",
        description: "Scan someone else",
        icon: <img src="/icons/pop/camera.svg" alt="" width={24} height={24} />,
    },
];

export default function ConnectPopover({ onSelectAction, onClose }) {
    return (
        <>
            <div className={styles.backdrop} onClick={onClose} />
            <div className={styles.popover}>
                <div className={styles.actions}>
                    {ACTIONS.map((action) => (
                        <button
                            key={action.id}
                            className={styles.actionCard}
                            onClick={() => onSelectAction(action.id)}
                        >
                            <div className={styles.actionIcon}>{action.icon}</div>
                            <div className={styles.actionText}>
                                <h3 className={styles.actionLabel}>{action.label}</h3>
                                <p className={styles.actionDescription}>{action.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}