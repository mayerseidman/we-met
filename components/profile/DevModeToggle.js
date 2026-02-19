import styles from '../../styles/pages/Profile.module.scss';

const DevModeToggle = ({ devMode, setDevMode, onClear, options }) => (
    <div className={styles.devMode}>
        <div className={styles.devModeTitle}>DEV MODE</div>
        {options.map(({ key, label }) => (
            <label key={key}>
                <input 
                    type="checkbox" 
                    checked={devMode[key]} 
                    onChange={(e) => setDevMode({...devMode, [key]: e.target.checked})} 
                />
                {" "}{label}
            </label>
        ))}
        <button onClick={onClear} className={styles.devClearBtn}>
            Clear Profile
        </button>
    </div>
);

export default DevModeToggle;
