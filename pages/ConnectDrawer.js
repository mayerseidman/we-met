import styles from "../styles/components/ConnectDrawerComponent.module.scss";

// ══════════════════════════════════════════════════════════════
// ConnectDrawer Component
// ══════════════════════════════════════════════════════════════
// Bottom drawer with Show QR and Scan QR action choices

const ACTIONS = [
    {
        id: "show",
        label: "Show My QR",
        description: "Share your code with others",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <path d="M12 18h.01"></path>
            </svg>
        ),
    },
    {
        id: "scan",
        label: "Scan QR",
        description: "Add someone to your connections",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
        ),
    },
];

export default function ConnectDrawer({ onSelectAction }) {
    return (
        <div className={styles.drawerContainer}>
            <div className={styles.drawer}>
                <div className={styles.handle}></div>
                
                <h2 className={styles.title}>Connect</h2>
                <p className={styles.subtitle}>Choose an action</p>

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
        </div>
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
        <div className={styles.actionArrow}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m9 18 6-6-6-6"/>
            </svg>
        </div>
    </button>
);