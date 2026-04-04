import { useState, useEffect, useRef } from "react";
import MismatchDrawer from "./MismatchDrawer";
import EmptyState from "./EmptyState";
import EventDrawer from "./EventDrawer";
import EventDropdown from "./EventDropdown";
import { useStorage } from "../hooks/useStorage";
import { useAuth } from '../hooks/useAuth'
import { saveMeet } from '../lib/db'

import styles from "../styles/components/ScanQR.module.scss";

const DEV_PHOTO = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop";

export default function ScanQR({ 
    devMode = {}, 
    selectedEvent,
    onSetEditing, 
    isMobile,
    onCloseMismatch,
    onCloseScanSuccess,
    onCloseScanError,
    onCloseAlreadyConnected,
    onCloseWhatToDo,
    onEventChange,
    onOpenDrawer,
    onDropdownToggle,
    showEventDrawer,
    onCloseDrawer,
}) {
    const { connections, addConnection, profile, isReady } = useStorage();
    const [isProcessing, setIsProcessing] = useState(false);
    const [scannerMessage, setScannerMessage] = useState("");
    const [cameraError, setCameraError] = useState(false);
    const scannerRef = useRef(null);
    const { user } = useAuth()

    useEffect(() => {
        if (devMode.noProfile) return;
        if (typeof window === "undefined" || !isReady || isProcessing) return;

        let Html5Qrcode;

        import("html5-qrcode").then((module) => {
            Html5Qrcode = module.Html5Qrcode;
            startScanner(Html5Qrcode);
        });

        const startScanner = async (Html5Qrcode) => {
            if (!Html5Qrcode || isProcessing) return;
            try {
                const scanner = new Html5Qrcode("qr-reader");
                scannerRef.current = scanner;
                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: 250,
                        aspectRatio: 1.0,
                        experimentalFeatures: { useBarCodeDetectorIfSupported: true },
                    },
                    onScanSuccess,
                    () => {},
                );
            } catch (err) {
                console.error("Error starting scanner:", err);
                setCameraError(true);
            }
        };
        return () => {
            if (scannerRef.current) {
                const scanner = scannerRef.current
                scannerRef.current = null
                scanner.isScanning
                    ? scanner.stop().catch(() => {})
                    : Promise.resolve()
            }
        }
    }, [isReady, devMode.noProfile]);

    const onScanSuccess = async (decodedText) => {
        console.log('scan success called:', decodedText)
        if (isProcessing || !isReady) return;
        setIsProcessing(true);

        if (scannerRef.current) {
            try { await scannerRef.current.pause(); } catch (e) {}
        }

        try {
            const connectionData = JSON.parse(decodedText);
            const isDuplicate = connections.some(
                conn => conn.name === connectionData.name && conn.whatsapp === connectionData.whatsapp
            );

            if (isDuplicate) {
                // trigger already connected modal
                onCloseAlreadyConnected && onCloseAlreadyConnected('show', connectionData);
                setTimeout(async () => {
                    setIsProcessing(false);
                    if (scannerRef.current) {
                        try { await scannerRef.current.resume(); } catch (e) {}
                    }
                }, 2000);
                return;
            }
            const newConnection = {
                name: connectionData.name,
                phone: connectionData.phone || null,
                instagram: connectionData.instagram || null,
                about: connectionData.about || null,
                photo: connectionData.photo || null,
                connectedUserId: connectionData.userId || null,
                festival: selectedEvent || 'Unknown',
                scannedAt: new Date().toISOString(),
                qrData: decodedText,
            }

            const success = await addConnection(newConnection)
            console.log('addConnection result:', success)
            if (success) {
                if (user) {
                    console.log('saving to supabase, user:', user.id)
                    saveMeet(user.id, newConnection).catch(err => 
                        console.error('Failed to sync meet to Supabase:', err)
                    )
                }
            }
        } catch (err) {
            console.error("Failed to process QR:", err);
            setIsProcessing(false);
            if (scannerRef.current) {
                try { await scannerRef.current.resume(); } catch (e) {}
            }
        }
    };

    if (devMode.noProfile) {
        return (
            <div style={{ background: '#FFEFD7', minHeight: '100vh', paddingBottom: '5rem' }}>
                <h1 style={{ textAlign: 'center', padding: '2rem 0 1rem', margin: 0, fontSize: '2rem', fontWeight: 900, fontFamily: 'inherit' }}>
                    Scan QR
                </h1>
                <div style={{ maxWidth: '375px', margin: '0 auto', padding: '0 1rem' }}>
                    <EmptyState onSetEditing={onSetEditing} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.scanQr}>
            <h1 style={{ color: '#fff', textAlign: 'center', padding: '2rem 0 1rem', margin: 0, fontSize: '2rem', fontWeight: 900 }}>
                Scan QR
            </h1>
            <div className={styles.inner}>
                <div className={styles.tagline}>
                    <p className={styles.subtext}>Gotta Scan &apos;Em All! OR lose them forever :(</p>
                </div>
                <div className={styles.viewfinder}>
                    <span className={`${styles.corner} ${styles.cornerTL}`} />
                    <span className={`${styles.corner} ${styles.cornerTR}`} />
                    <span className={`${styles.corner} ${styles.cornerBL}`} />
                    <span className={`${styles.corner} ${styles.cornerBR}`} />
                    <div id="qr-reader" className={styles.cameraView} />
                    {isProcessing && (
                        <div className={styles.processingOverlay}>
                            <div className={styles.spinner} />
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.bottom}>
                <div className={styles.eventSection}>
                    <label className={styles.eventLabel}>Event</label>
                    {isMobile ? (
                        <button className={styles.eventTrigger} onClick={onOpenDrawer}>
                            <span>{selectedEvent}</span>
                            <svg className={styles.arrow} width="12" height="8" viewBox="0 0 12 8" fill="none">
                                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                    ) : (
                        <EventDropdown
                            selectedEvent={selectedEvent}
                            onEventChange={onEventChange}
                            onDropdownToggle={onDropdownToggle}
                        />
                    )}
                </div>

                <p className={styles.infoNote}>
                    <span className={styles.infoIcon}>ⓘ</span>
                    {"They don't have it?"}{" "}
                    <a href="#" className={styles.infoLink} onClick={(e) => { e.preventDefault(); }}>
                        What to Do
                    </a>
                </p>
            </div>

            {showEventDrawer && (
                <EventDrawer
                    selectedEvent={selectedEvent}
                    onSelect={onEventChange}
                    onClose={onCloseDrawer}
                />
            )}

            {devMode.mismatch && (
                <MismatchDrawer
                    scannerName="Big Maestro"
                    scannedEvent="Afrikaburn"
                    selectedEvent={selectedEvent || "Burning Man"}
                    onSelect={(event) => console.log("Selected:", event)}
                    onClose={onCloseMismatch}
                    isModal={!isMobile}
                />
            )}

            {devMode.scanSuccess && (
                <ScanSuccessModal name="Alejandro Vizio" photo={DEV_PHOTO} onDismiss={onCloseScanSuccess} />
            )}
            {devMode.scanError && (
                <ScanErrorModal onDismiss={onCloseScanError} />
            )}
            {devMode.alreadyConnected && (
                <AlreadyConnectedModal name="Big Maestro" daysAgo={3} onDismiss={onCloseAlreadyConnected} />
            )}
            {devMode.whatToDo && (
                <WhatToDoModal onDismiss={onCloseWhatToDo} />
            )}
        </div>
    );
}

const ScanSuccessModal = ({ name, photo, onDismiss }) => (
    <div>🚀 SUCCESS SHELL — {name}</div>
);

const ScanErrorModal = ({ onDismiss }) => (
    <div>💩 ERROR SHELL</div>
);

const WhatToDoModal = ({ onDismiss }) => (
    <div>📱 WHAT TO DO SHELL</div>
);

const AlreadyConnectedModal = ({ name, daysAgo, onDismiss }) => (
    <div>🤝 ALREADY CONNECTED SHELL — {name} ({daysAgo} days ago)</div>
);