import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useStorage } from "../hooks/useStorage";
import ProfileView from "../components/ProfileView";
import styles from "../styles/pages/Profile.module.scss";
import { 
    isValidPhone, 
    FORM_FIELDS, 
    SAMPLE_DATA, 
    PLACEHOLDER_HEADSHOT, 
    EMPTY_PROFILE, 
    DEV_MODE_OPTIONS 
} from '../constants/constants';

// ══════════════════════════════════════════════════════════════
// ProfilePage Component
// ══════════════════════════════════════════════════════════════
// Main profile page with edit form and view mode

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
    const { name, label, type, placeholder, required, errorMessage, invalidMessage, icon } = field;
    
    // Enhanced validation logic
    let hasError = false;
    let displayMessage = errorMessage;
    
    if (showError && required) {
        if (name === 'phone') {
            if (!value) {
                hasError = true;
                displayMessage = errorMessage;
            } else if (!isValidPhone(value)) {
                hasError = true;
                displayMessage = invalidMessage;
            }
        } else {
            hasError = !value;
        }
    }
    
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
                {hasError && displayMessage && (
                    <div className={styles.errorMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
                        </svg>
                        {displayMessage}
                    </div>
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
            {hasError && displayMessage && (
                <div className={styles.errorMessage}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
                    </svg>
                    {displayMessage}
                </div>
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
                <div className={styles.photoErrors}>
                    <div className={styles.errorMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
                        </svg>
                        <span>Photo files only</span>
                    </div>
                    <div className={styles.errorMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
                        </svg>
                        <span>Must be under 10MB</span>
                    </div>
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
                        <span className={styles.buttonIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)">
                                <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM17.4571 9.45711L16.0429 8.04289L11 13.0858L8.20711 10.2929L6.79289 11.7071L11 15.9142L17.4571 9.45711Z"></path>
                            </svg>
                        </span>
                        SAVED!
                    </span>
                );
            default:
                return <span key="default" className={styles.buttonContent}>SAVE PROFILE</span>;
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
    const [buttonState, setButtonState] = useState('default');
    const [devMode, setDevMode] = useState({
        newUser: false,
        hasInfo: false,
        hasPhoto: false,
        isEditing: false,
        showErrors: false,
        isSaving: false,
        isSaved: false,
    });

    const effectiveButtonState = devMode.isSaving ? 'saving' : devMode.isSaved ? 'saved' : buttonState;

    useEffect(() => {
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

        setEditingProfile(EMPTY_PROFILE);
        setInitialProfile(null);
        setPhotoPreview(null);
        setIsEditing(true);

    }, [profile, devMode.newUser, devMode.hasInfo, devMode.hasPhoto, devMode.isEditing]);

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

    const isFormValid = editingProfile.name && isValidPhone(editingProfile.phone) && editingProfile.instagram && hasChanges;
    
    return (
        <div className={styles.container}>
            <DevModeToggle devMode={devMode} setDevMode={setDevMode} onClear={handleClear} />
            <Header />

            <div className={styles.content}>
                {isEditing ? (
                    <div key="edit" className={styles.editMode}>
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
                    </div>
                ) : (
                    <ProfileView 
                        key="view"
                        profile={editingProfile}
                        onEdit={() => setIsEditing(true)}
                    />
                )}
            </div>
        </div>
    );
}