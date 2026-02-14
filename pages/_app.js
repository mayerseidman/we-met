// pages/_app.js
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import BottomNav from '../components/BottomNav'
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [isFirstVisit, setIsFirstVisit] = useState(null); // null = checking
    const [isChecking, setIsChecking] = useState(true); // NEW: track if we're still checking
    
    useEffect(() => {
        // Only register in production or when explicitly testing
        if ('serviceWorker' in navigator && 
            (process.env.NODE_ENV === 'production' || 
             window.location.search.includes('sw=true'))) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("SW registered successfully:", registration);
                })
                .catch((error) => {
                    console.log("SW registration failed:", error);
                });
        }
    }, []);
    
    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        setIsFirstVisit(!hasVisited);
        setIsChecking(false); // Done checking
    }, [router.pathname]);
    
    // Don't show nav on home (redirect) page or landing page
    const hideNav = router.pathname === '/' || router.pathname === '/landing';
    
    // Don't show nav while checking OR if first visit OR if on hidden pages
    const showNav = !isChecking && !isFirstVisit && !hideNav;
    
    return (
        <>
            <Component {...pageProps} />
            {showNav && <BottomNav />}
        </>
    );
}

export default MyApp;