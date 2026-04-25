export class EventDB {
    constructor() {
        this.dbName = "WeMetDB";
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

                if (!db.objectStoreNames.contains("events")) {
                    db.createObjectStore("events", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }

                if (!db.objectStoreNames.contains("connections")) {
                    const connectionStore = db.createObjectStore("connections", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                    connectionStore.createIndex("eventId", "eventId", {
                        unique: false,
                    });
                    connectionStore.createIndex("timestamp", "timestamp", {
                        unique: false,
                    });
                }

                if (!db.objectStoreNames.contains("userProfiles")) {
                    db.createObjectStore("userProfiles", {
                        keyPath: "eventId",
                    });
                }
            };
        });
    }

    async addEvent(eventData) {
        if (!this.db) return null;

        const transaction = this.db.transaction(["events"], "readwrite");
        const store = transaction.objectStore("events");

        const event = {
            name: eventData.name,
            year: eventData.year || new Date().getFullYear(),
            createdAt: new Date().toISOString(),
            isActive: eventData.isActive || false,
        };

        return new Promise((resolve, reject) => {
            const request = store.add(event);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllEvents() {
        if (!this.db) return [];

        const transaction = this.db.transaction(["events"], "readonly");
        const store = transaction.objectStore("events");

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getActiveEvent() {
        const events = await this.getAllEvents();
        return events.find((event) => event.isActive) || null;
    }

    async setActiveEvent(eventId) {
        if (!this.db) return;

        const allEvents = await this.getAllEvents();
        const transaction = this.db.transaction(["events"], "readwrite");
        const store = transaction.objectStore("events");

        const updatePromises = allEvents.map((event) => {
            event.isActive = event.id === eventId;
            return new Promise((resolve, reject) => {
                const updateRequest = store.put(event);
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
            eventId: connectionData.eventId,
            name: connectionData.name,
            phone: connectionData.phone || null,
            instagram: connectionData.instagram || null,
            about: connectionData.about || null,
            photo: connectionData.photo || null,
            connectedUserId: connectionData.connectedUserId || null,
            event: connectionData.event || null,
            scannedAt: connectionData.scannedAt || new Date().toISOString(),
            qrData: connectionData.qrData,
        };

        return new Promise((resolve, reject) => {
            const request = store.add(connection);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getConnectionsByEvent(eventId) {
        if (!this.db) return [];

        const transaction = this.db.transaction(["connections"], "readonly");
        const store = transaction.objectStore("connections");
        const index = store.index("eventId");

        return new Promise((resolve, reject) => {
            const request = index.getAll(eventId);
            request.onsuccess = () => {
                const connections = request.result.sort(
                    (a, b) => new Date(b.scannedAt) - new Date(a.scannedAt),
                );
                resolve(connections);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async saveUserProfile(eventId, profileData) {
        if (!this.db) return null;
        const transaction = this.db.transaction(["userProfiles"], "readwrite");
        const store = transaction.objectStore("userProfiles");
        const profile = {
            eventId: eventId,
            name: profileData.name,
            phone: profileData.phone,
            instagram: profileData.instagram,
            location: profileData.location,
            about: profileData.about,
            photo: profileData.photo || null,
            updatedAt: new Date().toISOString(),
        };
        return new Promise((resolve, reject) => {
            const request = store.put(profile);
            request.onsuccess = () => resolve(profile);
            request.onerror = () => reject(request.error);
        });
    }

    async getUserProfile(eventId) {
        if (!this.db) return null;

        const transaction = this.db.transaction(["userProfiles"], "readonly");
        const store = transaction.objectStore("userProfiles");

        return new Promise((resolve, reject) => {
            const request = store.get(eventId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}