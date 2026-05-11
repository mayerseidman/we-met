import { useState, useRef, useEffect } from "react";
import styles from "../styles/components/EventDropdown.module.scss";
import { EVENTS, formatEvent } from "../constants/events";

// ══════════════════════════════════════════════════════════════
// EventDropdown Component
// ══════════════════════════════════════════════════════════════
// Custom dropdown with retro neobrutalist styling

export default function EventDropdown({ selectedEvent, onEventChange, onOpenDrawer, onDropdownToggle }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const toggleDropdown = () => {
        if (onOpenDrawer) {
            onOpenDrawer();
            return;
        }
        const newState = !isOpen;
        setIsOpen(newState);
        onDropdownToggle?.(newState);  // restore
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
            onDropdownToggle?.(false);  // restore
        }
    };

    const handleSelect = (event) => {
        const label = formatEvent(event);
        onEventChange(label);
        setIsOpen(false);
        onDropdownToggle?.(false);  // restore
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
                    {EVENTS.map((event) => {
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
                    })}
                </div>
            )}
        </div>
    );
}