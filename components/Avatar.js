import styles from "../styles/components/Avatar.module.scss";

export default function Avatar({ src }) {
    return src ? (
        <img src={src} alt="Profile" className={styles.avatar} />
    ) : (
        <div className={styles.avatarPlaceholder}>
            <div className={styles.avatarPlaceholder__text}>
                Photo
                <br />
                will go
                <br />
                here
            </div>
        </div>
    );
}