import QRCode from "react-qr-code";
import styles from "../styles/components/ShowQR.module.scss";
import Avatar from "./Avatar";
import EventDrawer from "./EventDrawer";
import { EVENTS, PLACEHOLDER_HEADSHOT, formatEvent } from "../constants/events";

export default function ShowQR({
    currentProfile,
    hasPhoto,
    qrData,
    selectedEvent,
    isMobile,
    showEventDrawer,
    onSetEditing,
    onEventChange,
    onOpenDrawer,
    onCloseDrawer,
}) {
    const avatarSrc = currentProfile
        ? hasPhoto
            ? currentProfile.photo || PLACEHOLDER_HEADSHOT
            : null
        : null;

    return (
        <div className={styles.showQr}>
            <Avatar src={avatarSrc} />

            <div className={styles.divider} />

            {currentProfile ? (
                <>
                    <h2 className={styles.profileName}>
                        {currentProfile.name || "Alejandro Vizio"}
                    </h2>

                    <h3 className={styles.addMeHeading}>Add Me!</h3>
                    <p className={styles.addMeSubtext}>
                        Let&apos;s be friends 4ever!
                    </p>

                    <div className={styles.qrWrapper}>
                        <QRCode value={qrData} size={220} level="H" />
                    </div>

                    <div className={styles.eventGroup}>
                        <label className={styles.eventLabel}>Event</label>
                        {isMobile ? (
                            <div
                                className={styles.eventTrigger}
                                onClick={onOpenDrawer}
                            >
                                <span>{selectedEvent}</span>
                                <span>▼</span>
                            </div>
                        ) : (
                            <select
                                className={styles.eventSelect}
                                value={selectedEvent}
                                onChange={(e) => onEventChange(e.target.value)}
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
                        )}
                    </div>

                    <p className={styles.infoNote}>
                        <span className={styles.infoNote__icon}>ⓘ</span>
                        They don&apos;t have it? Here&apos;s{" "}
                        <a href="#" className={styles.infoLink}>
                            what to do
                        </a>
                    </p>

                    {showEventDrawer && (
                        <EventDrawer
                            selectedEvent={selectedEvent}
                            onSelect={onEventChange}
                            onClose={onCloseDrawer}
                        />
                    )}
                </>
            ) : (
                <>
                    <h3 className={styles.addMeHeading}>Add Me!</h3>
                    <p className={styles.addProfilePrompt}>
                        Create your profile to get your QR code and connect with
                        people you MEET!
                    </p>
                    <button
                        className={styles.addProfileBtn}
                        onClick={() => onSetEditing(true)}
                    >
                        ADD PROFILE
                    </button>
                </>
            )}
        </div>
    );
}