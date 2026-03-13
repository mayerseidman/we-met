import QRCode from "react-qr-code";
import styles from "../styles/components/ShowQR.module.scss";
import Avatar from "./Avatar";
import EventDrawer from "./EventDrawer";
import EventDropdown from "./EventDropdown";
import { EVENTS, formatEvent } from "../constants/events";

// ══════════════════════════════════════════════════════════════
// ShowQR Component
// ══════════════════════════════════════════════════════════════

export default function ShowQR({
    currentProfile,
    hasPhoto,
    qrData,
    selectedEvent,
    isMobile,
    showEventDrawer,
    onSetEditing,
    onEventChange,
    onDropdownToggle,
    onOpenDrawer,
    onCloseDrawer,
    devMode = {},
}) {
    // Empty state
    if (!currentProfile) {
        return <EmptyState onSetEditing={onSetEditing} />;
    }

    return (
        <div className={styles.showQr}>
            <div className={styles.qrCardContainer}>
                <QRCard 
                    profile={currentProfile} 
                    qrData={qrData}
                    hasPhoto={hasPhoto}
                    fgColor="#F5722F" 
                    bgColor="#FFFFFF" 
                />
            </div>
            
            <div className={styles.eventSection}>
                <label className={styles.eventLabel}>Event</label>
                <EventDropdown 
                    selectedEvent={selectedEvent}
                    onEventChange={onEventChange}
                    onDropdownToggle={onDropdownToggle}
                />
            </div>
            <InfoNote />
            
            {showEventDrawer && (
                <EventDrawer
                    selectedEvent={selectedEvent}
                    onSelect={onEventChange}
                    onClose={onCloseDrawer}
                />
            )}

            {/* Dev mode overlays */}
            {devMode.connectBack && (
                <ConnectBackModal
                    profile={currentProfile}
                    onDismiss={() => {}}
                />
            )}

            {devMode.mismatch && (
                <MismatchModal
                    profile={currentProfile}
                    selectedEvent={selectedEvent}
                    onDismiss={() => {}}
                />
            )}
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────

const EmptyState = ({ onSetEditing }) => (
    <div className={styles.emptyState}>
        <div className={styles.qrCard}>
            <div className={styles.qrPlaceholder}>
                <img src="/qr.png" className={styles.qrImage} alt="QR placeholder" />
            </div>
        </div>
        <p className={styles.emptyText}>
            Create a profile to get your QR code and connect with people you MEET!
        </p>
        <button className={styles.addProfileBtn} onClick={() => onSetEditing(true)}>
            ADD PROFILE
        </button>
    </div>
);

const QRCard = ({ profile, hasPhoto, qrData, fgColor, bgColor }) => {
    const avatarSrc = hasPhoto ? profile.photo : null; 
    
    return (
        <div className={styles.qrCardContainer}>
            <div className={styles.qrCard}>
                <div className={styles.qrWrapper}>
                    <QRCode value={qrData} size={220} level="H" />
                    <div className={styles.qrAvatar}>
                        <Avatar src={avatarSrc} name={profile.name} size={60} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoNote = () => (
    <p className={styles.infoNote}>
        <span className={styles.infoIcon}>ⓘ</span>
        {"They don't have it?"}{" "}
        <a href="#" className={styles.infoLink}>
            What to Do
        </a>
    </p>
);

const ConnectBackModal = ({ profile, onDismiss }) => (
    <div className={styles.modalOverlay}>
        <div className={styles.modal}>
            <button className={styles.modalClose} onClick={onDismiss}>✕</button>
            <div className={styles.modalEmoji}>👋</div>
            <h3 className={styles.modalTitle}>Connect Back?</h3>
            <p className={styles.modalText}>
                <strong>{profile.name}</strong> scanned your QR code.
            </p>
            <button className={styles.modalBtn}>ADD THEM</button>
        </div>
    </div>
);

const MismatchModal = ({ profile, selectedEvent, onDismiss }) => (
    <div className={styles.modalOverlay}>
        <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Choose Event</h3>
            <p className={styles.modalText}>
                <strong>{profile.name}</strong> added you for <strong>Afrikaburn</strong>, but your current event is set to <strong>{selectedEvent}</strong>.
            </p>
            <p className={styles.modalSubLabel}>Save Them In:</p>
            <div className={styles.eventList}>
                <div className={`${styles.eventOption} ${styles["eventOption--selected"]}`}>
                    {selectedEvent} (120) <span>✓</span>
                </div>
                <div className={styles.eventOption}>Boom (0)</div>
                <div className={styles.eventOption}>General (12)</div>
            </div>
            <div className={styles.modalActions}>
                <button className={styles.modalCancelBtn} onClick={onDismiss}>CANCEL</button>
                <button className={styles.modalBtn}>ADD THEM</button>
            </div>
        </div>
    </div>
);