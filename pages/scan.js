// pages/scan.js
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "../components/Header";
// You'll need to install html5-qrcode:
// npm install html5-qrcode

export default function ScanPage() {
    const [scanning, setScanning] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [scannerMessage, setScannerMessage] = useState("Position QR in frame");
    const [isProcessing, setIsProcessing] = useState(false); // NEW: Prevent multiple scans
    const scannerRef = useRef(null); // NEW: Keep reference to scanner

    useEffect(() => {
        // Only run on client side
        if (typeof window !== "undefined" && !isProcessing) {
            // Import the library dynamically (since it's browser-only)
            let Html5Qrcode;
            import("html5-qrcode").then((module) => {
                Html5Qrcode = module.Html5Qrcode;
                startScanner(Html5Qrcode);
            });

            const startScanner = async (Html5Qrcode) => {
                if (!Html5Qrcode || isProcessing) return;

                try {
                    const scanner = new Html5Qrcode("reader");
                    scannerRef.current = scanner; // Store reference

                    const config = {
                        fps: 10,
                        qrbox: 250,
                        aspectRatio: 1.0,
                        experimentalFeatures: {
                            useBarCodeDetectorIfSupported: true,
                        },
                    };

                    setScanning(true);

                    // Start scanning
                    await scanner.start(
                        { facingMode: "environment" },
                        config,
                        onScanSuccess,
                        onScanError,
                    );

                    // Enable flash if requested
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

            // Cleanup
            return () => {
                if (scannerRef.current && scanning) {
                    scannerRef.current.stop().catch(console.error);
                }
            };
        }
    }, [flashOn, isProcessing]); // Added isProcessing to dependencies

    const onScanSuccess = async (decodedText) => {
        // FIXED: Prevent multiple calls
        if (isProcessing) {
            console.log("Already processing a scan, ignoring...");
            return;
        }

        setIsProcessing(true); // Lock processing
        setScannerMessage("Processing scan...");

        // FIXED: Pause the scanner temporarily
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
            
            // Get existing connections and user profile
            const connections = JSON.parse(localStorage.getItem("connections") || "[]");
            const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

            // FIXED: Check if this person already exists as a contact (ever)
            const isDuplicate = connections.some(conn => 
                conn.name === connectionData.name && 
                conn.contactInfo?.whatsapp === connectionData.contact?.whatsapp
                // No time check - if they exist, they're a duplicate
            );

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

            // FIXED: Create proper connection object with current festival
            const newConnection = {
                id: `conn_${Date.now()}`, // Unique ID
                name: connectionData.name,
                contactInfo: connectionData.contact, // Match QR structure
                festival: userProfile.festival || "Unknown Festival", // From current profile
                timestamp: new Date().toISOString() // When scanned
            };

            // Add to connections and save
            connections.push(newConnection);
            localStorage.setItem("connections", JSON.stringify(connections));

            // Show success message
            setScannerMessage(`Connected with ${connectionData.name}!`);

            // Redirect after success
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);

        } catch (error) {
            console.error("Failed to process QR code:", error);
            setScannerMessage("Invalid QR code. Please try again.");

            // Reset and redirect after error
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }
    };

    const onScanError = (error) => {
        // Only log errors, don't display to user unless it's a permanent error
        console.error("QR Scan error:", error);
    };

    const toggleFlash = () => {
        if (!isProcessing) { // Don't allow flash toggle while processing
            setFlashOn(!flashOn);
        }
    };

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

                        {/* Processing overlay - covers scanner but doesn't hide it */}
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
                                    {/* Simple spinner */}
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

                        {/* Scanner message overlay - only when not processing */}
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
                        disabled={isProcessing} // FIXED: Disable during processing
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

                    {/* ADDED: Debug button for testing (remove in production) */}
                    {process.env.NODE_ENV === 'development' && (
                        <button
                            onClick={() => {
                                if (confirm('Clear all connections for testing?')) {
                                    localStorage.removeItem('connections');
                                    alert('Connections cleared!');
                                }
                            }}
                            style={{
                                backgroundColor: "#ef4444",
                                color: "white",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.375rem",
                                marginTop: "1rem",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "0.875rem"
                            }}
                        >
                            🗑️ Clear Connections (DEV)
                        </button>
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