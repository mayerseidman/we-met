import CloseButton from "../components/CloseButton";
import styles from "../styles/components/WhatToDoModal.module.scss";

const POP = '/icons/pop';
const STEPS = [
    { num: "01", icon: "flash", title: "Show Your QR", body: "Show them your QR code." },
    { num: "02", icon: "camera", title: "They Capture It", body: "They snap a photo of it." },
    { num: "03", icon: "shield-check", title: "They Scan Later", body: "When next online, they'll scan your QR on We Met and connect!" },
];

export default function WhatToDoModal({ onDismiss }) {
    return (
        <div className={styles.modalOverlay} onClick={onDismiss}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onDismiss} className={styles.closeButtonPosition} />
                <h3 className={styles.modalTitle}>No We Met, No Problem!</h3>
                <div className={styles.wtdSteps}>
                    {STEPS.map((step) => (
                        <div key={step.num} className={styles.wtdStep}>
                            <span className={styles.wtdNum}>{step.num}</span>
                            <span className={styles.wtdIcon}>
                                <img src={`${POP}/${step.icon}.svg`} alt="" width={28} height={28} />
                            </span>
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