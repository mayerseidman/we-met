import { useRef } from 'react';
import { isValidPhone } from '../../constants/constants';
import styles from '../../styles/pages/Profile.module.scss';

const FormField = ({ field, value, onChange, showError, onBlur }) => {
    const { name, label, type, placeholder, required, errorMessage, invalidMessage, icon } = field;
    const textareaRef = useRef(null);
    
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

    const handleTextareaInput = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    if (type === 'textarea') {
        return (
            <div className={styles.formGroup}>
                <label>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
                <textarea
                    ref={textareaRef}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onInput={handleTextareaInput}
                    required={required}
                    placeholder={placeholder}
                    className={inputClassName}
                />
                {hasError && displayMessage && (
                    <div className={styles.errorMessage}>                            
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
                    {displayMessage}
                </div>
            )}
        </div>
    );
};

export default FormField;