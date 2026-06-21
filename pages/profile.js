import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';

import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

import Header from "../components/Header";
import ProfileView from "../components/ProfileView";
import DevModeToggle from "../components/profile/DevModeToggle";
import FormField from "../components/profile/FormField";
import PhotoUpload from "../components/profile/PhotoUpload";
import SubmitButton from "../components/profile/SubmitButton";
import { useStorage } from "../hooks/useStorage";
import { saveUserProfile, uploadAvatar } from '../lib/db'

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
//
// NOTE: user/authLoading come from props (set by _app.js), not from
// calling useAuth() again here. _app.js already computes the live,
// correct auth state once — calling useAuth() a second time created
// a second independent session-read, which could drift out of sync
// with the first (especially right after sign-in/sign-out, where
// timing matters). Always consume the prop, never re-derive it.

export default function ProfilePage({ user, authLoading }) {
    const { isReady, profile, saveProfile } = useStorage();
    const [editingProfile, setEditingProfile] = useState(EMPTY_PROFILE);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [initialProfile, setInitialProfile] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [buttonState, setButtonState] = useState('default');
    const [showErrors, setShowErrors] = useState(false)
    const [devMode, setDevMode] = useState({
        newUser: false,
        hasInfo: false,
        hasPhoto: false,
        isEditing: false,
        showErrors: false,
        isSaving: false,
        isSaved: false,
    });

    const isSavingRef = useRef(false)
    const { toastMessage, toastVisible, showToast, hideToast } = useToast()
    const [touched, setTouched] = useState({});

    const handleBlur = (field) => {
      setTouched(prev => ({ ...prev, [field]: true }));
    };

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
        if (isSavingRef.current) return

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
            if (!isSavingRef.current) setIsEditing(false);  // ← add this back but guarded
            return;
        }

        setEditingProfile(EMPTY_PROFILE);
        setInitialProfile(null);
        setPhotoPreview(null);
        setIsEditing(true);

    }, [profile, devMode.newUser, devMode.hasInfo, devMode.hasPhoto, devMode.isEditing]);

    useEffect(() => {
        if (!initialProfile) {
            setHasChanges(!!(editingProfile.name && editingProfile.phone));
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
       e.preventDefault()
       if (!isFormValid) {
           setShowErrors(true)
           return
       }
       isSavingRef.current = true
       setButtonState('saving')
       const saveStart = Date.now()

       try {
           const success = await saveProfile(editingProfile)
           console.log('save result:', success)
           
           if (success) {
               if (user) {
                   let profileToSave = { ...editingProfile }
                   console.log('photo value:', editingProfile.photo?.substring(0, 50))
                   if (editingProfile.photo && editingProfile.photo.startsWith('data:')) {
                       console.log('uploading photo...')
                       const { url, error: uploadError } = await uploadAvatar(user.id, editingProfile.photo)
                       console.log('upload result:', url, uploadError)
                       if (url) {
                           profileToSave.photo = url
                       }
                   } else {
                       console.log('no base64 photo — skipping upload')
                   }
                   const { success: cloudSuccess, error } = await saveUserProfile(user.id, profileToSave)
                   console.log('cloud save result:', cloudSuccess, error)
               }

                const wasNewProfile = !initialProfile
                const elapsed = Date.now() - saveStart
                const remaining = Math.max(0, 800 - elapsed)
                setTimeout(() => {
                    setButtonState('saved')
                    setInitialProfile(editingProfile)
                    setShowErrors(false)

                    setTimeout(() => {
                        if (wasNewProfile) showToast('Profile created! 🎉')
                        else showToast('Profile updated! ✨')
                    }, 600)

                    setTimeout(() => {
                        setButtonState('default')
                        isSavingRef.current = false
                    }, 4000)
                }, remaining)
            } else {
               alert("Failed to save profile. Please try again.")
               setButtonState('default')
               isSavingRef.current = false
            }
        } catch (error) {
           console.error("Error saving profile:", error)
           alert("Failed to save profile. Please try again.")
           setButtonState('default')
           isSavingRef.current = false
        }
    }

    const handleClear = () => {
        localStorage.clear();
        setEditingProfile(EMPTY_PROFILE);
        setInitialProfile(null);
        setPhotoPreview(null);
        setIsEditing(true);
        setButtonState('default');
        isSavingRef.current = false
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
    const isFormValid = editingProfile.name && isValidPhone(editingProfile.phone) && hasChanges;
    
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
                       {/* <div className={styles.appIcon} aria-label="We Met">
                            <img src="/icons/pop/waving-hand-light.svg" alt="" width={56} height={56} />
                        </div>*/}
                        <h1 className={styles.headerTitle}>Profile</h1>
                        {!initialProfile && (
                            <p className={styles.headerSubtitle}>
                                Set up your profile so the people you meet today can find you tomorrow :)
                            </p>
                        )}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            {FORM_FIELDS.map(field => (
                               <FormField
                                   key={field.name}
                                   field={field}
                                   value={editingProfile[field.name]}
                                   onChange={handleChange}
                                   onBlur={() => handleBlur(field.name)}
                                   showError={(devMode.showErrors || showErrors) || touched[field.name]}
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
                        user={user}
                        authLoading={authLoading}
                    />
                )}
            </div>
            <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} />
        </div>
    );
}