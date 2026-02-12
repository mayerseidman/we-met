import styles from "../styles/components/ProfileView.module.scss";

const ProfileView = ({ profile, onEdit }) => {
    return (
        <div className={styles.profileView}>

            {/* Photo */}
            <div className={styles.photoSection}>
                {profile.photo ? (
                    <img 
                        src={profile.photo} 
                        alt={profile.name}
                        className={styles.photo}
                    />
                ) : (
                    <div className={styles.photoPlaceholder}>
                        {profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                    </div>
                )}
            </div>

            {/* Name */}
            <h1 className={styles.name}>{profile.name}</h1>

            {/* Location Pill */}
            {profile.location && (
                <div className={styles.locationPill}>
                    <span className={styles.locationIcon}>📍</span>
                    <span className={styles.locationText}>{profile.location}</span>
                </div>
            )}

            {/* About Section */}
            {profile.about && (
                <div className={styles.section}>
                    <h2 className={styles.sectionLabel}>ABOUT</h2>
                    <p className={styles.aboutText}>{profile.about}</p>
                </div>
            )}

            {/* Contact Section */}
            {(profile.phone || profile.instagram) && (
                <div className={styles.section}>
                    <h2 className={styles.sectionLabel}>CONTACT</h2>

                    {profile.phone && (
                        <div className={styles.contactRow}>
                            <div className={styles.contactIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9.366 10.682a10.556 10.556 0 0 0 3.952 3.952l.884-1.238a1 1 0 0 1 1.294-.296 11.422 11.422 0 0 0 4.583 1.364 1 1 0 0 1 .921.997v4.462a1 1 0 0 1-.898.995c-.53.055-1.064.082-1.602.082C9.94 21 3 14.06 3 5.5c0-.538.027-1.072.082-1.602A1 1 0 0 1 4.077 3h4.462a1 1 0 0 1 .997.921A11.422 11.422 0 0 0 10.9 8.504a1 1 0 0 1-.296 1.294l-1.238.884zm-2.522-.657l1.9-1.357A13.41 13.41 0 0 1 7.647 5H5.01c-.006.166-.009.333-.009.5C5 12.956 11.044 19 18.5 19c.167 0 .334-.003.5-.01v-2.637a13.41 13.41 0 0 1-3.668-1.097l-1.357 1.9a12.442 12.442 0 0 1-1.588-.75l-.058-.033a12.556 12.556 0 0 1-4.702-4.702l-.033-.058a12.442 12.442 0 0 1-.75-1.588z"></path>
                                </svg>
                            </div>
                            <span className={styles.contactText}>{profile.phone}</span>
                        </div>
                    )}

                    {profile.instagram && (
                        <div className={styles.contactRow}>
                            <div className={styles.contactIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path>
                                </svg>
                            </div>
                            <span className={styles.contactText}>@{profile.instagram}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Button */}
            <button className={styles.editButton} onClick={onEdit}>
                EDIT PROFILE
            </button>
        </div>
    );
};

export default ProfileView;
