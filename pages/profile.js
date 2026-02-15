import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useStorage } from "../hooks/useStorage";
import ProfileView from "../components/ProfileView";
import styles from "../styles/pages/Profile.module.scss";

// ══════════════════════════════════════════════════════════════
// ProfilePage Component
// ══════════════════════════════════════════════════════════════
// Main profile page with edit form and view mode

// ── Constants ─────────────────────────────────────────────────

const DEV_MODE_OPTIONS = [
    { key: 'newUser',   label: 'New User' },
    { key: 'hasInfo',   label: 'Has Info' },
    { key: 'hasPhoto',  label: 'Has Photo' },
    { key: 'isEditing', label: 'Editing' },
    { key: 'showErrors',label: 'Show Errors' },
    { key: 'isSaving',  label: 'Saving State' },
    { key: 'isSaved',   label: 'Saved State' },
];

const SAMPLE_DATA = {
    name: "Big Maestro",
    phone: "+1 114-432-3087",
    instagram: "bigmaestrotimo",
    location: "Columbus, Ohio",
    about: "Write something so people can remember you like your favorite color or your cat's name or whatever :)",
    photo: null,
};

const PLACEHOLDER_HEADSHOT = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop";

const EMPTY_PROFILE = {
    name: "",
    phone: "",
    instagram: "",
    location: "",
    about: "",
    photo: null,
};

const FORM_FIELDS = [
    {
        name: 'name',
        label: 'NAME',
        type: 'text',
        placeholder: 'What can we call you?',
        required: true,
        errorMessage: 'Name is required',
    },
    {
        name: 'phone',
        label: 'PHONE',
        type: 'tel',
        placeholder: 'What are your digits?',
        required: true,
        errorMessage: 'Enter a valid phone number: +1 (123) 456-7890',
    },
    {
        name: 'instagram',
        label: 'INSTAGRAM',
        type: 'text',
        placeholder: "What's your handle?",
        required: true,
        errorMessage: 'Phone number or Instagram are required',
    },
    {
        name: 'location',
        label: 'LOCATION',
        type: 'text',
        placeholder: 'Where do you live?',
        required: false,
    },
    {
        name: 'about',
        label: 'ABOUT',
        type: 'textarea',
        placeholder: "Write something so people can remember you like your favorite color or your cat's name or whatever :)",
        required: false,
    },
];

// ── Sub-Components ────────────────────────────────────────────

const DevModeToggle = ({ devMode, setDevMode, onClear }) => (
    <div className={styles.devMode}>
        <div className={styles.devModeTitle}>DEV MODE</div>
        {DEV_MODE_OPTIONS.map(({ key, label }) => (
            <label key={key}>
                <input 
                    type="checkbox" 
                    checked={devMode[key]} 
                    onChange={(e) => setDevMode({...devMode, [key]: e.target.checked})} 
                />
                {" "}{label}
            </label>
        ))}
        <button onClick={onClear} className={styles.devClearBtn}>
            Clear Profile
        </button>
    </div>
);

const FormField = ({ field, value, onChange, showError }) => {
    const { name, label, type, placeholder, required, errorMessage, icon } = field;
    const hasError = showError && required && !value;
    const inputClassName = hasError ? styles.error : '';

    if (type === 'textarea') {
        return (
            <div className={styles.formGroup}>
                <label>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    className={inputClassName}
                />
                {hasError && errorMessage && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}
            </div>
        );
    }

    if (icon) {
        return (
            <div className={styles.formGroup}>
                <label>{label}</label>
                <div className={styles.locationWrapper}>
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={inputClassName}
                    />
                    <span className={styles.locationIcon}>{icon}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formGroup}>
            <label>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={inputClassName}
            />
            {hasError && errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
            )}
        </div>
    );
};

const PhotoUpload = ({ photoPreview, onPhotoChange, onRemovePhoto, showError }) => {
    const hasError = showError && !photoPreview;

    return (
        <div className={styles.formGroup}>
            <label>PHOTO</label>
            <div
                onClick={() => document.getElementById("photoInput").click()}
                className={`${styles.photoUpload} ${hasError ? styles.error : ''}`}
            >
                {photoPreview ? (
                    <>
                        <img 
                            src={photoPreview} 
                            alt="Preview" 
                            className={styles.photoPreview}
                        />
                        <div className={styles.photoButtons}>
                            <button 
                                type="button" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById("photoInput").click();
                                }}
                            >
                                Change
                            </button>
                            <hr className={styles.divider} />
                            <button 
                                type="button" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemovePhoto();
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className={styles.photoPlaceholder}>
                            Say Cheeeese, help people remember you!
                        </p>
                        <button type="button" className={styles.link}>
                            <span className={styles.addPhotoWrapper}>
                                <span className={styles.addIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
                                    </svg>
                                </span>
                                Add Photo
                            </span>
                        </button>
                    </>
                )}
                <input 
                    type="file" 
                    id="photoInput" 
                    accept="image/*" 
                    onChange={onPhotoChange}
                />
            </div>
            {hasError && (
                <div className={styles.errorMessage}>
                    ⚠ Unsupported file type - choose a photo file<br/>
                    ⚠ File too large - choose a file under 10MB
                </div>
            )}
        </div>
    );
};

const SubmitButton = ({ buttonState, isFormValid }) => {
    const getButtonClass = () => {
        const classes = [styles.button];
        if (buttonState === 'saving') classes.push(styles.saving);
        if (buttonState === 'saved') classes.push(styles.saved);
        return classes.join(' ');
    };

    const getButtonContent = () => {
        switch (buttonState) {
            case 'saving':
                return (
                    <span key="saving" className={styles.buttonContent}>
                        SAVING
                        <span className={styles.dotsContainer}>
                            <span className={styles.dot}>.</span>
                            <span className={styles.dot}>.</span>
                            <span className={styles.dot}>.</span>
                        </span>
                    </span>
                );
            case 'saved':
                return (
                    <span className={styles.buttonContent}>
                        <span className={styles.buttonIcon}>✓</span>
                        SAVED!
                    </span>
                );
            default:
                return <span className={styles.buttonContent}>SAVE PROFILE</span>;
        }
    };
    
    return (
        <button
            type="submit"
            disabled={buttonState !== 'default' || !isFormValid}
            className={getButtonClass()}
        >
            {getButtonContent()}
        </button>
    );
};

// ── Main Component ────────────────────────────────────────────

export default function ProfilePage() {
    const { isReady, profile, saveProfile } = useStorage();
    const [editingProfile, setEditingProfile] = useState(EMPTY_PROFILE);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [initialProfile, setInitialProfile] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [buttonState, setButtonState] = useState('default'); // 'default' | 'saving' | 'saved'
    const [devMode, setDevMode] = useState({
        newUser: false,
        hasInfo: false,
        hasPhoto: false,
        isEditing: false,
        showErrors: false,
        isSaving: false,
        isSaved: false,
    });

    // Override button state with dev mode if active
    const effectiveButtonState = devMode.isSaving ? 'saving' : devMode.isSaved ? 'saved' : buttonState;

    useEffect(() => {
        // ── DEV: New User ──────────────────────────────────────────
        if (devMode.newUser) {
            const data = devMode.hasInfo
                ? { ...SAMPLE_DATA, photo: devMode.hasPhoto ? PLACEHOLDER_HEADSHOT : null }
                : { ...EMPTY_PROFILE };
            setEditingProfile(data);
            setInitialProfile(null);
            setPhotoPreview(devMode.hasInfo && devMode.hasPhoto ? PLACEHOLDER_HEADSHOT : null);
            setIsEditing(true);
            return;
        }

        // ── DEV: Returning User ────────────────────────────────────
        if (!devMode.newUser && (devMode.hasInfo || devMode.hasPhoto || devMode.isEditing)) {
            const data = {
                ...SAMPLE_DATA,
                photo: devMode.hasPhoto ? PLACEHOLDER_HEADSHOT : null,
            };
            setEditingProfile(data);
            setInitialProfile(data);
            setPhotoPreview(devMode.hasPhoto ? PLACEHOLDER_HEADSHOT : null);
            setIsEditing(devMode.isEditing);
            return;
        }

        // ── REAL: Existing profile ─────────────────────────────────
        if (profile) {
            const profileData = {
                name: profile.name || "",
                phone: profile.phone || "",
                instagram: profile.instagram || "",
                location: profile.location || "",
                about: profile.about || "",
                photo: profile.photo || null,
            };
            setEditingProfile(profileData);
            setInitialProfile(profileData);
            setPhotoPreview(profile.photo || null);
            setIsEditing(false);
            return;
        }

        // ── REAL: New user, no profile ─────────────────────────────
        setEditingProfile(EMPTY_PROFILE);
        setInitialProfile(null);
        setPhotoPreview(null);
        setIsEditing(true);

    }, [profile, devMode.newUser, devMode.hasInfo, devMode.hasPhoto, devMode.isEditing]);

    // Detect changes
    useEffect(() => {
        if (!initialProfile) {
            setHasChanges(!!(editingProfile.name && editingProfile.phone && editingProfile.instagram));
        } else {
            setHasChanges(JSON.stringify(editingProfile) !== JSON.stringify(initialProfile));
        }
    }, [editingProfile, initialProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingProfile(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setEditingProfile(prev => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        setEditingProfile(prev => ({ ...prev, photo: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Saving:', JSON.stringify(editingProfile));

        setButtonState('saving');

        try {
            const success = await saveProfile(editingProfile);
            
            if (success) {
                setButtonState('saved');
                setInitialProfile(editingProfile);
                
                // Return to default after 2 seconds
                setTimeout(() => {
                    setButtonState('default');
                    setIsEditing(false);
                }, 2000);
            } else {
                alert("Failed to save profile. Please try again.");
                setButtonState('default');
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
            setButtonState('default');
        }
    };

    const handleClear = () => {
        localStorage.clear();
        setEditingProfile(EMPTY_PROFILE);
        setInitialProfile(null);
        setPhotoPreview(null);
        setIsEditing(true);
        setButtonState('default');
        setDevMode({ 
            newUser: false, 
            hasInfo: false, 
            hasPhoto: false, 
            isEditing: false, 
            showErrors: false,
            isSaving: false,
            isSaved: false,
        });
    };

    const isFormValid = editingProfile.name && editingProfile.phone && editingProfile.instagram && hasChanges;

    return (
        <div className={styles.container}>
            <DevModeToggle devMode={devMode} setDevMode={setDevMode} onClear={handleClear} />
            <Header />

            <div className={styles.content}>
                {isEditing ? (
                    <>
                        <h1 className={styles.headerTitle}>Profile</h1>
                        <p className={styles.headerSubtitle}>
                            Set up your profile so others can find you after the magic fades
                        </p>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            {FORM_FIELDS.map(field => (
                                <FormField
                                    key={field.name}
                                    field={field}
                                    value={editingProfile[field.name]}
                                    onChange={handleChange}
                                    showError={devMode.showErrors}
                                />
                            ))}
                            <PhotoUpload
                                photoPreview={photoPreview}
                                onPhotoChange={handlePhotoChange}
                                onRemovePhoto={handleRemovePhoto}
                                showError={devMode.showErrors}
                            />
                            <SubmitButton 
                                buttonState={effectiveButtonState}
                                isFormValid={isFormValid} 
                            />
                        </form>
                    </>
                ) : (
                    <ProfileView 
                        profile={editingProfile}
                        onEdit={() => setIsEditing(true)}
                    />
                )}
            </div>
        </div>
    );
}