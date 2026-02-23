import styles from "../styles/components/Avatar.module.scss";

export default function Avatar({ src, name }) {
    // If has photo, show it
    if (src) {
        return <img src={src} alt="Profile" className={styles.avatar} />;
    }
    
    // If no photo but has name, show initials
    if (name) {
        const initials = name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
        
        return (
            <div className={styles.avatarPlaceholder}>
                <div className={styles.avatarInitials}>
                    {initials}
                </div>
            </div>
        );
    }
    
    // Fallback: show placeholder text
    return (
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
