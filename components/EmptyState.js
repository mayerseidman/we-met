import styles from "../styles/components/ShowQR.module.scss";

export default function EmptyState({ onSetEditing }) {
    return (
        <div className={styles.emptyState}>
            <div className={styles.qrCard}>
                {/*<div className={styles.qrPlaceholder}>
                    <img src="/qr.png" className={styles.qrImage} alt="QR placeholder" />
                </div>*/}
                <div className={styles.brandPlaceholder}>
                    <img src="/icons/pop/waving-hand.svg" alt="" width={72} height={72} />
                </div>
            </div>
            <p className={styles.emptyText}>
                Add your profile to connect with people you MEET!
            </p>
            <button className={styles.addProfileBtn} onClick={() => onSetEditing(true)}>
                ADD PROFILE
            </button>
        </div>
    );
}