import { useState, useEffect, useRef } from "react";
import MismatchDrawer from "./MismatchDrawer";
import EmptyState from "./EmptyState";
import EventDrawer from "./EventDrawer";
import EventDropdown from "./EventDropdown";
import { useStorage } from "../hooks/useStorage";
import Avatar from './Avatar'
import { saveMeet, meetExists } from '../lib/db'
import WhatToDoModal from "./WhatToDoModal";
import toastStyles from "../styles/components/Toast.module.scss";

import styles from "../styles/components/ScanQR.module.scss";

const POP = '/icons/pop';
const DEV_PHOTO = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop";

export default function ScanQR({ 
    user,
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
    onScanSuccess,
    onShowAlreadyConnected,
}) {
    const { connections, addConnection, isReady, profile } = useStorage();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraError, setCameraError] = useState(false);
    const [showWhatToDo, setShowWhatToDo] = useState(false);
    const scannerRef = useRef(null);

    const userRef = useRef(user);
    const connectionsRef = useRef(connections);
    const isProcessingRef = useRef(false);
    const isReadyRef = useRef(isReady);
    const selectedEventRef = useRef(selectedEvent);
    const onScanSuccessRef = useRef(onScanSuccess);
    const onShowAlreadyConnectedRef = useRef(onShowAlreadyConnected);
    const addConnectionRef = useRef(addConnection);

    useEffect(() => { userRef.current = user }, [user]);
    useEffect(() => { connectionsRef.current = connections }, [connections]);
    useEffect(() => { isReadyRef.current = isReady }, [isReady]);
    useEffect(() => { selectedEventRef.current = selectedEvent }, [selectedEvent]);
    useEffect(() => { onScanSuccessRef.current = onScanSuccess }, [onScanSuccess]);
    useEffect(() => { onShowAlreadyConnectedRef.current = onShowAlreadyConnected }, [onShowAlreadyConnected]);
    useEffect(() => { addConnectionRef.current = addConnection }, [addConnection]);

    useEffect(() => {
        if (devMode.noProfile) return;
        if (typeof window === "undefined" || !isReady) return;

        let Html5Qrcode;
        import("html5-qrcode").then((module) => {
            Html5Qrcode = module.Html5Qrcode;
            startScanner(Html5Qrcode);
        });

        const onQRDetected = async (decodedText) => {
            if (isProcessingRef.current || !isReadyRef.current) return;
            isProcessingRef.current = true;
            setIsProcessing(true);
            if (scannerRef.current) {
                try { await scannerRef.current.pause(); } catch (e) {}
            }
            try {
                const connectionData = JSON.parse(decodedText);
                const isDuplicate = connectionsRef.current.some(conn => {
                    if (connectionData.userId && conn.connectedUserId) {
                        return conn.connectedUserId === connectionData.userId;
                    }
                    return conn.name === connectionData.name && conn.phone === connectionData.phone;
                });
                if (isDuplicate) {
                    onShowAlreadyConnectedRef.current && onShowAlreadyConnectedRef.current(connectionData);
                    setTimeout(async () => {
                        isProcessingRef.current = false;
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
                    event: selectedEventRef.current || 'Unknown',
                    scannedAt: new Date().toISOString(),
                    qrData: decodedText,
                };
                const success = await addConnectionRef.current(newConnection);
                if (success) {
                    if (userRef.current) {
                        const exists = await meetExists(
                            userRef.current.id,
                            newConnection.connectedUserId,
                            newConnection.name,
                            newConnection.phone
                        );
                        if (!exists) {
                            saveMeet(userRef.current.id, newConnection).catch(err =>
                                console.error('Failed to sync meet to Supabase:', err)
                            );
                        }
                    }
                    isProcessingRef.current = false;
                    setIsProcessing(false);
                    onScanSuccessRef.current && onScanSuccessRef.current(newConnection);
                }
            } catch (err) {
                console.error("Failed to process QR:", err);
                isProcessingRef.current = false;
                setIsProcessing(false);
                if (scannerRef.current) {
                    try { await scannerRef.current.resume(); } catch (e) {}
                }
            }
        };

        const startScanner = async (Html5Qrcode) => {
            try {
                const scanner = new Html5Qrcode("qr-reader");
                scannerRef.current = scanner;
                await scanner.start(
                    { facingMode: "environment" },
                    { fps: 10, aspectRatio: 1.0, experimentalFeatures: { useBarCodeDetectorIfSupported: true } },
                    onQRDetected,
                    () => {},
                );
            } catch (err) {
                console.error("Error starting scanner:", err);
                setCameraError(true);
            }
        };

        return () => {
            if (scannerRef.current) {
                const scanner = scannerRef.current;
                scannerRef.current = null;
                scanner.isScanning ? scanner.stop().catch(() => {}) : Promise.resolve();
            }
        };
    }, [isReady, devMode.noProfile]);

    if (devMode.noProfile || !profile) {
        return (
            <div style={{ background: '#FFEFD7', minHeight: '100vh', paddingBottom: '5rem' }}>
                <h1 style={{ textAlign: 'center', padding: '2rem 0 1rem', paddingBottom: '1.5rem', margin: 0, fontSize: '2rem', fontWeight: 900, fontFamily: 'inherit' }}>
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
            <h1 style={{ color: '#fff', textAlign: 'center', padding: '2rem 0 1rem', paddingBottom: '1.5rem', margin: 0, fontSize: '2rem', fontWeight: 900 }}>
                Scan QR
            </h1>
            <div className={styles.inner}>
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
                    {cameraError && (
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.85)',
                            color: 'white',
                            padding: '1.5rem',
                            textAlign: 'center',
                            gap: '0.75rem',
                            borderRadius: '2px',
                        }}>
                            <img src={`${POP}/camera.svg`} alt="" width={48} height={48} />
                            <div style={{ fontWeight: '700', fontSize: '1rem', fontFamily: 'monospace' }}>
                                Camera access denied
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8, fontFamily: 'monospace', lineHeight: 1.4 }}>
                                Please allow camera access in your browser settings and reload the page.
                            </div>
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
                    {"They don't have it?"}{" "}
                    <a href="#" className={styles.infoLink} onClick={(e) => { e.preventDefault(); setShowWhatToDo(true); }}>
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
                    selectedEvent={selectedEvent || "Burning Man 2025"}
                    onSelect={onEventChange}
                    onClose={onCloseMismatch}
                    isModal={!isMobile}
                />
            )}

            {devMode.scanSuccess && (
                <ScanSuccessModal name="Alejandro Vizio" photo={DEV_PHOTO} onDismiss={onCloseScanSuccess} isMobile={isMobile} />
            )}
            {devMode.scanError && (
                <ScanErrorModal onDismiss={onCloseScanError} isMobile={isMobile} />
            )}
            {devMode.alreadyConnected && (
                <AlreadyConnectedModal name="Big Maestro" daysAgo={3} onDismiss={onCloseAlreadyConnected} isMobile={isMobile} />
            )}
            {(devMode.whatToDo || showWhatToDo) && (
                <WhatToDoModal onDismiss={devMode.whatToDo ? onCloseWhatToDo : () => setShowWhatToDo(false)} />
            )}
        </div>
    );
}

const ScanSuccessModal = ({ name, photo, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 4500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`${toastStyles.toast} ${styles.toastLight}`} onClick={onDismiss}>
            <Avatar src={photo} name={name} size={44} />
            <div className={styles.successText}>
                <div className={styles.successTitle}>New Connection Added</div>
                <div className={styles.successName}>{name}</div>
            </div>
        </div>
    );
};

const AlreadyConnectedModal = ({ name, daysAgo, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 4500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`${toastStyles.toast} ${styles.toastLight}`} onClick={onDismiss}>
            <div className={styles.successEmoji}>
                <img src={`${POP}/handshake.svg`} alt="" width={36} height={36} />
            </div>
            <div className={styles.successText}>
                <div className={styles.successTitle}>Already Connected</div>
                <div className={styles.successName}>{name} · {daysAgo === 0 ? 'today' : `${daysAgo}d ago`}</div>
            </div>
        </div>
    );
};

const ScanErrorModal = ({ onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 4500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`${toastStyles.toast} ${styles.toastLight}`} onClick={onDismiss}>
            <div className={styles.successEmoji}>💩</div>
            <div className={styles.successText}>
                <div className={styles.successTitle}>Scan Failed</div>
                <div className={styles.successName}>Check lighting & camera</div>
            </div>
        </div>
    );
};