import styles from "../styles/components/StepCard.module.scss";

export default function StepCard({ icon, label, num }) {
    return (
        <div className={styles.stepCard}>
            <img src={`/icons/pop/${icon}.svg`} alt="" width={20} height={20} className={styles.stepIcon} />
            <span className={styles.stepLabel}>{label}</span>
            <span className={styles.stepNum}>{num}</span>
        </div>
    );
}