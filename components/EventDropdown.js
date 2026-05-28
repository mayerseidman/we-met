import { useState, useRef, useEffect } from "react";
import styles from "../styles/components/EventDropdown.module.scss";
import { EVENTS, formatEvent } from "../constants/events";

// ══════════════════════════════════════════════════════════════
// EventDropdown Component
// ══════════════════════════════════════════════════════════════
// Custom dropdown with search filtering and neobrutalist styling

export default function EventDropdown({ selectedEvent, onEventChange, onOpenDrawer, onDropdownToggle }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    const filteredEvents = EVENTS.filter(event =>
        event.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleDropdown = () => {
        if (onOpenDrawer) {
            onOpenDrawer();
            return;
        }
        const newState = !isOpen;
        setIsOpen(newState);
        onDropdownToggle?.(newState);
        if (!newState) setSearch("");
    };

    useEffect(() => {
        if (isOpen && searchRef.current) {
            setTimeout(() => searchRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearch("");
                onDropdownToggle?.(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onDropdownToggle]);

    const handleSelect = (event) => {
        const label = formatEvent(event);
        onEventChange(label);
        setIsOpen(false);
        setSearch("");
        onDropdownToggle?.(false);
    };

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <button
                className={styles.trigger}
                onClick={toggleDropdown}
                aria-expanded={isOpen}
            >
                <span>{selectedEvent}</span>
                <svg
                    className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M2 2 L14 2 L8 12 Z" />
                </svg>
            </button>
            {isOpen && (
                <div className={styles.menu}>
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
                            onClick={(e) => e.stopPropagation()}
                        />
                        {search && (
                            <button className={styles.searchClear} onClick={() => setSearch("")}>✕</button>
                        )}
                    </div>
                    <div className={styles.menuList}>
                        {filteredEvents.length === 0 ? (
                            <div className={styles.noResults}>No events found</div>
                        ) : (
                            filteredEvents.map((event) => {
                                const label = formatEvent(event);
                                const isSelected = label === selectedEvent;
                                return (
                                    <button
                                        key={event.name}
                                        className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                                        onClick={() => handleSelect(event)}
                                    >
                                        {label}
                                        {isSelected && (
                                            <span className={styles.checkmark}>✓</span>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}