import styles from "../styles/components/WhatToDoModal.module.scss";

const STEPS = [
    { num: "01", icon: "📱", title: "Show Your QR", body: "Show them your QR code." },
    { num: "02", icon: "📸", title: "They Capture It", body: "They snap a photo of it." },
    { num: "03", icon: "🤝", title: "They Scan Later", body: "When next online, they'll scan your QR on We Met and connect!" },
];

export default function WhatToDoModal({ onDismiss }) {
    return (
        <div className={styles.modalOverlay} onClick={onDismiss}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onDismiss} aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="6" y1="6" x2="18" y2="18"/>
                        <line x1="18" y1="6" x2="6" y2="18"/>
                    </svg>
                </button>
                <h3 className={styles.modalTitle}>No We Met, No Problem!</h3>
                <div className={styles.wtdSteps}>
                    {STEPS.map((step) => (
                        <div key={step.num} className={styles.wtdStep}>
                            <span className={styles.wtdNum}>{step.num}</span>
                            <span className={styles.wtdIcon}>{step.icon}</span>
                            <div className={styles.wtdText}>
                                <strong className={styles.wtdTitle}>{step.title}</strong>
                                <p className={styles.wtdBody}>{step.body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}