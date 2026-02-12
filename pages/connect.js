// pages/connect.js
import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/Header";
import { useStorage } from "../hooks/useStorage";
import styles from "../styles/pages/Connect.module.scss";
import ShowQR from "../components/ShowQR";
import ScanQR from "../components/ScanQR";

// ==================
// CONSTANTS
// ==================
const TABS = [
    { id: "scan", label: "Scan QR", icon: "🔍" },
    { id: "show", label: "Show QR", icon: "📱" },
];

const PROFILE_FIELDS = [
    {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "What can we call you?",
        required: true,
    },
    {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "What are your digits?",
        required: true,
    },
    {
        name: "instagram",
        label: "Instagram",
        type: "text",
        placeholder: "What's your handle?",
        required: true,
    },
    {
        name: "location",
        label: "Location",
        type: "text",
        placeholder: "Where do you live?",
        required: false,
        icon: "📍",
    },
];

const DEV_TOGGLES = [
    { key: "hasProfile", label: "Has Profile" },
    { key: "hasPhoto", label: "Has Photo" },
    { key: "showConnectModal", label: "Connect Modal" },
    { key: "showMismatchModal", label: "Mismatch Modal" },
];

// ==================
// COMPONENTS
// ==================

// ─── DevPanel ────────────────────────────────────────────────
const DevPanel = ({ devMode, onToggle }) => (
    <div className={styles.devPanel}>
        <div className={styles.devPanel__title}>DEV MODE</div>
        {DEV_TOGGLES.map(({ key, label }) => (
            <label key={key} className={styles.devToggle}>
                <input
                    type="checkbox"
                    checked={devMode[key]}
                    onChange={(e) => onToggle(key, e.target.checked)}
                />
                {label}
            </label>
        ))}
    </div>
);

// ─── TabBar ──────────────────────────────────────────────────
const TabBar = ({ activeTab, onSelect }) => (
    <div className={styles.tabBar}>
        <div className={styles.tabBar__inner}>
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    className={`${styles.tabButton} ${
                        activeTab === tab.id ? styles["tabButton--active"] : ""
                    }`}
                    onClick={() => onSelect(tab.id)}
                >
                    <span>{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </div>
    </div>
);

// ─── FormField ───────────────────────────────────────────────
const FormField = ({ field, value, onChange }) => {
    const inputProps = {
        type: field.type,
        name: field.name,
        value,
        onChange,
        required: field.required,
        placeholder: field.placeholder,
        className: styles.input,
    };

    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                {field.label}
                {field.required && (
                    <span className={styles.requiredStar}>*</span>
                )}
            </label>

            {field.icon ? (
                <div className={styles.inputWrapper}>
                    <input {...inputProps} />
                    <span className={styles.inputWrapper__icon}>
                        {field.icon}
                    </span>
                </div>
            ) : (
                <input {...inputProps} />
            )}
        </div>
    );
};

// ─── PhotoUploader ───────────────────────────────────────────
const PhotoUploader = ({ preview, onChange }) => {
    const fileRef = useRef(null);

    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>Photo</label>
            <div
                className={styles.photoUploader}
                onClick={() => fileRef.current?.click()}
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className={styles.photoUploader__preview}
                        />
                        <p className={styles.photoUploader__changeText}>
                            Click to change photo
                        </p>
                    </>
                ) : (
                    <>
                        <p className={styles.photoUploader__emptyHint}>
                            Say Cheeeese, help people remember!
                        </p>
                        <button
                            type="button"
                            className={styles.photoUploader__addBtn}
                        >
                            Add Photo
                        </button>
                    </>
                )}
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                    className={styles.photoUploader__fileInput}
                />
            </div>
        </div>
    );
};

// ─── ProfileForm ─────────────────────────────────────────────
const ProfileForm = ({
    editingProfile,
    photoPreview,
    hasExistingProfile,
    onChange,
    onPhotoChange,
    onSubmit,
    onCancel,
}) => (
    <div>
        <h1 className={styles.form__heading}>Profile</h1>
        <p className={styles.form__description}>
            Set up your profile so others can find you after the magic fades
        </p>

        <form onSubmit={onSubmit} className={styles.form}>
            {PROFILE_FIELDS.map((field) => (
                <FormField
                    key={field.name}
                    field={field}
                    value={editingProfile[field.name]}
                    onChange={onChange}
                />
            ))}

            <div className={styles.formGroup}>
                <label className={styles.label}>About You</label>
                <textarea
                    name="about"
                    value={editingProfile.about}
                    onChange={onChange}
                    placeholder="Write something so people can remember you like your favorite color or your cat's name or whatever :)"
                    className={styles.textarea}
                />
            </div>

            <PhotoUploader preview={photoPreview} onChange={onPhotoChange} />

            <button type="submit" className={styles.submitBtn}>
                SAVE PROFILE
            </button>

            {hasExistingProfile && (
                <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={onCancel}
                >
                    Cancel
                </button>
            )}
        </form>
    </div>
);

// ==================
// MAIN PAGE
// ==================
export default function ConnectPage() {
    const { isReady, profile, saveProfile } = useStorage();

    const [editingProfile, setEditingProfile] = useState({
        name: "",
        phone: "",
        instagram: "",
        location: "",
        about: "",
        photo: null,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [activeTab, setActiveTab] = useState("show");
    const [showEventDrawer, setShowEventDrawer] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState("Afrikaburn 2025");
    const [isMobile, setIsMobile] = useState(false);

    const [devMode, setDevMode] = useState({
        hasProfile: false,
        hasPhoto: false,
        showConnectModal: false,
        showMismatchModal: false,
    });

    // ── sync form when storage profile loads ─────────────────
    useEffect(() => {
        if (profile) {
            setEditingProfile({
                name: profile.name || "",
                phone: profile.phone || "",
                instagram: profile.instagram || "",
                location: profile.location || "",
                about: profile.about || "",
                photo: profile.photo || null,
            });
            setPhotoPreview(profile.photo || null);
        }
        setIsEditing(false);
    }, [profile]);

    // ── responsive mobile flag ───────────────────────────────
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // ── handlers ─────────────────────────────────────────────
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setEditingProfile((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handlePhotoChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
            setEditingProfile((prev) => ({ ...prev, photo: reader.result }));
        };
        reader.readAsDataURL(file);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await saveProfile(editingProfile);
            if (success) {
                setIsEditing(false);
            } else {
                alert("Failed to save profile. Please try again.");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        }
    };

    const handleDevToggle = useCallback((key, checked) => {
        setDevMode((prev) => ({ ...prev, [key]: checked }));
    }, []);

    // ── derived ──────────────────────────────────────────────
    const currentProfile = devMode.hasProfile
        ? profile || editingProfile
        : null;

    const qrData = JSON.stringify({
        name: currentProfile?.name || "",
        phone: currentProfile?.phone || "",
        instagram: currentProfile?.instagram || "",
        location: currentProfile?.location || "",
        about: currentProfile?.about || "",
    });

    // ── loading ──────────────────────────────────────────────
    if (!isReady) {
        return (
            <div className={styles.page}>
                <Header />
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    // ── render ───────────────────────────────────────────────
    return (
        <div className={styles.page}>
            <DevPanel devMode={devMode} onToggle={handleDevToggle} />
            <Header />

            {!isEditing && (
                <TabBar activeTab={activeTab} onSelect={setActiveTab} />
            )}

            <div className={styles.content}>
                {isEditing ? (
                    <ProfileForm
                        editingProfile={editingProfile}
                        photoPreview={photoPreview}
                        hasExistingProfile={!!profile}
                        onChange={handleChange}
                        onPhotoChange={handlePhotoChange}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : activeTab === "show" ? (
                    <ShowQR
                        currentProfile={currentProfile}
                        hasPhoto={devMode.hasPhoto}
                        qrData={qrData}
                        selectedEvent={selectedEvent}
                        isMobile={isMobile}
                        showEventDrawer={showEventDrawer}
                        onSetEditing={setIsEditing}
                        onEventChange={setSelectedEvent}
                        onOpenDrawer={() => setShowEventDrawer(true)}
                        onCloseDrawer={() => setShowEventDrawer(false)}
                    />
                ) : (
                    <ScanQR />
                )}
            </div>
        </div>
    );
}