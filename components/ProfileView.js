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

            {/* About Section with location integrated */}
            <div className={styles.section}>
                <div className={styles.sectionLabel}>ABOUT</div>
                
                <div className={styles.aboutCard}>
                    {/* Location row */}
                    {profile.location && (
                        <>
                            <div className={styles.aboutRow}>
                                <div className={styles.aboutIcon}>📍</div>
                                <div className={styles.aboutContent}>
                                    <div className={styles.aboutValue}>{profile.location}</div>
                                </div>
                            </div>
                            <div className={styles.aboutDivider}></div>
                        </>
                    )}
                    
                    {/* Bio row */}
                    <div className={styles.aboutRow}>
                        <div className={styles.aboutIcon}>💬</div>
                        <div className={styles.aboutContent}>
                            <div className={styles.aboutText}>
                                {profile.about || "Write something so people can remember you like your favorite color or your cat's name or whatever :)"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            {(profile.phone || profile.instagram) && (
                <div className={styles.section}>
                    <h2 className={styles.sectionLabel}>CONTACT</h2>

                    {profile.phone && (
                        <div className={styles.contactRow}>
                            <div className={styles.contactIcon}>
                                <div className={styles.aboutIcon}>📞</div>
                            </div>
                            <span className={styles.contactText}>{profile.phone}</span>
                        </div>
                    )}

                    {profile.instagram && (
                        <div className={styles.contactRow}>
                            <div className={styles.contactIcon}>
                                <div className={styles.aboutIcon}>📸</div>
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
