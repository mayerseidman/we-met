import { useState, useEffect } from "react";
import { storageManager } from "../lib/storage/StorageManager";

export function useStorage() {
    const [isReady, setIsReady] = useState(false);
    const [connections, setConnections] = useState([]);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const initStorage = async () => {
            await storageManager.init();

            const [connectionsData, profileData] = await Promise.all([
                storageManager.getConnections(),
                storageManager.getProfile(),
            ]);

            setConnections(connectionsData);
            setProfile(profileData);
            setIsReady(true);
        };

        initStorage();
    }, []);

    const addConnection = async (connectionData) => {
        try {
            await storageManager.addConnection(connectionData);
            const updatedConnections = await storageManager.getConnections();
            setConnections(updatedConnections);
            return true;
        } catch (error) {
            console.error("Failed to add connection:", error);
            return false;
        }
    };

    const saveProfile = async (profileData) => {
        try {
            const savedProfile = await storageManager.saveProfile(profileData);
            setProfile(savedProfile);
            return true;
        } catch (error) {
            console.error("Failed to save profile:", error);
            return false;
        }
    };

    const refreshData = async () => {
        if (!isReady) return;

        const [connectionsData, profileData] = await Promise.all([
            storageManager.getConnections(),
            storageManager.getProfile(),
        ]);

        setConnections(connectionsData);
        setProfile(profileData);
    };

    return {
        isReady,
        connections,
        profile,
        addConnection,
        saveProfile,
        refreshData,
    };
}