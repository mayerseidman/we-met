import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Header from "../components/Header";
import ProfileView from "../components/ProfileView";
import DevModeToggle from "../components/profile/DevModeToggle";
import FormField from "../components/profile/FormField";
import PhotoUpload from "../components/profile/PhotoUpload";
import SubmitButton from "../components/profile/SubmitButton";
import { useStorage } from "../hooks/useStorage";
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
       const handleProfileViewRequest = () => {
           if (profile && !devMode.isEditing) {
               setIsEditing(false);
           }
       };
       
       window.addEventListener('profileViewRequest', handleProfileViewRequest);
       return () => window.removeEventListener('profileViewRequest', handleProfileViewRequest);
    }, [profile, devMode.isEditing]);


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
            <DevModeToggle 
                devMode={devMode} 
                setDevMode={setDevMode} 
                onClear={handleClear}
                options={DEV_MODE_OPTIONS}
            />
            <Header />

            <div className={styles.content}>
                {isEditing ? (
                    <div key="edit" className={styles.editMode}>
                        <h1 className={styles.headerTitle}>{initialProfile ? "Edit Profile" : "Add Profile"}</h1>
                        {!initialProfile && (
                            <p className={styles.headerSubtitle}>
                                Set up your profile so others can find you after the magic fades
                            </p>
                        )}
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
