import { signOut } from '../lib/auth'
import { useRouter } from 'next/router'
import Avatar from './Avatar'
import Toast from './Toast'
import { useToast } from '../hooks/useToast'
import styles from "../styles/components/ProfileView.module.scss";

// ══════════════════════════════════════════════════════════════
// ProfileView Component
// ══════════════════════════════════════════════════════════════

const ProfileView = ({ profile, onEdit, user, authLoading }) => {
    const router = useRouter()
    const { toastMessage, toastVisible, showToast, hideToast } = useToast()

    const handleSignOut = async () => {
        showToast('👋 See you next time!')
        setTimeout(async () => {
            const { error } = await signOut()
            if (error) {
                console.error('Sign out failed:', error)
            }
            localStorage.removeItem('we-met-auth')
            router.push('/profile')
        }, 500)
    }

    const handleSignInClick = () => router.push('/auth?mode=signin&redirect=/profile')

    return (
        <div className={styles.profileView}>
            <ProfilePhoto profile={profile} />
            <ProfileName name={profile.name} />
            <AboutSection profile={profile} />
            <ContactSection profile={profile} />
            <EditButton onEdit={onEdit} />
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

// ── Icons ─────────────────────────────────────────────────────

const IconPin = () => (
    <img src="/icons/pop/location-pin.svg" alt="" width={22} height={22} />
);

const IconChat = () => (
    <img src="/icons/pop/chat-bubble.svg" alt="" width={22} height={22} />
);

const IconPhone = () => (
    <img src="/icons/pop/smartphone.svg" alt="" width={22} height={22} />
);

const IconInstagram = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={22} height={22} style={{ color: '#18088c' }}>
        <path d="M13.0281 2.00073C14.1535 2.00259 14.7238 2.00855 15.2166 2.02322L15.4107 2.02956C15.6349 2.03753 15.8561 2.04753 16.1228 2.06003C17.1869 2.1092 17.9128 2.27753 18.5503 2.52503C19.2094 2.7792 19.7661 3.12253 20.3219 3.67837C20.8769 4.2342 21.2203 4.79253 21.4753 5.45003C21.7219 6.0867 21.8903 6.81337 21.9403 7.87753C21.9522 8.1442 21.9618 8.3654 21.9697 8.58964L21.976 8.78373C21.9906 9.27647 21.9973 9.84686 21.9994 10.9723L22.0002 11.7179C22.0003 11.809 22.0003 11.903 22.0003 12L22.0002 12.2821L21.9996 13.0278C21.9977 14.1532 21.9918 14.7236 21.9771 15.2163L21.9707 15.4104C21.9628 15.6347 21.9528 15.8559 21.9403 16.1225C21.8911 17.1867 21.7219 17.9125 21.4753 18.55C21.2211 19.2092 20.8769 19.7659 20.3219 20.3217C19.7661 20.8767 19.2069 21.22 18.5503 21.475C17.9128 21.7217 17.1869 21.89 16.1228 21.94C15.8561 21.9519 15.6349 21.9616 15.4107 21.9694L15.2166 21.9757C14.7238 21.9904 14.1535 21.997 13.0281 21.9992L12.2824 22C12.1913 22 12.0973 22 12.0003 22L11.7182 22L10.9725 21.9993C9.8471 21.9975 9.27672 21.9915 8.78397 21.9768L8.58989 21.9705C8.36564 21.9625 8.14444 21.9525 7.87778 21.94C6.81361 21.8909 6.08861 21.7217 5.45028 21.475C4.79194 21.2209 4.23444 20.8767 3.67861 20.3217C3.12278 19.7658 2.78028 19.2067 2.52528 18.55C2.27778 17.9125 2.11028 17.1867 2.06028 16.1225C2.0484 15.8559 2.03871 15.6347 2.03086 15.4104L2.02457 15.2163C2.00994 14.7236 2.00327 14.1532 2.00111 13.0278L2.00098 10.9723C2.00284 9.84686 2.00879 9.27647 2.02346 8.78373L2.02981 8.58964C2.03778 8.3654 2.04778 8.1442 2.06028 7.87753C2.10944 6.81253 2.27778 6.08753 2.52528 5.45003C2.77944 4.7917 3.12278 4.2342 3.67861 3.67837C4.23444 3.12253 4.79278 2.78003 5.45028 2.52503C6.08778 2.27753 6.81278 2.11003 7.87778 2.06003C8.14444 2.04816 8.36564 2.03847 8.58989 2.03062L8.78397 2.02433C9.27672 2.00969 9.8471 2.00302 10.9725 2.00086L13.0281 2.00073ZM12.0003 7.00003C9.23738 7.00003 7.00028 9.23956 7.00028 12C7.00028 14.7629 9.23981 17 12.0003 17C14.7632 17 17.0003 14.7605 17.0003 12C17.0003 9.23713 14.7607 7.00003 12.0003 7.00003ZM12.0003 9.00003C13.6572 9.00003 15.0003 10.3427 15.0003 12C15.0003 13.6569 13.6576 15 12.0003 15C10.3434 15 9.00028 13.6574 9.00028 12C9.00028 10.3431 10.3429 9.00003 12.0003 9.00003ZM17.2503 5.50003C16.561 5.50003 16.0003 6.05994 16.0003 6.74918C16.0003 7.43843 16.5602 7.9992 17.2503 7.9992C17.9395 7.9992 18.5003 7.4393 18.5003 6.74918C18.5003 6.05994 17.9386 5.49917 17.2503 5.50003Z"/>
    </svg>
);
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
                    <AboutRow icon={<IconPin />} content={profile.location} />
                    <div className={styles.aboutDivider}></div>
                </>
            )}
            <AboutRow
                icon={<IconChat />}
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
                <ContactRow icon={<IconPhone />} text={profile.phone} />
            )}
            {profile.instagram && (
                <ContactRow icon={<IconInstagram />} text={`@${profile.instagram}`} />
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

export default ProfileView;