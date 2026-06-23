import { useState, useRef, useEffect } from "react";
import CloseButton from "../components/CloseButton";
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
        setTimeout(onClose, 220);
    };

    const handleSelect = (label) => {
        setClosing(true);
        setTimeout(() => {
            onSelect(label);
            onClose();
        }, 220);
    };

    return (
        <>
            <div className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`} onClick={handleClose} />
            <div className={`${styles.drawer} ${closing ? styles.drawerClosing : ''}`}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Select Event</h3>
                    <CloseButton onClick={handleClose} className={styles.closeButtonPosition} />
                </div>

                <div className={styles.searchWrapper}>
                    <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        ref={searchRef}
                        className={styles.searchInput}
                        type="text"
                        placeholder="Search..."
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
                                        <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM17.4571 9.45711L16.0429 8.04289L11 13.0858L8.20711 10.2929L6.79289 11.7071L11 15.9142L17.4571 9.45711Z"/>
                                        </svg>
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