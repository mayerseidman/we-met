// pages/_app.js
import "../styles/globals.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
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

    return <Component {...pageProps} />;
}

export default MyApp;