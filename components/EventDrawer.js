import styles from "../styles/components/EventDrawer.module.scss";
import { EVENTS, formatEvent } from "../constants/events";

export default function EventDrawer({ selectedEvent, onSelect, onClose }) {
    return (
        <>
            <div className={styles.drawerOverlay} onClick={onClose} />
            <div className={styles.drawer}>
                <div className={styles.drawer__handle} />
                <div className={styles.drawer__header}>
                    <h3>Select Event</h3>
                </div>
                {EVENTS.map((event) => {
                    const label = formatEvent(event);
                    const active = selectedEvent === label;
                    return (
                        <div
                            key={event.name}
                            className={`${styles.drawerOption} ${
                                active ? styles["drawerOption--active"] : ""
                            }`}
                            onClick={() => {
                                onSelect(label);
                                onClose();
                            }}
                        >
                            <span>{label}</span>
                            {active && (
                                <span className={styles.drawerOption__check}>
                                    ✓
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}