import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import ScanQR from "../components/ScanQR";
import ShowQR from "../components/ShowQR";
import DevModeToggle from "../components/profile/DevModeToggle";
import { useStorage } from "../hooks/useStorage";
import styles from "../styles/pages/Connect.module.scss";

// ══════════════════════════════════════════════════════════════
// ConnectPage Component
// ══════════════════════════════════════════════════════════════

const TABS = [
    { 
        id: "scan", 
        label: "Scan QR", 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 3H21V8H19V5H15V3ZM9 3V5H5V8H3V3H9ZM15 21V19H19V16H21V21H15ZM9 21H3V16H5V19H9V21ZM3 11H21V13H3V11Z"></path>
            </svg>
        )
    },
    { 
        id: "show", 
        label: "Show QR", 
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 17V16H13V13H16V15H18V17H17V19H15V21H13V18H15V17H16ZM21 21H17V19H19V17H21V21ZM3 3H11V11H3V3ZM5 5V9H9V5H5ZM13 3H21V11H13V3ZM15 5V9H19V5H15ZM3 13H11V21H3V13ZM5 15V19H9V15H5ZM18 13H21V15H18V13ZM6 6H8V8H6V6ZM6 16H8V18H6V16ZM16 6H18V8H16V6Z"></path>
            </svg>
        )
    },
];

const DEV_PHOTO = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop";

const DEV_DEFAULT = {
    noProfile: false,
    hasPhoto: false,
    noPhoto: false,
    connectBack: false,
    mismatch: false,
};

const DEV_OPTIONS = [
    { key: "noProfile", label: "No Profile" },
    { key: "hasPhoto", label: "Has Photo" },
    { key: "noPhoto", label: "No Photo" },
    { key: "connectBack", label: "Connect Back" },
    { key: "mismatch", label: "Mismatch" },
];

export default function ConnectPage({ onDropdownToggle }) {
    const router = useRouter();
    const { profile, isReady, clearProfile } = useStorage();
    const [activeTab, setActiveTab] = useState("show");
    const [showEventDrawer, setShowEventDrawer] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState("Afrikaburn 2025");
    const [isMobile, setIsMobile] = useState(false);
    const [devMode, setDevMode] = useState(DEV_DEFAULT);

    // ── Dev mode overrides ────────────────────────────────────
    const devProfile = devMode.noProfile ? null : {
        ...profile,
        photo: devMode.hasPhoto ? DEV_PHOTO : profile?.photo,
    };
    const devHasPhoto = devMode.noPhoto ? false : devMode.hasPhoto ? true : !!(profile?.photo);

    // ── Effects ───────────────────────────────────────────────
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const tab = router.query.tab;
        if (tab === 'show' || tab === 'scan') {
            setActiveTab(tab);
        }
    }, [router.query.tab]);

    // ── Handlers ──────────────────────────────────────────────
    const handleDevMode = (key, checked) => {
        setDevMode(prev => ({
            ...prev,
            ...(key === "hasPhoto" && checked ? { noPhoto: false } : {}),
            ...(key === "noPhoto" && checked ? { hasPhoto: false } : {}),
            [key]: checked,
        }));
    };

    const handleSetEditing = useCallback(() => {
        router.push("/profile");
    }, [router]);

    const handleEventChange = useCallback((event) => {
        setSelectedEvent(event);
        setShowEventDrawer(false);
    }, []);

    const handleOpenDrawer = useCallback(() => {
        setShowEventDrawer(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setShowEventDrawer(false);
    }, []);

    // ── Derived data ──────────────────────────────────────────
    const qrData = devProfile
        ? JSON.stringify({
              name: devProfile.name,
              phone: devProfile.phone,
              instagram: devProfile.instagram,
              event: selectedEvent,
          })
        : "";

    // ── Loading state ─────────────────────────────────────────
    if (!isReady) {
        return (
            <div className={styles.page}>
                <Header />
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────
    return (
        <div className={styles.page}>
            <Header />

            {process.env.NODE_ENV === "development" && (
                <DevModeToggle
                    devMode={devMode}
                    setDevMode={(updated) => {
                            const changedKey = Object.keys(updated).find(k => updated[k] !== devMode[k]);
                            handleDevMode(changedKey, updated[changedKey]);
                        }}
                    onClear={() => setDevMode(DEV_DEFAULT)}
                    options={DEV_OPTIONS}
                />
            )}

            <div className={styles.content}>
                <h1 className={styles.pageTitle}>
                    {activeTab === "scan" ? "Scan QR" : "Show QR"}
                </h1>
                {activeTab === "scan" ? (
                    <ScanQR />
                ) : (
                    <ShowQR
                        currentProfile={devProfile}
                        hasPhoto={devHasPhoto}
                        qrData={qrData}
                        selectedEvent={selectedEvent}
                        isMobile={isMobile}
                        showEventDrawer={showEventDrawer}
                        onSetEditing={handleSetEditing}
                        onEventChange={handleEventChange}
                        onDropdownToggle={onDropdownToggle}
                        onOpenDrawer={handleOpenDrawer}
                        onCloseDrawer={handleCloseDrawer}
                        devMode={devMode}
                    />
                )}
            </div>
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────

const TabBar = ({ activeTab, onSelect, tabs }) => (
    <div className={styles.tabBar}>
        <div className={styles.tabBar__inner}>
            {tabs.map((tab) => (
                <Tab
                    key={tab.id}
                    tab={tab}
                    isActive={activeTab === tab.id}
                    onClick={() => onSelect(tab.id)}
                />
            ))}
        </div>
    </div>
);

const Tab = ({ tab, isActive, onClick }) => (
    <button
        className={`${styles.tabButton} ${isActive ? styles["tabButton--active"] : ""}`}
        onClick={onClick}
    >
        {typeof tab.icon === 'string' ? (
            <span>{tab.icon}</span>
        ) : (
            tab.icon
        )}
        {tab.label}
    </button>
);