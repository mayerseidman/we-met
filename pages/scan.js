// pages/scan.js - COMPLETE VERSION WITH PROPER TIMING
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { useStorage } from "../hooks/useStorage";

export default function ScanPage() {
    // Get ALL data from the hook including isReady
    const { connections, addConnection, profile, isReady } = useStorage();
    
    const [scanning, setScanning] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [scannerMessage, setScannerMessage] = useState("Position QR in frame");
    const [isProcessing, setIsProcessing] = useState(false);
    const scannerRef = useRef(null);

    useEffect(() => {
        // Only start scanner if storage is ready
        if (typeof window !== "undefined" && !isProcessing && isReady) {
            let Html5Qrcode;
            import("html5-qrcode").then((module) => {
                Html5Qrcode = module.Html5Qrcode;
                startScanner(Html5Qrcode);
            });

            const startScanner = async (Html5Qrcode) => {
                if (!Html5Qrcode || isProcessing) return;

                try {
                    const scanner = new Html5Qrcode("reader");
                    scannerRef.current = scanner;

                    const config = {
                        fps: 10,
                        qrbox: 250,
                        aspectRatio: 1.0,
                        experimentalFeatures: {
                            useBarCodeDetectorIfSupported: true,
                        },
                    };

                    setScanning(true);

                    await scanner.start(
                        { facingMode: "environment" },
                        config,
                        onScanSuccess,
                        onScanError,
                    );

                    if (flashOn) {
                        try {
                            await scanner.applyVideoConstraints({
                                advanced: [{ torch: true }],
                            });
                        } catch (error) {
                            console.error("Flash not supported", error);
                        }
                    }
                } catch (err) {
                    console.error("Error starting scanner:", err);
                    setScannerMessage(
                        "Error starting camera. Please allow camera access.",
                    );
                }
            };

            return () => {
                if (scannerRef.current && scanning) {
                    scannerRef.current.stop().catch(console.error);
                }
            };
        }
    }, [flashOn, isProcessing, isReady]); // Added isReady to dependencies

    const onScanSuccess = async (decodedText) => {
        if (isProcessing) {
            console.log("Already processing a scan, ignoring...");
            return;
        }

        // IMPORTANT: Wait for storage to be ready before processing
        if (!isReady) {
            console.log('Storage not ready yet, ignoring scan');
            return;
        }

        setIsProcessing(true);
        setScannerMessage("Processing scan...");

        // Pause the scanner
        if (scannerRef.current) {
            try {
                await scannerRef.current.pause();
            } catch (error) {
                console.error("Error pausing scanner:", error);
            }
        }

        try {
            // Parse the QR data
            const connectionData = JSON.parse(decodedText);
            console.log('Scanned QR data:', connectionData);
            
            // Check for duplicates using current connections from hook (now properly loaded)
            console.log('Current connections when checking duplicates:', connections);
            console.log('Looking for name:', connectionData.name);
            console.log('Looking for whatsapp:', connectionData.whatsapp);

            const isDuplicate = connections.some(conn => {
                console.log('Checking against:', conn.name, conn.whatsapp);
                return conn.name === connectionData.name && 
                       conn.whatsapp === connectionData.whatsapp;
            });

            console.log('Is duplicate?', isDuplicate);

            if (isDuplicate) {
                setScannerMessage(`${connectionData.name} is already in your contacts!`);
                setTimeout(async () => {
                    // Reset processing and resume scanning
                    setIsProcessing(false);
                    setScannerMessage("Position QR in frame");
                    
                    // Resume the scanner
                    if (scannerRef.current) {
                        try {
                            await scannerRef.current.resume();
                        } catch (error) {
                            console.error("Error resuming scanner:", error);
                        }
                    }
                }, 2000);
                return;
            }

            // Create new connection object
            const newConnection = {
                name: connectionData.name,
                whatsapp: connectionData.whatsapp,
                instagram: connectionData.instagram,
                email: connectionData.email,
                festival: profile?.festival || "Unknown Festival",
                scannedAt: new Date().toISOString(),
                qrData: decodedText
            };

            console.log('Adding new connection:', newConnection);

            // Add the connection using the hook
            try {
                console.log('About to call addConnection...');
                const success = await addConnection(newConnection);
                console.log('addConnection returned:', success);
                
                if (success) {
                    setScannerMessage(`Connected with ${connectionData.name}!`);
                    
                    // Redirect after success
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000);
                } else {
                    console.error('addConnection returned false - connection failed');
                    setScannerMessage("Failed to save connection. Please try again.");
                    
                    setTimeout(async () => {
                        setIsProcessing(false);
                        setScannerMessage("Position QR in frame");
                        
                        if (scannerRef.current) {
                            try {
                                await scannerRef.current.resume();
                            } catch (error) {
                                console.error("Error resuming scanner:", error);
                            }
                        }
                    }, 2000);
                }
            } catch (error) {
                console.error('Error calling addConnection:', error);
                setScannerMessage("Failed to save connection. Please try again.");
                
                setTimeout(async () => {
                    setIsProcessing(false);
                    setScannerMessage("Position QR in frame");
                    
                    if (scannerRef.current) {
                        try {
                            await scannerRef.current.resume();
                        } catch (error) {
                            console.error("Error resuming scanner:", error);
                        }
                    }
                }, 2000);
            }

        } catch (error) {
            console.error("Failed to process QR code:", error);
            setScannerMessage("Invalid QR code. Please try again.");

            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }
    };

    const onScanError = (error) => {
        // Only log errors, don't display to user
        // console.error("QR Scan error:", error);
    };

    const toggleFlash = () => {
        if (!isProcessing) {
            setFlashOn(!flashOn);
        }
    };

    // Test scan function for development
    const testScan = (name) => {
        if (!isReady) {
            alert('Storage not ready yet!');
            return;
        }

        // Create fake QR data for different test people
        const testData = {
            'Alex': {
                name: 'Alex',
                festival: 'Afrikaburn',
                whatsapp: '+1234567890',
                instagram: 'alex_burns',
                timestamp: new Date().toISOString()
            },
            'Sam': {
                name: 'Sam',
                festival: 'Burning Man',
                whatsapp: '+0987654321',
                instagram: 'sam_festival',
                timestamp: new Date().toISOString()
            },
            'Mayer': {
                name: 'Mayer',
                festival: 'Mmaaaa',
                whatsapp: '',
                instagram: '',
                timestamp: new Date().toISOString()
            }
        };

        const fakeQRData = JSON.stringify(testData[name]);
        console.log(`🧪 Testing scan for ${name}:`, fakeQRData);
        
        // Call the same function that real QR scanning uses
        onScanSuccess(fakeQRData);
    };

    // Clear connections function for development
    const clearConnections = async () => {
        if (confirm('Clear all connections for testing?')) {
            try {
                // Clear localStorage
                localStorage.removeItem('connections');
                localStorage.removeItem('userProfile');
                
                // Clear IndexedDB
                if (typeof window !== 'undefined' && 'indexedDB' in window) {
                    const deleteRequest = indexedDB.deleteDatabase('FestivalConnectDB');
                    deleteRequest.onsuccess = () => {
                        console.log('IndexedDB cleared');
                    };
                }
                
                alert('All data cleared! Please refresh the page.');
                window.location.reload();
            } catch (error) {
                console.error('Failed to clear data:', error);
                alert('Failed to clear data.');
            }
        }
    };

    // Show loading state while storage initializes
    if (!isReady) {
        return (
            <div>
                <Header />
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "2rem 1rem",
                        textAlign: "center",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            marginBottom: "1.5rem",
                        }}
                    >
                        Scan QR Code
                    </h1>
                    <p>Loading scanner...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "2rem 1rem",
                }}
            >
                <h1
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        marginBottom: "1.5rem",
                        textAlign: "center",
                    }}
                >
                    Scan QR Code
                </h1>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {/* Scanner container */}
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "384px",
                            height: "256px",
                            backgroundColor: "#f3f4f6",
                            position: "relative",
                            marginBottom: "1rem",
                            borderRadius: "0.5rem",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            id="reader"
                            style={{ 
                                width: "100%", 
                                height: "100%"
                            }}
                        ></div>

                        {/* Processing overlay */}
                        {isProcessing && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                                    color: "white",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.2rem",
                                    zIndex: 10
                                }}
                            >
                                <div style={{ marginBottom: "1rem" }}>
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            border: "4px solid rgba(255,255,255,0.3)",
                                            borderTop: "4px solid white",
                                            borderRadius: "50%",
                                            animation: "spin 1s linear infinite"
                                        }}
                                    ></div>
                                </div>
                                {scannerMessage}
                            </div>
                        )}

                        {/* Scanner message overlay */}
                        {!isProcessing && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    color: "white",
                                    padding: "0.5rem",
                                    textAlign: "center",
                                    zIndex: 5
                                }}
                            >
                                {scannerMessage}
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <button
                        onClick={toggleFlash}
                        disabled={isProcessing}
                        style={{
                            backgroundColor: isProcessing ? "#d1d5db" : "#e5e7eb",
                            color: "#1f2937",
                            padding: "0.5rem 1.5rem",
                            borderRadius: "0.375rem",
                            marginTop: "1rem",
                            border: "none",
                            cursor: isProcessing ? "not-allowed" : "pointer",
                        }}
                    >
                        {flashOn ? "Turn Off Flash" : "Toggle Flash"}
                    </button>

                    {/* Debug info for development */}
                    {process.env.NODE_ENV === 'development' && (
                        <div style={{ marginTop: "1rem", textAlign: "center" }}>
                            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                                Debug: {connections.length} connections loaded, Storage ready: {isReady ? 'Yes' : 'No'}
                            </p>
                            
                            {/* Test Scan Buttons */}
                            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
                                <button
                                    onClick={() => testScan('Alex')}
                                    style={{
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "0.375rem",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "0.875rem"
                                    }}
                                >
                                    🧪 Test Scan: Alex
                                </button>
                                <button
                                    onClick={() => testScan('Sam')}
                                    style={{
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "0.375rem",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "0.875rem"
                                    }}
                                >
                                    🧪 Test Scan: Sam
                                </button>
                                <button
                                    onClick={() => testScan('Mayer')}
                                    style={{
                                        backgroundColor: "#8b5cf6",
                                        color: "white",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "0.375rem",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "0.875rem"
                                    }}
                                >
                                    🔄 Test Duplicate: Mayer
                                </button>
                            </div>

                            <button
                                onClick={clearConnections}
                                style={{
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.375rem",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "0.875rem"
                                }}
                            >
                                🗑️ Clear All Data (DEV)
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div
                    style={{
                        position: "fixed",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        backgroundColor: "white",
                        borderTop: "1px solid #e5e7eb",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "1200px",
                            margin: "0 auto",
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            padding: "1rem",
                        }}
                    >
                        <Link href="/" style={{ textAlign: "center" }}>
                            Connections
                        </Link>
                        <Link href="/profile" style={{ textAlign: "center" }}>
                            Show my QR
                        </Link>
                        <Link
                            href="/scan"
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#2563eb",
                            }}
                        >
                            Scan a QR
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}