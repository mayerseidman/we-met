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
        showToast('See you next time! 👋')
        setTimeout(async () => {
            await signOut()
            localStorage.removeItem('we-met-auth')
            router.push('/landing')
        }, 500)
    }
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
                    SIGN OUT
                </button>
            )}
            {user && !authLoading && (
                <button className={styles.signOutBtn} onClick={handleSignOut}>
                    SIGN OUT
                </button>
            )}
            {!user && !authLoading && (
                <button className={styles.signOutBtn} onClick={() => router.push('/auth')}>
                    SIGN IN / CREATE ACCOUNT
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
                        icon="📍" 
                        content={profile.location}
                    />
                    <div className={styles.aboutDivider}></div>
                </>
            )}
            
            <AboutRow 
                icon="💬" 
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
                <ContactRow icon="📞" text={profile.phone} />
            )}
            
            {profile.instagram && (
                <ContactRow icon="📸" text={`@${profile.instagram}`} />
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