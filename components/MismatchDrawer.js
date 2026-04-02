import { useState } from "react";
import styles from "../styles/components/MismatchDrawer.module.scss";
import { EVENTS, formatEvent } from "../constants/events";
import EventDropdown from "./EventDropdown";

export default function MismatchDrawer({ 
    scannerName, 
    scannedEvent, 
    selectedEvent,
    onSelect, 
    onClose,
    isModal = false,
}) {
    const [localEvent, setLocalEvent] = useState(selectedEvent);

    return (
        <>
            <div className={styles.backdrop} onClick={onClose} />
            <div className={isModal ? styles.modal : styles.drawer}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Choose Event</h3>
                    <button className={styles.closeButton} onClick={onClose}>✕</button>
                </div>
                <div className={styles.body}>
                    <p className={styles.description}>
                        <strong>{scannerName}</strong> added you for{" "}
                        <strong>{scannedEvent}</strong>, but your current event is set to{" "}
                        <strong>{selectedEvent}</strong>.
                    </p>
                    <p className={styles.subLabel}>Save Them In:</p>

                    {isModal ? (
                        <select
                            className={styles.eventSelect}
                            value={localEvent}
                            onChange={(e) => setLocalEvent(e.target.value)}
                        >
                            {EVENTS.map((event) => {
                                const label = formatEvent(event);
                                return (
                                    <option key={event.name} value={label}>
                                        {label}
                                    </option>
                                );
                            })}
                        </select>
                    ) : (
                        <div className={styles.eventList}>
                            {/* existing drawer list */}
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button className={styles.cancelBtn} onClick={onClose}>CANCEL</button>
                        <button className={styles.confirmBtn} onClick={() => onSelect(localEvent)}>ADD THEM</button>
                    </div>
                </div>
            </div>
        </>
    );
}