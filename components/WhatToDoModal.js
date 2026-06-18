import styles from "../styles/components/WhatToDoModal.module.scss";

const STEPS = [
    { num: "01", icon: "📱", title: "Show Your QR", body: "Show them your QR code." },
    { num: "02", icon: "📸", title: "They Capture It", body: "They snap a photo of it." },
    { num: "03", icon: "🤝", title: "They Scan Later", body: "When next online, they scan the photo and connect with you!" },
];

export default function WhatToDoModal({ onDismiss }) {
    return (
        <div className={styles.modalOverlay} onClick={onDismiss}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onDismiss} aria-label="Close">
                    <img src="/icons/pop/close.svg" alt="" width={20} height={20} />
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