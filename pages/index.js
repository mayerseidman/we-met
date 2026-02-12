import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Meets from './meets';
import Landing from './landing';

export default function HomePage() {
    const router = useRouter();
    const [isFirstVisit, setIsFirstVisit] = useState(null); // null = loading
    
    useEffect(() => {
        // Check if user has visited before
        const hasVisited = localStorage.getItem('hasVisited');
        
        if (!hasVisited) {
            // First time visitor
            setIsFirstVisit(true);
        } else {
            // Returning visitor
            setIsFirstVisit(false);
        }
    }, []);
    
    // Show loading while checking
    if (isFirstVisit === null) {
        return null; // or a loading spinner
    }
    
    // First visit: show landing page
    if (!isFirstVisit) {
        return <Landing />;
    }
    
    // Returning visit: show Meets
    return <Meets />;
}