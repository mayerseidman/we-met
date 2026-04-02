import styles from "../styles/components/Avatar.module.scss";


export default function Avatar({ src, name, size }) {
    const style = size ? { width: size, height: size, fontSize: size * 0.35 } : {};

    if (src) {
        return (
            <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Profile" className={styles.avatar} style={size ? { width: size, height: size } : {}} />
            </>
        )
    }

    if (name) {
        const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
        return (
            <div className={styles.avatarPlaceholder} style={style}>
                <div className={styles.avatarInitials} style={size ? { fontSize: size * 0.45 } : {}}>
                    {initials}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.avatarPlaceholder} style={style}>
            <div className={styles.avatarPlaceholder__text}>Photo<br />will go<br />here</div>
        </div>
    );
}
