// ══════════════════════════════════════════════════════════════
// pages/_app.js
// ══════════════════════════════════════════════════════════════
// App entry point — wraps every page with shared layout and logic.
//
// WHY THIS EXISTS:
// Next.js renders every page through _app.js first.
// We use it to:
// 1. Check auth state and route accordingly
// 2. Show the bottom nav on all pages that need it
// 3. Show the ConnectDrawer/Popover globally
//
// ROUTING LOGIC:
// - Has local profile → /meets (offline-first, no account needed)
// - Has session, no local profile → /profile (has account, needs to set up profile)
// - No profile, no session → /landing (brand new user)

import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import BottomNav from '../components/BottomNav';
import ConnectDrawer from '../components/ConnectDrawer';
import ConnectPopover from '../components/ConnectPopover';
import { useAuth } from '../hooks/useAuth';
import { useStorage } from '../hooks/useStorage';
import Head from 'next/head'
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { profile, isReady } = useStorage();
    const [showConnectDrawer, setShowConnectDrawer] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const publicPages = ['/landing', '/auth', '/reset-password']

    // Detect mobile vs desktop
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // ── Routing gatekeeper ────────────────────────────────────
    // Wait until both auth and storage are ready before routing
    // Otherwise we might redirect before we know the true state
    useEffect(() => {
        if (authLoading || !isReady || !router.isReady) return;
        const publicPages = ['/landing', '/auth'];
        if (publicPages.includes(router.pathname)) return;

        if (router.pathname === '/') {
            if (profile) {
                router.push('/meets');
            } else if (user) {
                router.push('/profile');
            } else {
                router.push('/landing');
            }
        }

        // Handle cold landing on /profile with no session and no profile
        if (router.pathname === '/profile') {
            if (!user && !profile) {
                router.push('/landing');
            }
        }
    }, [user, authLoading, isReady, profile, router]);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(() => {
                console.log('Service worker registered')
            }).catch((err) => {
                console.error('Service worker registration failed:', err)
            })
        }
    }, [])

    // ── Connect drawer/popover handlers ───────────────────────
    const handleConnectClick = () => setShowConnectDrawer(true);

    const handleDrawerSelect = (action) => {
        setShowConnectDrawer(false);
        const currentTab = router.query.tab;
        if (currentTab !== action) {
            router.push(`/connect?tab=${action}`);
        }
    };

    const handleDrawerClose = () => setShowConnectDrawer(false);

    // Don't show nav on landing, auth, or home redirect pages
    const hideNav = ['/', '/landing', '/auth', '/reset-password'].includes(router.pathname)
    const showNav = !hideNav;

    // Show nothing while auth and storage are initializing
    if (authLoading || !isReady) return null

    return (
        <>
            <Head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#F5722F" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="We Met" />
            </Head>
            <Component
                {...pageProps}
                onDropdownToggle={setIsDropdownOpen}
                user={user}
            />
            {showNav && (
                <BottomNav
                    onConnectClick={handleConnectClick}
                    isHidden={isDropdownOpen}
                />
            )}

            {/* Show drawer on mobile, popover on desktop */}
            {showConnectDrawer && (
                isMobile ? (
                    <ConnectDrawer
                        onSelectAction={handleDrawerSelect}
                        onClose={handleDrawerClose}
                    />
                ) : (
                    <ConnectPopover
                        onSelectAction={handleDrawerSelect}
                        onClose={handleDrawerClose}
                    />
                )
            )}
        </>
    );
}

export default MyApp;