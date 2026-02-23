// pages/_app.js
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import BottomNav from '../components/BottomNav';
import ConnectDrawer from '../components/ConnectDrawer';
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [showConnectDrawer, setShowConnectDrawer] = useState(false);
    
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
        setIsChecking(false); // Done checking
    }, [router.pathname]);
    
    // Handle Connect button click from BottomNav
    const handleConnectClick = () => {
        setShowConnectDrawer(true);
    };
    
    // Handle drawer selection
    const handleDrawerSelect = (action) => {
        setShowConnectDrawer(false);
    
        // Only navigate if we're not already on that tab
        const currentTab = router.query.tab;
        if (currentTab !== action) {
            router.push(`/connect?tab=${action}`);
        }
    };
    
    // Handle drawer close
    const handleDrawerClose = () => {
        setShowConnectDrawer(false);
    };
    
    // Don't show nav on home (redirect) page or landing page
    const hideNav = router.pathname === '/' || router.pathname === '/landing';
    
    // Don't show nav while checking OR if on hidden pages
    const showNav = !isChecking && !hideNav;
    
    return (
        <>
            <Component {...pageProps} />
            {showNav && <BottomNav onConnectClick={handleConnectClick} />}
            
            {/* Global ConnectDrawer */}
            {showConnectDrawer && (
                <ConnectDrawer
                    onSelectAction={handleDrawerSelect}
                    onClose={handleDrawerClose}
                />
            )}
        </>
    );
}

export default MyApp;