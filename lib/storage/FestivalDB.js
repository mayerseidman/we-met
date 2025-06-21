export class FestivalDB {
    constructor() {
        this.dbName = "FestivalConnectDB";
        this.version = 1;
        this.db = null;
    }

    isClient() {
        return typeof window !== "undefined" && "indexedDB" in window;
    }

    async init() {
        if (!this.isClient()) return null;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains("festivals")) {
                    const festivalStore = db.createObjectStore("festivals", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }

                if (!db.objectStoreNames.contains("connections")) {
                    const connectionStore = db.createObjectStore(
                        "connections",
                        {
                            keyPath: "id",
                            autoIncrement: true,
                        },
                    );
                    connectionStore.createIndex("festivalId", "festivalId", {
                        unique: false,
                    });
                    connectionStore.createIndex("timestamp", "timestamp", {
                        unique: false,
                    });
                }

                if (!db.objectStoreNames.contains("userProfiles")) {
                    const profileStore = db.createObjectStore("userProfiles", {
                        keyPath: "festivalId",
                    });
                }
            };
        });
    }

    async addFestival(festivalData) {
        if (!this.db) return null;

        const transaction = this.db.transaction(["festivals"], "readwrite");
        const store = transaction.objectStore("festivals");

        const festival = {
            name: festivalData.name,
            year: festivalData.year || new Date().getFullYear(),
            createdAt: new Date().toISOString(),
            isActive: festivalData.isActive || false,
        };

        return new Promise((resolve, reject) => {
            const request = store.add(festival);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllFestivals() {
        if (!this.db) return [];

        const transaction = this.db.transaction(["festivals"], "readonly");
        const store = transaction.objectStore("festivals");

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getActiveFestival() {
        const festivals = await this.getAllFestivals();
        return festivals.find((festival) => festival.isActive) || null;
    }

    async setActiveFestival(festivalId) {
        if (!this.db) return;

        const allFestivals = await this.getAllFestivals();
        const transaction = this.db.transaction(["festivals"], "readwrite");
        const store = transaction.objectStore("festivals");

        const updatePromises = allFestivals.map((festival) => {
            festival.isActive = festival.id === festivalId;
            return new Promise((resolve, reject) => {
                const updateRequest = store.put(festival);
                updateRequest.onsuccess = () => resolve();
                updateRequest.onerror = () => reject(updateRequest.error);
            });
        });

        return Promise.all(updatePromises);
    }

    async addConnection(connectionData) {
        if (!this.db) return null;

        const transaction = this.db.transaction(["connections"], "readwrite");
        const store = transaction.objectStore("connections");

        const connection = {
            festivalId: connectionData.festivalId,
            name: connectionData.name,
            whatsapp: connectionData.whatsapp,
            instagram: connectionData.instagram,
            festival: connectionData.festival,
            scannedAt: connectionData.scannedAt || new Date().toISOString(),
            qrData: connectionData.qrData,
        };

        return new Promise((resolve, reject) => {
            const request = store.add(connection);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getConnectionsByFestival(festivalId) {
        if (!this.db) return [];

        const transaction = this.db.transaction(["connections"], "readonly");
        const store = transaction.objectStore("connections");
        const index = store.index("festivalId");

        return new Promise((resolve, reject) => {
            const request = index.getAll(festivalId);
            request.onsuccess = () => {
                const connections = request.result.sort(
                    (a, b) => new Date(b.scannedAt) - new Date(a.scannedAt),
                );
                resolve(connections);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async saveUserProfile(festivalId, profileData) {
        if (!this.db) return null;

        const transaction = this.db.transaction(["userProfiles"], "readwrite");
        const store = transaction.objectStore("userProfiles");

        const profile = {
            festivalId: festivalId,
            name: profileData.name,
            festival: profileData.festival,
            whatsapp: profileData.whatsapp,
            instagram: profileData.instagram,
            updatedAt: new Date().toISOString(),
        };

        return new Promise((resolve, reject) => {
            const request = store.put(profile);
            request.onsuccess = () => resolve(profile);
            request.onerror = () => reject(request.error);
        });
    }

    async getUserProfile(festivalId) {
        if (!this.db) return null;

        const transaction = this.db.transaction(["userProfiles"], "readonly");
        const store = transaction.objectStore("userProfiles");

        return new Promise((resolve, reject) => {
            const request = store.get(festivalId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}