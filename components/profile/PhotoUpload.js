import styles from '../../styles/pages/Profile.module.scss';

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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
                            Say Cheese 🧀, help people remember you!
                        </p>
                        <button type="button" className={styles.link}>
                            <span className={styles.addPhotoWrapper}>
                                <span className={styles.addIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
                                    </svg>
                                </span>
                                ADD PHOTO
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
                        <span>Photo files only :)</span>
                    </div>
                    <div className={styles.errorMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
                        </svg>
                        <span>Must be under 10MB :)</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoUpload;
