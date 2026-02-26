import QRCode from "react-qr-code";
import styles from "../styles/components/ShowQR.module.scss";
import Avatar from "./Avatar";
import EventDrawer from "./EventDrawer";
import EventDropdown from "./EventDropdown";
import { EVENTS, formatEvent } from "../constants/events";

// ══════════════════════════════════════════════════════════════
// ShowQR Component
// ══════════════════════════════════════════════════════════════
// Displays user QR code with event selector or empty state

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
}) {
    // Empty state
    if (!currentProfile) {
        return <EmptyState onSetEditing={onSetEditing} />;
    }

    // Profile with QR
    return (
        <div className={styles.showQr}>
            <div className={styles.qrCardContainer}>
                <AvatarSection profile={currentProfile} hasPhoto={hasPhoto} />
                <QRCard profile={currentProfile} qrData={qrData} />
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
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────

const EmptyState = ({ onSetEditing }) => (
    <div className={styles.emptyState}>
        <div className={styles.photoPlaceholder}>
            <span>📷</span>
        </div>

        <h3 className={styles.emptyHeading}>Add Me!</h3>
        <p className={styles.emptyText}>
            Create your profile to get your QR code and connect with people you MEET!
        </p>

        <button className={styles.addProfileBtn} onClick={() => onSetEditing(true)}>
            ADD PROFILE
        </button>
    </div>
);

const AvatarSection = ({ profile, hasPhoto }) => {
    const avatarSrc = hasPhoto ? profile.photo : null;
    
    return (
        <div className={styles.avatarWrapper}>
            <Avatar src={avatarSrc} name={profile.name} />
        </div>
    );
};

const QRCard = ({ profile, qrData }) => (
    <div className={styles.qrCardContainer}>
        <div className={styles.qrCard}>
            <h2 className={styles.name}>{profile.name}</h2>        
            <div className={styles.qrWrapper}>
                <QRCode
                    value={qrData}
                    size={220}
                    level="H"
                    style={{ display: "block", margin: 0, padding: 0 }}
                />
            </div>
        </div>
    </div>
);

const InfoNote = () => (
    <p className={styles.infoNote}>
        <span className={styles.infoIcon}>ⓘ</span>
        {"They don't have it?"}
        <a href="#" className={styles.infoLink}>
            What to Do
        </a>
    </p>
);
