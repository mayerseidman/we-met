import styles from "../styles/components/EventDrawer.module.scss";
import { EVENTS, formatEvent } from "../constants/events";

export default function EventDrawer({ selectedEvent, onSelect, onClose }) {
    return (
        <>
            {/* Backdrop */}
            <div className={styles.backdrop} onClick={onClose} />
            
            {/* Drawer */}
            <div className={styles.drawer}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Select Event</h3>
                    <button 
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className={styles.eventList}>
                    {EVENTS.map((event) => {
                        const label = formatEvent(event);
                        const isSelected = selectedEvent === label;
                        
                        return (
                            <button
                                key={event.name}
                                className={`${styles.eventItem} ${isSelected ? styles.selected : ''}`}
                                onClick={() => {
                                    onSelect(label);
                                    onClose();
                                }}
                            >
                                <span className={styles.eventName}>{label}</span>
                                {isSelected && (
                                    <span className={styles.checkmark}>✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
