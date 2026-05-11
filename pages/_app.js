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
    const [mounted, setMounted] = useState(false);
    const [showConnectDrawer, setShowConnectDrawer] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Must be first effect — gates everything else
    useEffect(() => {
        setMounted(true);
    }, []);

    // Detect mobile vs desktop
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // ── Routing gatekeeper ────────────────────────────────────
    useEffect(() => {
        if (authLoading || !isReady || !router.isReady) return;
        const publicPages = ['/landing', '/auth'];
        if (publicPages.includes(router.pathname)) return;

        if (router.pathname === '/') {
            if (profile) {
                router.push('/meets');
            } else if (user) {
                router.push('/profile');
            }
            // No profile, no session → stay at '/' to render the marketing page.
        }
        if (router.pathname === '/profile') {
            if (!user && !profile && router.query.from !== 'landing') {
                router.push('/landing');
            }
        }
    }, [user, authLoading, isReady, profile, router]);

    // ── Service worker ────────────────────────────────────────
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(() => {
                console.log('Service worker registered')
            }).catch((err) => {
                console.error('Service worker registration failed:', err)
            })
        }
    }, []);

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
    const hideNav = ['/', '/landing', '/auth', '/reset-password'].includes(router.pathname);
    const showNav = !hideNav;

    // Open Graph meta tags for the marketing page — rendered above the
    // mount gate so SSR HTML includes them (crawlers don't run JS).
    const isMarketing = router.pathname === '/';
    const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== 'undefined' ? window.location.origin : 'https://we-met-preview.vercel.app');
    const ogHead = isMarketing && (
        <Head>
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content="We Met — never lose a festival connection" />
            <meta property="og:description" content="Save everyone you meet at festivals and keep the magic alive." />
            <meta property="og:image" content={`${siteUrl}/api/og`} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:alt" content="We Met — festival connection app" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="We Met — never lose a festival connection" />
            <meta name="twitter:description" content="Save everyone you meet at festivals and keep the magic alive." />
            <meta name="twitter:image" content={`${siteUrl}/api/og`} />
            <meta name="twitter:image:alt" content="We Met — festival connection app" />
        </Head>
    );

    // Block render until client has mounted and storage is ready
    // This prevents SSR/hydration mismatch
    if (!mounted || !isReady) {
        return (
            <>
                {ogHead}
                <div style={{ minHeight: '100vh', background: '#FFEFD7' }} />
            </>
        );
    }

    return (
        <div suppressHydrationWarning>
            {ogHead}
            <Head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#F5722F" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="We Met" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@500..700&display=swap" rel="stylesheet" />
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
        </div>
    );
}

export default MyApp;