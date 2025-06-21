// pages/index.js - FINAL VERSION WITH INDEXEDDB
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { useStorage } from "../hooks/useStorage";

// Helper function to format relative time
function formatRelativeTime(timestamp) {
    const now = new Date();
    const scannedTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - scannedTime) / (1000 * 60));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "yesterday";

    return `${diffInDays} days ago`;
}

// Helper to group connections by day
function groupConnectionsByDay(connections) {
    const grouped = {};

    connections.forEach((connection) => {
        const date = new Date(connection.scannedAt);
        const today = new Date();

        let dayKey;

        if (date.toDateString() === today.toDateString()) {
            dayKey = "Recent";
        } else {
            const days = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ];
            dayKey = days[date.getDay()];
        }

        if (!grouped[dayKey]) {
            grouped[dayKey] = [];
        }

        grouped[dayKey].push(connection);
    });

    return grouped;
}

export default function HomePage() {
    // Use the IndexedDB storage hook
    const { isReady, connections, profile } = useStorage();
    const [viewMode, setViewMode] = useState("list");

    // Show loading while IndexedDB initializes
    if (!isReady) {
        return (
            <div>
                <Header />
                <div
                    style={{
                        maxWidth: "500px",
                        margin: "0 auto",
                        padding: "2rem 1rem",
                        textAlign: "center",
                    }}
                >
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // If no profile, suggest creating one
    if (!profile) {
        return (
            <div>
                <Header />
                <div
                    style={{
                        maxWidth: "500px",
                        margin: "0 auto",
                        padding: "2rem 1rem",
                        textAlign: "center",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            marginBottom: "1rem",
                        }}
                    >
                        Welcome to Festival Connect!
                    </h1>
                    <p style={{ marginBottom: "1.5rem" }}>
                        Set up your QR to start connecting!
                    </p>
                    <Link
                        href="/profile"
                        style={{
                            backgroundColor: "#2563eb",
                            color: "white",
                            padding: "0.5rem 1.5rem",
                            borderRadius: "0.375rem",
                            display: "inline-block",
                        }}
                    >
                        Create Profile
                    </Link>
                </div>
            </div>
        );
    }

    // Group connections for display
    const groupedConnections = groupConnectionsByDay(connections);

    return (
        <div>
            <Header />
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "2rem 1rem",
                    paddingBottom: "4rem",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                    }}
                >
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                        Your Connections
                    </h1>

                    {/* View toggle */}
                    <div
                        style={{
                            display: "flex",
                            border: "1px solid #ccc",
                            borderRadius: "0.375rem",
                            overflow: "hidden",
                        }}
                    >
                        <button
                            onClick={() => setViewMode("list")}
                            style={{
                                padding: "0.25rem 0.75rem",
                                backgroundColor:
                                    viewMode === "list" ? "#2563eb" : "#f3f4f6",
                                color: viewMode === "list" ? "white" : "black",
                            }}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode("timeline")}
                            style={{
                                padding: "0.25rem 0.75rem",
                                backgroundColor:
                                    viewMode === "timeline"
                                        ? "#2563eb"
                                        : "#f3f4f6",
                                color:
                                    viewMode === "timeline" ? "white" : "black",
                            }}
                        >
                            Timeline View
                        </button>
                    </div>
                </div>

                {connections.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
                        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                            No connections yet
                        </p>
                        <Link
                            href="/scan"
                            style={{
                                backgroundColor: "#2563eb",
                                color: "white",
                                padding: "0.5rem 1.5rem",
                                borderRadius: "0.375rem",
                                display: "inline-block",
                            }}
                        >
                            Scan Your First Connection
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* List View */}
                        {viewMode === "list" && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1.5rem",
                                }}
                            >
                                {Object.entries(groupedConnections).map(
                                    ([day, dayConnections]) => (
                                        <div key={day}>
                                            <h2
                                                style={{
                                                    fontSize: "1.125rem",
                                                    fontWeight: "500",
                                                    marginBottom: "0.5rem",
                                                }}
                                            >
                                                {day}
                                            </h2>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                {dayConnections.map(
                                                    (connection, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                backgroundColor:
                                                                    "white",
                                                                padding: "1rem",
                                                                borderRadius:
                                                                    "0.375rem",
                                                                boxShadow:
                                                                    "0 1px 3px rgba(0,0,0,0.1)",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    alignItems:
                                                                        "flex-start",
                                                                }}
                                                            >
                                                                <div>
                                                                    <h3
                                                                        style={{
                                                                            fontWeight:
                                                                                "500",
                                                                        }}
                                                                    >
                                                                        {
                                                                            connection.name
                                                                        }
                                                                    </h3>
                                                                    <p
                                                                        style={{
                                                                            fontSize:
                                                                                "0.875rem",
                                                                            color: "#6b7280",
                                                                        }}
                                                                    >
                                                                        {
                                                                            connection.festival
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <p
                                                                    style={{
                                                                        fontSize:
                                                                            "0.75rem",
                                                                        color: "#6b7280",
                                                                    }}
                                                                >
                                                                    {formatRelativeTime(
                                                                        connection.scannedAt,
                                                                    )}
                                                                </p>
                                                            </div>
                                                            {connection.whatsapp && (
                                                                <p
                                                                    style={{
                                                                        fontSize:
                                                                            "0.875rem",
                                                                        marginTop:
                                                                            "0.5rem",
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontWeight:
                                                                                "500",
                                                                        }}
                                                                    >
                                                                        WhatsApp:
                                                                    </span>{" "}
                                                                    {
                                                                        connection.whatsapp
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}

                        {/* Timeline View */}
                        {viewMode === "timeline" && (
                            <div style={{ position: "relative" }}>
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "1rem",
                                        top: "0",
                                        bottom: "0",
                                        width: "2px",
                                        backgroundColor: "#e5e7eb",
                                    }}
                                ></div>

                                <div
                                    style={{
                                        marginLeft: "3rem",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    {Object.entries(groupedConnections).map(
                                        ([day, dayConnections]) => (
                                            <div key={day}>
                                                <div
                                                    style={{
                                                        position: "relative",
                                                        marginBottom: "1rem",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            left: "-3rem",
                                                            top: "50%",
                                                            transform:
                                                                "translateY(-50%)",
                                                            width: "1rem",
                                                            height: "1rem",
                                                            borderRadius:
                                                                "9999px",
                                                            backgroundColor:
                                                                "#2563eb",
                                                        }}
                                                    ></div>
                                                    <h2
                                                        style={{
                                                            fontSize:
                                                                "1.125rem",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        {day}
                                                    </h2>
                                                </div>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "1rem",
                                                    }}
                                                >
                                                    {dayConnections.map(
                                                        (connection, index) => (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    backgroundColor:
                                                                        "white",
                                                                    padding:
                                                                        "1rem",
                                                                    borderRadius:
                                                                        "0.375rem",
                                                                    boxShadow:
                                                                        "0 1px 3px rgba(0,0,0,0.1)",
                                                                }}
                                                            >
                                                                <h3
                                                                    style={{
                                                                        fontWeight:
                                                                            "500",
                                                                    }}
                                                                >
                                                                    {
                                                                        connection.name
                                                                    }
                                                                </h3>
                                                                <p
                                                                    style={{
                                                                        fontSize:
                                                                            "0.875rem",
                                                                        color: "#6b7280",
                                                                    }}
                                                                >
                                                                    {
                                                                        connection.festival
                                                                    }
                                                                </p>
                                                                {connection.whatsapp && (
                                                                    <p
                                                                        style={{
                                                                            fontSize:
                                                                                "0.875rem",
                                                                            marginTop:
                                                                                "0.5rem",
                                                                        }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                fontWeight:
                                                                                    "500",
                                                                            }}
                                                                        >
                                                                            WhatsApp:
                                                                        </span>{" "}
                                                                        {
                                                                            connection.whatsapp
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

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
                        <Link
                            href="/"
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#2563eb",
                            }}
                        >
                            Connections
                        </Link>
                        <Link href="/profile" style={{ textAlign: "center" }}>
                            Show my QR
                        </Link>
                        <Link href="/scan" style={{ textAlign: "center" }}>
                            Scan a QR
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}