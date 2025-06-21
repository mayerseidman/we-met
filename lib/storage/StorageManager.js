import { FestivalDB } from "./FestivalDB";

class StorageManager {
    constructor() {
        this.db = new FestivalDB();
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

    async getCurrentFestival() {
        if (!this.isInitialized) await this.init();
        return await this.db.getActiveFestival();
    }

    async addConnection(connectionData) {
        if (!this.isInitialized) await this.init();
        const festival = await this.getCurrentFestival();
        if (!festival) {
            throw new Error("No active festival");
        }

        connectionData.festivalId = festival.id;
        return await this.db.addConnection(connectionData);
    }

    async getConnections() {
        if (!this.isInitialized) await this.init();
        const festival = await this.getCurrentFestival();
        if (!festival) return [];

        return await this.db.getConnectionsByFestival(festival.id);
    }

    async saveProfile(profileData) {
        if (!this.isInitialized) await this.init();
        let festival = await this.getCurrentFestival();

        if (!festival) {
            // Create default festival
            const festivalId = await this.db.addFestival({
                name: profileData.festival || "My Festival",
                isActive: true,
            });
            await this.db.setActiveFestival(festivalId);
            festival = { id: festivalId };
        }

        return await this.db.saveUserProfile(festival.id, profileData);
    }

    async getProfile() {
        if (!this.isInitialized) await this.init();
        const festival = await this.getCurrentFestival();
        if (!festival) return null;

        return await this.db.getUserProfile(festival.id);
    }

    async migrateFromLocalStorage() {
        if (typeof window === "undefined") return;

        try {
            const existingConnections = localStorage.getItem("connections");
            const existingProfile = localStorage.getItem("userProfile");

            if (existingConnections || existingProfile) {
                console.log("Migrating from localStorage...");

                // Create festival for existing data
                let festivalName = "Previous Festival";
                if (existingProfile) {
                    const profile = JSON.parse(existingProfile);
                    festivalName = profile.festival || festivalName;
                }

                const festivalId = await this.db.addFestival({
                    name: festivalName,
                    isActive: true,
                });

                // Migrate connections
                if (existingConnections) {
                    const connections = JSON.parse(existingConnections);
                    for (const conn of connections) {
                        await this.db.addConnection({
                            festivalId,
                            name: conn.name,
                            whatsapp: conn.whatsapp,
                            instagram: conn.instagram,
                            festival: conn.festival,
                            scannedAt:
                                conn.scannedAt || new Date().toISOString(),
                            qrData: conn.qrData,
                        });
                    }
                }

                // Migrate profile
                if (existingProfile) {
                    const profile = JSON.parse(existingProfile);
                    await this.db.saveUserProfile(festivalId, profile);
                }

                // Clean up localStorage
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