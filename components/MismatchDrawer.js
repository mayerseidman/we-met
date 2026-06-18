import { useState, useRef, useEffect } from "react";
import styles from "../styles/components/MismatchDrawer.module.scss";
import { EVENTS, formatEvent } from "../constants/events";

const CircleCheck = () => (
    <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
        <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM17.4571 9.45711L16.0429 8.04289L11 13.0858L8.20711 10.2929L6.79289 11.7071L11 15.9142L17.4571 9.45711Z"/>
    </svg>
);

const SearchBar = ({ search, setSearch, searchRef }) => (
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
);

const Description = ({ scannerName, scannedEvent, selectedEvent, styles }) => (
    <div className={styles.descriptionBlock}>
        <p className={styles.description}>
            You scanned <strong className={styles.highlight}>{scannerName}</strong> at{" "}
            <strong className={styles.highlight}>{scannedEvent}</strong>, but your current event is set to{" "}
            <strong className={styles.highlight}>{selectedEvent}</strong>.
        </p>
        <p className={styles.descriptionQuestion}>Where should they be saved?</p>
    </div>
);

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
    const [search, setSearch] = useState("");
    const searchRef = useRef(null);

    useEffect(() => {
        setTimeout(() => searchRef.current?.focus(), 300);
    }, []);

    useEffect(() => {
        setLocalEvent(selectedEvent);
    }, [selectedEvent]);

    const filteredEvents = EVENTS.filter(event =>
        event.name.toLowerCase().includes(search.toLowerCase())
    );

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

    const ModalEventList = () => (
        <div className={styles.eventContainer}>
            <SearchBar search={search} setSearch={setSearch} searchRef={searchRef} />
            <div className={styles.eventList}>
                {filteredEvents.length === 0 ? (
                    <div className={styles.noResults}>No events found</div>
                ) : (
                    filteredEvents.map((event) => {
                        const label = formatEvent(event);
                        return (
                            <button
                                key={event.name}
                                className={`${styles.eventItem} ${localEvent === label ? styles.selected : ''}`}
                                onClick={() => handleSelect(label)}
                            >
                                <span className={styles.eventName}>{label}</span>
                                {localEvent === label && <CircleCheck />}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );

    const DrawerEventList = () => (
        <div className={styles.drawerEventSection}>
            <SearchBar search={search} setSearch={setSearch} searchRef={searchRef} />
            <div className={styles.drawerEventList}>
                {filteredEvents.length === 0 ? (
                    <div className={styles.noResults}>No events found</div>
                ) : (
                    filteredEvents.map((event) => {
                        const label = formatEvent(event);
                        return (
                            <button
                                key={event.name}
                                className={`${styles.drawerEventItem} ${localEvent === label ? styles.drawerSelected : ''}`}
                                onClick={() => handleSelect(label)}
                            >
                                <span className={styles.eventName}>{label}</span>
                                {localEvent === label && <CircleCheck />}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );

    if (isModal) {
        return (
            <div className={styles.modalOverlay} onClick={handleClose}>
                <div className={styles.modal} onClick={e => e.stopPropagation()}>
                    <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
                        <img src="/icons/pop/close.svg" alt="" width={20} height={20} style={{ filter: 'brightness(0) opacity(0.5)' }} />
                    </button>
                    <h3 className={styles.modalTitle}>Wrong Event?</h3>
                    <Description scannerName={scannerName} scannedEvent={scannedEvent} selectedEvent={selectedEvent} styles={styles} />
                    <ModalEventList />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`${styles.backdrop} ${closing ? styles.backdropClosing : ''}`} onClick={handleClose} />
            <div className={`${styles.drawer} ${closing ? styles.drawerClosing : ''}`}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Wrong Event?</h3>
                    <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
                        <img src="/icons/pop/close.svg" alt="" width={20} height={20} />
                    </button>
                </div>
                <Description scannerName={scannerName} scannedEvent={scannedEvent} selectedEvent={selectedEvent} styles={styles} />
                <DrawerEventList />
            </div>
        </>
    );
}