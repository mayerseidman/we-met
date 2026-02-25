import { useState, useRef, useEffect } from "react";
import styles from "../styles/components/EventDropdown.module.scss";
import { EVENTS, formatEvent } from "../constants/events";

// ══════════════════════════════════════════════════════════════
// EventDropdown Component
// ══════════════════════════════════════════════════════════════
// Custom dropdown with retro neobrutalist styling

export default function EventDropdown({ selectedEvent, onEventChange, onDropdownToggle }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        onDropdownToggle?.(newState);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
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
                    width="12" 
                    height="8" 
                    viewBox="0 0 12 8" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M1 1L6 6L11 1" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                    />
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