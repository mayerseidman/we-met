import styles from "../styles/components/ConnectDrawer.module.scss";

// ══════════════════════════════════════════════════════════════
// ConnectDrawer Component
// ══════════════════════════════════════════════════════════════
// Modal drawer overlay with Show QR and Scan QR action choices

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

export default function ConnectDrawer({ onSelectAction, onClose }) {
    return (
        <>
            {/* Backdrop */}
            <div className={styles.backdrop} onClick={onClose} />
            
            {/* Drawer */}
            <div className={styles.drawer}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Connect</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <img src="/icons/pop/close.svg" alt="" width={20} height={20} />
                    </button>
                </div>

                <div className={styles.actions}>
                    {ACTIONS.map((action) => (
                        <ActionCard
                            key={action.id}
                            action={action}
                            onClick={() => onSelectAction(action.id)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

// ── Sub-components ────────────────────────────────────────────

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