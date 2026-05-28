import { useState } from "react";
import styles from "../styles/components/MismatchDrawer.module.scss";
import { EVENTS, formatEvent } from "../constants/events";

export default function MismatchDrawer({
    scannerName,
    scannedEvent,
    selectedEvent,
    onSelect,
    onClose,
    isModal = false,
}) {
    const [localEvent, setLocalEvent] = useState(selectedEvent);
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 280);
    };

    const handleSelect = (label) => {
        setLocalEvent(label);
        setClosing(true);
        setTimeout(() => {
            onSelect(label);
            onClose();
        }, 280);
    };

    if (isModal) {
        return (
            <div className={styles.modalOverlay} onClick={handleClose}>
                <div className={styles.modal} onClick={e => e.stopPropagation()}>
                    <button className={styles.closeButton} onClick={handleClose} aria-label="Close"><img src="/icons/pop/close.svg" alt="" width={20} height={20} /></button>
                    <p className={styles.description}>
                        You scanned <strong>{scannerName}</strong> at{" "}
                        <strong>{scannedEvent}</strong>, but your current event is set to{" "}
                        <strong>{selectedEvent}</strong>. Which event should they be saved under?
                    </p>
                    <p className={styles.subLabel}>Save Them In:</p>
                    <div className={styles.eventList}>
                        {EVENTS.map((event) => {
                            const label = formatEvent(event);
                            return (
                                <button
                                    key={event.name}
                                    className={`${styles.eventItem} ${localEvent === label ? styles.selected : ''}`}
                                    onClick={() => handleSelect(label)}
                                >
                                    <span className={styles.eventName}>{label}</span>
                                    {localEvent === label && <span className={styles.checkmark}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`} onClick={handleClose} />
            <div className={`${styles.drawer} ${closing ? styles.drawerClosing : ''}`}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Choose Event</h3>
                    <button className={styles.closeButton} onClick={handleClose} aria-label="Close"><img src="/icons/pop/close.svg" alt="" width={20} height={20} /></button>
                </div>
                <div className={styles.body}>
                    <p className={styles.description}>
                        You scanned <strong>{scannerName}</strong> at{" "}
                        <strong>{scannedEvent}</strong>, but your current event is set to{" "}
                        <strong>{selectedEvent}</strong>. Which event should they be saved under?
                    </p>
                    <p className={styles.subLabel}>Save Them In:</p>
                    <div className={styles.eventList}>
                        {EVENTS.map((event) => {
                            const label = formatEvent(event);
                            return (
                                <button
                                    key={event.name}
                                    className={`${styles.eventItem} ${localEvent === label ? styles.selected : ''}`}
                                    onClick={() => handleSelect(label)}
                                >
                                    <span className={styles.eventName}>{label}</span>
                                    {localEvent === label && <span className={styles.checkmark}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}