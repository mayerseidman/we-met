import styles from "../styles/components/CloseButton.module.scss";

export default function CloseButton({ onClick, ariaLabel = "Close", className = "" }) {
    return (
        <button className={`${styles.closeButton} ${className}`} onClick={onClick} aria-label={ariaLabel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="6" y1="6" x2="18" y2="18"/>
                <line x1="18" y1="6" x2="6" y2="18"/>
            </svg>
        </button>
    );
}