import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useStorage } from "../hooks/useStorage";
import { useAuth } from '../hooks/useAuth'

import Header from "../components/Header";
import ScanQR from "../components/ScanQR";
import ShowQR from "../components/ShowQR";
import DevModeToggle from "../components/profile/DevModeToggle";


import styles from "../styles/pages/Connect.module.scss";

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
};

const DEV_OPTIONS = [
    { key: "noProfile", label: "No Profile" },
    { key: "hasPhoto", label: "Has Photo" },
    { key: "noPhoto", label: "No Photo" },
    { key: "connectBack", label: "Connect Back" },
];

const SCAN_DEV_OPTIONS = [
    { key: "noProfile", label: "No Profile" },
    { key: "mismatch", label: "Mismatch" },
    { key: "scanSuccess", label: "Scan Success" },
    { key: "scanError", label: "Scan Error" },
    { key: "alreadyConnected", label: "Already Connected" },
    { key: "whatToDo", label: "What To Do" },
];

const SCAN_DEV_DEFAULT = {
    noProfile: false,
    mismatch: false,
    scanSuccess: false,
    scanError: false,
    alreadyConnected: false,
    whatToDo: false,
};

export default function ConnectPage({ onDropdownToggle, user }) {
    const router = useRouter();
    const { profile, isReady } = useStorage();
    const [showEventDrawer, setShowEventDrawer] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState("Afrikaburn 2025");
    const [isMobile, setIsMobile] = useState(false);
    const [devMode, setDevMode] = useState(DEV_DEFAULT);
    const [scanDevMode, setScanDevMode] = useState(SCAN_DEV_DEFAULT);
    const [mounted, setMounted] = useState(false);

    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('tab') === 'scan' ? 'scan' : 'show';
        }
        return 'show';
    });

    const devProfile = devMode.noProfile ? null : {
        ...profile,
        photo: devMode.hasPhoto ? DEV_PHOTO : profile?.photo,
    };
    const devHasPhoto = devMode.noPhoto ? false : devMode.hasPhoto ? true : !!(profile?.photo);

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

    useEffect(() => {
        setMounted(true);
    }, []);

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

   const qrData = devProfile
       ? JSON.stringify({
             name: devProfile.name,
             phone: devProfile.phone,
             instagram: devProfile.instagram,
             about: devProfile.about,
             // photo: devProfile.photo || null,
             event: selectedEvent,
             v: 2,
             userId: user?.id || null,  // ← add this
         })
       : "";

    console.log('qrData:', qrData)  // add this
    console.log('user:', user, 'qrData:', qrData)

    if (!mounted || !isReady) {
        const isScan = typeof window !== 'undefined' && 
            new URLSearchParams(window.location.search).get('tab') === 'scan';
        return (
            <div className={`${styles.page} ${isScan ? styles['page--scan'] : ''}`}>
                {!isScan && <Header />}
            </div>
        );
    }

    return (
        <div
            key={activeTab}
            className={`${styles.page} ${activeTab === 'scan' ? styles['page--scan'] : ''}`}
        >
            {activeTab !== 'scan' && <Header />}

            {process.env.NODE_ENV === "development" && activeTab === "show" && (
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

            {process.env.NODE_ENV === "development" && activeTab === "scan" && (
                <DevModeToggle
                    devMode={scanDevMode}
                    setDevMode={(updated) => {
                        const changedKey = Object.keys(updated).find(k => updated[k] !== scanDevMode[k]);
                        setScanDevMode(prev => ({ ...prev, [changedKey]: updated[changedKey] }));
                    }}
                    onClear={() => setScanDevMode(SCAN_DEV_DEFAULT)}
                    options={SCAN_DEV_OPTIONS}
                />
            )}

            <div className={`${styles.content} ${activeTab === 'scan' ? styles['content--scan'] : ''}`}>
                {activeTab === "scan" ? (
                    <ScanQR
                        key="scan"
                        devMode={scanDevMode}
                        selectedEvent={selectedEvent}
                        onSetEditing={handleSetEditing}
                        isMobile={isMobile}
                        onEventChange={handleEventChange}
                        onOpenDrawer={handleOpenDrawer}
                        onDropdownToggle={onDropdownToggle}
                        showEventDrawer={showEventDrawer}
                        onCloseDrawer={handleCloseDrawer}
                        onCloseMismatch={() => setScanDevMode(prev => ({ ...prev, mismatch: false }))}
                        onCloseScanSuccess={() => setScanDevMode(prev => ({ ...prev, scanSuccess: false }))}
                        onCloseScanError={() => setScanDevMode(prev => ({ ...prev, scanError: false }))}
                        onCloseAlreadyConnected={() => setScanDevMode(prev => ({ ...prev, alreadyConnected: false }))}
                        onCloseWhatToDo={() => setScanDevMode(prev => ({ ...prev, whatToDo: false }))}
                    />
                ) : (
                    <>
                        <h1 className={styles.pageTitle}>Show QR</h1>
                        <div className={styles.centerWrapper}>
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
                                onDismiss={() => handleDevMode("connectBack", false)}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

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