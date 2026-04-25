import { EventDB } from "./EventDB";

class StorageManager {
    constructor() {
        this.db = new EventDB();
        this.isInitialized = false;
    }

    async init() {
        if (!this.isInitialized && typeof window !== "undefined") {
            try {
                await this.db.init();
                this.isInitialized = true;
                console.log("Storage initialized");

                // Auto-migrate existing data
                await this.migrateFromLocalStorage();
            } catch (error) {
                console.error("Storage init failed:", error);
            }
        }
        return this.isInitialized;
    }

    async getCurrentEvent() {
        if (!this.isInitialized) await this.init();
        return await this.db.getActiveEvent();
    }

    async addConnection(connectionData) {
        if (!this.isInitialized) await this.init();
        let event = await this.getCurrentEvent();
        
        if (!event) {
            const eventId = await this.db.addEvent({
                name: connectionData.event || 'My Event',
                isActive: true,
            });
            await this.db.setActiveEvent(eventId);
            event = { id: eventId };
        }

        connectionData.eventId = event.id;
        return await this.db.addConnection(connectionData);
    }

    async getConnections() {
        if (!this.isInitialized) await this.init();
        const event = await this.getCurrentEvent();
        if (!event) return [];

        return await this.db.getConnectionsByEvent(event.id);
    }

    async saveProfile(profileData) {
        if (!this.isInitialized) await this.init();
        let event = await this.getCurrentEvent();

        if (!event) {
            const eventId = await this.db.addEvent({
                name: profileData.event || "My Event",
                isActive: true,
            });
            await this.db.setActiveEvent(eventId);
            event = { id: eventId };
        }

        return await this.db.saveUserProfile(event.id, profileData);
    }

    async getProfile() {
        if (!this.isInitialized) await this.init();
        const event = await this.getCurrentEvent();
        if (!event) return null;

        return await this.db.getUserProfile(event.id);
    }

    async migrateFromLocalStorage() {
        if (typeof window === "undefined") return;

        try {
            const existingConnections = localStorage.getItem("connections");
            const existingProfile = localStorage.getItem("userProfile");

            if (existingConnections || existingProfile) {
                console.log("Migrating from localStorage...");

                let eventName = "Previous Event";
                if (existingProfile) {
                    const profile = JSON.parse(existingProfile);
                    eventName = profile.event || eventName;
                }

                const eventId = await this.db.addEvent({
                    name: eventName,
                    isActive: true,
                });

                if (existingConnections) {
                    const connections = JSON.parse(existingConnections);
                    for (const conn of connections) {
                        await this.db.addConnection({
                            eventId,
                            name: conn.name,
                            phone: conn.phone || null,
                            instagram: conn.instagram || null,
                            event: conn.event || null,
                            scannedAt: conn.scannedAt || new Date().toISOString(),
                            qrData: conn.qrData,
                        });
                    }
                }

                if (existingProfile) {
                    const profile = JSON.parse(existingProfile);
                    await this.db.saveUserProfile(eventId, profile);
                }

                localStorage.removeItem("connections");
                localStorage.removeItem("userProfile");

                console.log("Migration complete!");
            }
        } catch (error) {
            console.error("Migration failed:", error);
        }
    }
}

export const storageManager = new StorageManager();