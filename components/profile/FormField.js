import { useState, useEffect, useRef } from "react";
import { isValidPhone } from '../../constants/constants';
import styles from '../../styles/pages/Profile.module.scss';

const FormField = ({ field, value, onChange, showError, onBlur }) => {
    const { name, label, type, placeholder, required, errorMessage, invalidMessage, icon } = field;
    const textareaRef = useRef(null);
    const ABOUT_MAX = 60;
    
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
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + (el.offsetHeight - el.clientHeight) + 'px';
    };
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + (el.offsetHeight - el.clientHeight) + 'px';
    }, [value]);

    const [bump, setBump] = useState(false);
    const aboutLen = (value || '').length;
    const prevLenRef = useRef(aboutLen);

    useEffect(() => {
        const prev = prevLenRef.current;
        prevLenRef.current = aboutLen;
        if (name === 'about' && aboutLen >= ABOUT_MAX && prev < ABOUT_MAX) {
            setBump(true);
            const t = setTimeout(() => setBump(false), 1500);
            return () => clearTimeout(t);
        }
    }, [aboutLen, name]);

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
                    maxLength={name === 'about' ? ABOUT_MAX : undefined}
                />
                {name === 'about' && (
                    <div className={`${styles.charCount} ${bump ? styles.charCountBump : ''}`}>
                        {aboutLen}/{ABOUT_MAX}
                    </div>
                )}
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
                autoCapitalize={name === 'name' ? 'words' : undefined}
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