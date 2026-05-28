import styles from "../styles/components/ConnectPopover.module.scss";
const ACTIONS = [
    {
        id: "show",
        label: "Show QR",
        description: "Share your code with others",
        icon: <img src="/icons/pop/qr-code.svg" alt="" width={36} height={36} />,
    },
    {
        id: "scan",
        label: "Scan QR",
        description: "Scan another person's code",
        icon: <img src="/icons/pop/camera.svg" alt="" width={36} height={36} />,
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
                            <span className={styles.actionArrow}>→</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}