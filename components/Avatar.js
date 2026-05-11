import styles from "../styles/components/Avatar.module.scss";


const getInitials = (name) => {
    if (!name || !name.trim()) return '?';
    return name
        .trim()
        .split(/\s+/)
        .map(word => word[0])
        .filter(Boolean)
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export default function Avatar({ src, name, size, className }) {
    if (src) {
        return (
            <img
                src={src}
                alt="Profile"
                className={`${styles.avatar} ${className || ''}`}
                style={size ? { width: size, height: size } : {}}
            />
        );
    }

    const style = size ? { width: size, height: size, fontSize: size * 0.35 } : {};
    return (
        <div className={`${styles.avatarPlaceholder} ${className || ''}`} style={style}>
            <div className={styles.avatarInitials} style={size ? { fontSize: size * 0.45 } : {}}>
                {getInitials(name)}
            </div>
        </div>
    );
}
