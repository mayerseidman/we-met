// pages/_app.js
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

import BottomNav from '../components/BottomNav'

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const [isFirstVisit, setIsFirstVisit] = useState(null);
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
    }, [useRouter.pathname]);

    return (
        <>
            <Component {...pageProps} />
            { isFirstVisit && <BottomNav /> }
        </>
    );
}

export default MyApp;