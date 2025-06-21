import { useState, useEffect } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import Header from "../components/Header";
import { useStorage } from "../hooks/useStorage"; // NEW: Import our hook

export default function ProfileQRPage() {
    // CHANGED: Use storage hook instead of localStorage
    const { isReady, profile, saveProfile } = useStorage();

    // NEW: Local state for editing (separate from stored profile)
    const [editingProfile, setEditingProfile] = useState({
        name: "",
        festival: "",
        whatsapp: "",
        instagram: "",
    });
    const [isEditing, setIsEditing] = useState(true);

    // NEW: Update local editing state when profile loads from IndexedDB
    useEffect(() => {
        if (profile) {
            setEditingProfile({
                name: profile.name || "",
                festival: profile.festival || "",
                whatsapp: profile.whatsapp || "",
                instagram: profile.instagram || "",
            });
            setIsEditing(false); // Show QR if profile exists
        } else {
            setIsEditing(true); // Show form if no profile
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // CHANGED: Use async saveProfile from hook instead of localStorage
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const success = await saveProfile(editingProfile);
            if (success) {
                setIsEditing(false); // Show QR code view
            } else {
                alert("Failed to save profile. Please try again.");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        }
    };

    // CHANGED: Generate QR data using editingProfile when editing, or stored profile when viewing
    const currentProfile = isEditing ? editingProfile : profile;
    const qrData = JSON.stringify({
        name: currentProfile?.name || "",
        festival: currentProfile?.festival || "",
        whatsapp: currentProfile?.whatsapp || "",
        instagram: currentProfile?.instagram || "",
        timestamp: new Date().toISOString(),
    });

    // NEW: Show loading while IndexedDB initializes
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

    return (
        <div>
            <Header />
            <div
                style={{
                    maxWidth: "500px",
                    margin: "0 auto",
                    padding: "2rem 1rem",
                }}
            >
                {isEditing ? (
                    // Profile Edit Form (mostly unchanged, just using editingProfile)
                    <div>
                        <h1
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                marginBottom: "1.5rem",
                                textAlign: "center",
                            }}
                        >
                            {editingProfile.name
                                ? "Edit Your Profile"
                                : "Create Your Festival Profile"}
                        </h1>

                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    style={{
                                        display: "block",
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={editingProfile.name}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        border: "1px solid #ccc",
                                        borderRadius: "0.375rem",
                                    }}
                                    placeholder="How should people remember you?"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="festival"
                                    style={{
                                        display: "block",
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    Festival Name
                                </label>
                                <input
                                    type="text"
                                    id="festival"
                                    name="festival"
                                    value={editingProfile.festival}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        border: "1px solid #ccc",
                                        borderRadius: "0.375rem",
                                    }}
                                    placeholder="Which festival are you attending?"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="whatsapp"
                                    style={{
                                        display: "block",
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    WhatsApp Number
                                </label>
                                <input
                                    type="tel"
                                    id="whatsapp"
                                    name="whatsapp"
                                    value={editingProfile.whatsapp}
                                    onChange={handleChange}
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        border: "1px solid #ccc",
                                        borderRadius: "0.375rem",
                                    }}
                                    placeholder="+1234567890"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="instagram"
                                    style={{
                                        display: "block",
                                        fontSize: "0.875rem",
                                        fontWeight: "500",
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    Instagram Username
                                </label>
                                <input
                                    type="text"
                                    id="instagram"
                                    name="instagram"
                                    value={editingProfile.instagram}
                                    onChange={handleChange}
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        border: "1px solid #ccc",
                                        borderRadius: "0.375rem",
                                    }}
                                    placeholder="@username (without the @)"
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    backgroundColor: "#2563eb",
                                    color: "white",
                                    padding: "0.5rem",
                                    borderRadius: "0.375rem",
                                    border: "none",
                                    marginTop: "0.5rem",
                                    cursor: "pointer",
                                }}
                            >
                                Save Profile
                            </button>

                            {/* CHANGED: Check if profile exists using hook data */}
                            {profile && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#e5e7eb",
                                        color: "#374151",
                                        padding: "0.5rem",
                                        borderRadius: "0.375rem",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>
                ) : (
                    // QR Code Display (mostly unchanged, just using profile from hook)
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "1.5rem",
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: "bold",
                                }}
                            >
                                Your Festival Connect QR
                            </h1>
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    backgroundColor: "#e5e7eb",
                                    color: "#374151",
                                    padding: "0.3rem 0.7rem",
                                    borderRadius: "0.375rem",
                                    border: "none",
                                    fontSize: "0.875rem",
                                    cursor: "pointer",
                                }}
                            >
                                Edit
                            </button>
                        </div>

                        <div
                            style={{
                                backgroundColor: "white",
                                padding: "1.5rem",
                                borderRadius: "0.75rem",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                marginBottom: "1.5rem",
                                border: "1px solid #e5e7eb",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                <QRCodeSVG
                                    value={qrData}
                                    size={250}
                                    includeMargin={true}
                                    level="H"
                                />
                            </div>

                            <div style={{ textAlign: "left" }}>
                                <div style={{ marginBottom: "0.75rem" }}>
                                    <div
                                        style={{
                                            fontSize: "0.875rem",
                                            color: "#6b7280",
                                            marginBottom: "0.25rem",
                                        }}
                                    >
                                        Festival Name
                                    </div>
                                    <div
                                        style={{
                                            padding: "0.5rem",
                                            backgroundColor: "#f9fafb",
                                            borderRadius: "0.375rem",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        {profile?.name} @ {profile?.festival}
                                    </div>
                                </div>

                                {profile?.whatsapp && (
                                    <div style={{ marginBottom: "0.75rem" }}>
                                        <div
                                            style={{
                                                fontSize: "0.875rem",
                                                color: "#6b7280",
                                                marginBottom: "0.25rem",
                                            }}
                                        >
                                            WhatsApp
                                        </div>
                                        <div
                                            style={{
                                                padding: "0.5rem",
                                                backgroundColor: "#f9fafb",
                                                borderRadius: "0.375rem",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            {profile.whatsapp}
                                        </div>
                                    </div>
                                )}

                                {profile?.instagram && (
                                    <div>
                                        <div
                                            style={{
                                                fontSize: "0.875rem",
                                                color: "#6b7280",
                                                marginBottom: "0.25rem",
                                            }}
                                        >
                                            Instagram
                                        </div>
                                        <div
                                            style={{
                                                padding: "0.5rem",
                                                backgroundColor: "#f9fafb",
                                                borderRadius: "0.375rem",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            @
                                            {profile.instagram.replace("@", "")}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Link
                            href="/scan"
                            style={{
                                display: "inline-block",
                                backgroundColor: "#2563eb",
                                color: "white",
                                padding: "0.5rem 1.5rem",
                                borderRadius: "0.375rem",
                                textDecoration: "none",
                            }}
                        >
                            Scan Someone's QR
                        </Link>
                    </div>
                )}
            </div>

            {/* Bottom Navigation (unchanged) */}
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
                    <Link
                        href="/profile"
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#2563eb",
                        }}
                    >
                        Show my QR
                    </Link>
                    <Link href="/scan" style={{ textAlign: "center" }}>
                        Scan a QR
                    </Link>
                </div>
            </div>
        </div>
    );
}
