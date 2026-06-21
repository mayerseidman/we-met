import { useState } from "react";
import QRCode from "react-qr-code";
import styles from "../styles/components/ShowQR.module.scss";
import Avatar from "./Avatar";
import EventDrawer from "./EventDrawer";
import EventDropdown from "./EventDropdown";
import EmptyState from "./EmptyState";
import WhatToDoModal from "./WhatToDoModal";
import { EVENTS, formatEvent } from "../constants/events";

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
    onDismiss,
}) {
    const [showWhatToDo, setShowWhatToDo] = useState(false);

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
                    onOpenDrawer={isMobile ? onOpenDrawer : undefined}
                />
            </div>

            <InfoNote onWhatToDo={() => setShowWhatToDo(true)} />
            
            {showEventDrawer && (
                <EventDrawer
                    selectedEvent={selectedEvent}
                    onSelect={onEventChange}
                    onClose={onCloseDrawer}
                    onOpenDrawer={onOpenDrawer}
                />
            )}

            {devMode.connectBack && (
                <ConnectBackModal
                    profile={currentProfile}
                    onDismiss={onDismiss}
                />
            )}

            {showWhatToDo && (
                <WhatToDoModal onDismiss={() => setShowWhatToDo(false)} />
            )}
        </div>
    );
}

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

const InfoNote = ({ onWhatToDo }) => (
    <p className={styles.infoNote}>
        {"They don't have it?"}{" "}
        <button className={styles.infoLink} onClick={onWhatToDo}>
            What to Do
        </button>
    </p>
);

const ConnectBackModal = ({ profile, onDismiss }) => (
    <div className={styles.modalOverlay}>
        <div className={styles.modal}>
            <button className={styles.modalClose} onClick={onDismiss} aria-label="Close">
                <img src="/icons/pop/close.svg" alt="" width={20} height={20} />
            </button>
            <div className={styles.modalEmoji}>
                <img src="/icons/pop/waving-hand.svg" alt="" width={65} height={65} />
            </div>
            <h3 className={styles.modalTitle}>Connect Back?</h3>
            <p className={styles.modalText}>
                <strong>{profile.name}</strong> scanned your QR code. Want to add them back?
            </p>
            <button className={styles.modalBtn}>Add Them Back</button>
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
                <button className={styles.modalCancelBtn} onClick={onDismiss}>Cancel</button>
                <button className={styles.modalBtn}>Add Them</button>
            </div>
        </div>
    </div>
);