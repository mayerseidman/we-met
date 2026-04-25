import { useState } from "react";
import styles from "../styles/components/EventDrawer.module.scss";
import { EVENTS, formatEvent } from "../constants/events";

export default function EventDrawer({ selectedEvent, onSelect, onClose }) {
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 280);
    };

    const handleSelect = (label) => {
        setClosing(true);
        setTimeout(() => {
            onSelect(label);
            onClose();
        }, 280);
    };

    return (
        <>
            <div className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`} onClick={handleClose} />
            <div className={`${styles.drawer} ${closing ? styles.drawerClosing : ''}`}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Select Event</h3>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
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
                                onClick={() => handleSelect(label)}
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