import { signOut } from '../lib/auth'
import { useRouter } from 'next/router'
import Avatar from './Avatar'

import Toast from './Toast'
import { useToast } from '../hooks/useToast'


import styles from "../styles/components/ProfileView.module.scss";

// ══════════════════════════════════════════════════════════════
// ProfileView Component
// ══════════════════════════════════════════════════════════════
// Displays user profile with photo, name, about info, and contact details

const ProfileView = ({ profile, onEdit, user, authLoading }) => {
    const router = useRouter()
    const { toastMessage, toastVisible, showToast, hideToast } = useToast()

    const handleSignOut = async () => {
        showToast('👋 See you next time!')
        setTimeout(async () => {
            const { error } = await signOut()
            if (error) {
                console.error('Sign out failed:', error)
                // Still proceed — local state should reflect signed-out even if
                // the Supabase call had an issue, so the user isn't stuck.
            }
            localStorage.removeItem('we-met-auth')
            router.push(profile ? '/meets' : '/')
        }, 500)
    }

    // Pass mode=signin explicitly — was previously just '/auth' with no
    // mode, which was landing people on the sign-up tab by default.
    const handleSignInClick = () => router.push('/auth?mode=signin')

    return (
        <div className={styles.profileView}>
            <ProfilePhoto profile={profile} />
            <ProfileName name={profile.name} />
            <AboutSection profile={profile} />
            <ContactSection profile={profile} />
            <EditButton onEdit={onEdit} />
            {/* Only show sign out if user is logged in */}
            {user && !authLoading && (
                <button className={styles.signOutBtn} onClick={handleSignOut}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="9 17 4 12 9 7"/><line x1="4" y1="12" x2="15" y2="12"/></svg>
                    Sign Out
                </button>
            )}
            {!user && !authLoading && (
                <button className={styles.signInLink} onClick={handleSignInClick}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    Sign In
                </button>
            )}
            <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} />
        </div>
    );
};

// ── Sub-components ────────────────────────────────────────────

const ProfilePhoto = ({ profile }) => (
    <div className={styles.photoSection}>
        <Avatar 
            src={profile.photo} 
            name={profile.name}
            size={145}
            className={styles.profileAvatar}
        />
    </div>
);

const ProfileName = ({ name }) => (
    <h1 className={styles.name}>{name}</h1>
);

const AboutSection = ({ profile }) => (
    <div className={styles.section}>
        <div className={styles.sectionLabel}>ABOUT</div>
        
        <div className={styles.aboutCard}>
            {profile.location && (
                <>
                    <AboutRow
                        icon={<img src="/icons/pop/location-pin.svg" alt="" width={22} height={22} />}
                        content={profile.location}
                    />
                    <div className={styles.aboutDivider}></div>
                </>
            )}

            <AboutRow
                icon={<img src="/icons/pop/chat-bubble.svg" alt="" width={22} height={22} />}
                content={profile.about || "Write something so people can remember you like your favorite color or your cat's name or whatever :)"}
                isText
            />
        </div>
    </div>
);

const AboutRow = ({ icon, content, isText }) => (
    <div className={styles.aboutRow}>
        <div className={styles.aboutIcon}>{icon}</div>
        <div className={styles.aboutContent}>
            {isText ? (
                <div className={styles.aboutText}>{content}</div>
            ) : (
                <div className={styles.aboutValue}>{content}</div>
            )}
        </div>
    </div>
);

const ContactSection = ({ profile }) => {
    const hasContact = profile.phone || profile.instagram;
    
    if (!hasContact) return null;
    
    return (
        <div className={styles.section}>
            <h2 className={styles.sectionLabel}>CONTACT</h2>
            
            {profile.phone && (
                <ContactRow icon={<img src="/icons/pop/smartphone.svg" alt="" width={22} height={22} />} text={profile.phone} />
            )}
            
            {profile.instagram && (
                <ContactRow icon={<img src="/icons/pop/image.svg" alt="" width={22} height={22} />} text={`@${profile.instagram}`} />
            )}
        </div>
    );
};

const ContactRow = ({ icon, text }) => (
    <div className={styles.contactRow}>
        <div className={styles.contactIcon}>
            <div className={styles.aboutIcon}>{icon}</div>
        </div>
        <span className={styles.contactText}>{text}</span>
    </div>
);

const EditButton = ({ onEdit }) => (
    <button className={styles.editButton} onClick={onEdit}>
        EDIT PROFILE
    </button>
);

// ── Helper functions ──────────────────────────────────────────

const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
};

export default ProfileView;