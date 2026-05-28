import { useState, useRef, useEffect } from "react";
import styles from "../styles/components/EventDrawer.module.scss";
import { EVENTS, formatEvent } from "../constants/events";

export default function EventDrawer({ selectedEvent, onSelect, onClose }) {
    const [closing, setClosing] = useState(false);
    const [search, setSearch] = useState("");
    const searchRef = useRef(null);

    useEffect(() => {
        setTimeout(() => searchRef.current?.focus(), 300);
    }, []);

    const filteredEvents = EVENTS.filter(event =>
        event.name.toLowerCase().includes(search.toLowerCase())
    );

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
                        <img src="/icons/pop/close.svg" alt="" width={20} height={20} />
                    </button>
                </div>

                <div className={styles.searchWrapper}>
                    <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        ref={searchRef}
                        className={styles.searchInput}
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className={styles.searchClear} onClick={() => setSearch("")}>✕</button>
                    )}
                </div>

                <div className={styles.eventList}>
                    {filteredEvents.length === 0 ? (
                        <div className={styles.noResults}>No events found</div>
                    ) : (
                        filteredEvents.map((event) => {
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
                        })
                    )}
                </div>
            </div>
        </>
    );
}