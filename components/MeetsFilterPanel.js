import { useState, useEffect, useRef, useMemo } from "react";
import styles from "../styles/components/MeetsFilterPanel.module.scss";
import { EVENTS, formatEvent } from "../constants/events";

export const TIME_PRESETS = [
    { key: "all", label: "All Time" },
    { key: "thisMonth", label: "This Month" },
    { key: "lastMonth", label: "Last Month" },
    { key: "thisYear", label: "This Year" },
];

const CircleCheck = () => (
    <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
        <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM17.4571 9.45711L16.0429 8.04289L11 13.0858L8.20711 10.2929L6.79289 11.7071L11 15.9142L17.4571 9.45711Z"/>
    </svg>
);

function isInTimePeriod(scannedAt, timePeriod) {
    if (timePeriod === "all" || !scannedAt) return true;
    const date = new Date(scannedAt);
    const now = new Date();
    if (timePeriod === "thisMonth") {
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }
    if (timePeriod === "lastMonth") {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return date.getFullYear() === lastMonth.getFullYear() && date.getMonth() === lastMonth.getMonth();
    }
    if (timePeriod === "thisYear") {
        return date.getFullYear() === now.getFullYear();
    }
    return true;
}

// ── Reusable filter dropdown — matches EventDropdown visual style ──
function FilterSelect({ label, value, options, onChange }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const selected = options.find((o) => o.value === value);

    return (
        <div className={styles.field}>
            <label className={styles.fieldLabel}>{label}</label>
            <div className={styles.dropdownWrapper} ref={wrapperRef}>
                <button
                    type="button"
                    className={`${styles.dropdownTrigger} ${open ? styles.dropdownTriggerOpen : ""}`}
                    onClick={() => setOpen((o) => !o)}
                >
                    <span className={styles.dropdownValue}>{selected?.label}</span>
                    <svg
                        className={`${styles.dropdownArrow} ${open ? styles.dropdownArrowOpen : ""}`}
                        width="12" height="8" viewBox="0 0 12 8" fill="none"
                    >
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>

                {open && (
                    <div className={styles.dropdownMenu}>
                        {options.map((opt) => {
                            const isSelected = opt.value === value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`${styles.dropdownItem} ${isSelected ? styles.dropdownItemSelected : ""}`}
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                >
                                    <span className={styles.dropdownItemLabel}>{opt.label}</span>
                                    {isSelected && <CircleCheck />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MeetsFilterPanel({
    isMobile,
    initialFestival = "all",
    initialTimePeriod = "all",
    connections = [],
    onApply,
    onClose,
}) {
    const [festival, setFestival] = useState(initialFestival);
    const [timePeriod, setTimePeriod] = useState(initialTimePeriod);
    const [closing, setClosing] = useState(false);

    const liveCount = useMemo(() => {
        return connections.filter((c) => {
            if (festival !== "all" && c.event !== festival) return false;
            if (timePeriod !== "all" && !isInTimePeriod(c.scannedAt, timePeriod)) return false;
            return true;
        }).length;
    }, [connections, festival, timePeriod]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 220);
    };

    const handleClear = () => {
        setFestival("all");
        setTimePeriod("all");
    };

    const handleView = () => {
        setClosing(true);
        setTimeout(() => {
            onApply({ festival, timePeriod });
            onClose();
        }, 220);
    };

    const festivalOptions = [
        { value: "all", label: "All Festivals" },
        ...EVENTS.map((event) => {
            const label = formatEvent(event);
            return { value: label, label };
        }),
    ];

    const timeOptions = TIME_PRESETS.map((preset) => ({ value: preset.key, label: preset.label }));

    return (
        <>
            <div
                className={`${styles.backdrop} ${closing ? styles.backdropClosing : ""}`}
                onClick={handleClose}
            />
            <div
                className={`${styles.panel} ${isMobile ? styles.panelMobile : styles.panelDesktop} ${closing ? styles.panelClosing : ""}`}
            >
                <div className={styles.header}>
                    <h3 className={styles.title}>Filters</h3>
                    <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
                        <img src="/icons/pop/close.svg" alt="" width={18} height={18} />
                    </button>
                </div>

                <div className={styles.body}>
                    <FilterSelect
                        label="Festival"
                        value={festival}
                        options={festivalOptions}
                        onChange={setFestival}
                    />
                    <FilterSelect
                        label="Time Period"
                        value={timePeriod}
                        options={timeOptions}
                        onChange={setTimePeriod}
                    />
                </div>

                <div className={styles.footer}>
                    <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
                    <button className={styles.viewBtn} onClick={handleView}>
                        View{' '}
                        {liveCount > 0 && (
                            <span key={liveCount} className={styles.viewBtnCount}>({liveCount})</span>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}