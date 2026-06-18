import { useState, useEffect } from "react";
import styles from "../styles/components/MeetsFilterPanel.module.scss";
import { EVENTS, formatEvent } from "../constants/events";

const TIME_PRESETS = [
    { key: "all", label: "All Time" },
    { key: "thisMonth", label: "This Month" },
    { key: "lastMonth", label: "Last Month" },
    { key: "thisYear", label: "This Year" },
];

export default function MeetsFilterPanel({
    isMobile,
    initialFestival = "all",
    initialTimePeriod = "all",
    resultCount,
    onApply,
    onClose,
}) {
    const [festival, setFestival] = useState(initialFestival);
    const [timePeriod, setTimePeriod] = useState(initialTimePeriod);
    const [closing, setClosing] = useState(false);

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
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Festival</label>
                        <div className={styles.selectWrapper}>
                            <select
                                className={styles.select}
                                value={festival}
                                onChange={(e) => setFestival(e.target.value)}
                            >
                                <option value="all">All Festivals</option>
                                {EVENTS.map((event) => {
                                    const label = formatEvent(event);
                                    return (
                                        <option key={event.name} value={label}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </select>
                            <svg className={styles.selectArrow} width="12" height="8" viewBox="0 0 12 8" fill="none">
                                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Time Period</label>
                        <div className={styles.selectWrapper}>
                            <select
                                className={styles.select}
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(e.target.value)}
                            >
                                {TIME_PRESETS.map((preset) => (
                                    <option key={preset.key} value={preset.key}>
                                        {preset.label}
                                    </option>
                                ))}
                            </select>
                            <svg className={styles.selectArrow} width="12" height="8" viewBox="0 0 12 8" fill="none">
                                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
                    <button className={styles.viewBtn} onClick={handleView}>
                        View {typeof resultCount === "number" ? `(${resultCount})` : ""}
                    </button>
                </div>
            </div>
        </>
    );
}