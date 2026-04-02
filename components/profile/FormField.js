import { isValidPhone } from '../../constants/constants';
import styles from '../../styles/pages/Profile.module.scss';

const FormField = ({ field, value, onChange, showError, onBlur }) => {
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
                onBlur={onBlur}
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

export default FormField;
