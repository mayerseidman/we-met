// pages/_app.js
import "../styles/globals.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Register service worker on client side
        if ("serviceWorker" in navigator) {
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