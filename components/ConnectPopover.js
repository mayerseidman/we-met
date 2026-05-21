import styles from "../styles/components/ConnectPopover.module.scss";

const ACTIONS = [
    {
        id: "show",
        label: "Show QR",
        description: "Share your code with another",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 17V16H13V13H16V15H18V17H17V19H15V21H13V18H15V17H16ZM21 21H17V19H19V17H21V21ZM3 3H11V11H3V3ZM5 5V9H9V5H5ZM13 3H21V11H13V3ZM15 5V9H19V5H15ZM3 13H11V21H3V13ZM5 15V19H9V15H5ZM18 13H21V15H18V13ZM6 6H8V8H6V6ZM6 16H8V18H6V16ZM16 6H18V8H16V6Z"/>
            </svg>
        ),
    },
    {
        id: "scan",
        label: "Scan QR",
        description: "Scan another person's code",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 3H21V8H19V5H15V3ZM9 3V5H5V8H3V3H9ZM15 21V19H19V16H21V21H15ZM9 21H3V16H5V19H9V21ZM3 11H21V13H3V11Z"/>
            </svg>
        ),
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
                            <div className={styles.actionArrow}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M1.99974 12.9999L1.9996 11L15.5858 11V5.58582L22 12L15.5858 18.4142V13L1.99974 12.9999Z"/>
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}