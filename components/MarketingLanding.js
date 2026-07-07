// ══════════════════════════════════════════════════════════════
// components/MarketingLanding.js
// ══════════════════════════════════════════════════════════════
// Public-facing marketing page — first thing visitors see at `/`.
//
// SECTIONS:
// 1. Hero — headline, CTA buttons, floating bubbles
// 2. How it works — 3 steps stacked + animated phone
// 3. Why we built it — 4 feature cards
// 4. Final CTA — commented out, reserved for later use
// ══════════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/components/MarketingLanding.module.scss';

// ── Constants ─────────────────────────────────────────────────

const POP = '/icons/pop';

const BUBBLE_TEXTS = [
    'Hi!', 'Howdy!', 'Ciao!', 'Hola!', 'Salut!', 'Aloha!', 'Namaste!', 'Hey!', 'Yo!', 'Wow!',
    'Wassup!', 'Hej!', 'Olá!', 'Privet!', 'Hallo!', 'Yo yo!', 'Cheers!', 'Konnichiwa', 'Kia ora', 'Salam!',
];

const FLOAT_ICONS = ['heart', 'star', 'flash', 'heart', 'star'];

const STEPS = [
    {
        icon: 'users',
        title: 'Meet Someone',
        body: 'You connect with someone. Magic moment.',
    },
    {
        icon: 'qr-code',
        title: 'Scan Their QR',
        body: 'Tap, scan, done. No screenshots, no notes.',
    },
    {
        icon: 'heart',
        title: 'Stay Connected',
        body: 'Find them again next year. Or next weekend.',
    },
];

const FEATURES = [
    {
        icon: 'chat-bubble',
        title: 'Built For Festivals',
        body: 'Designed for the chaos of dance floors, campsites, and dust storms. No signal needed, ever.',
    },
    {
        icon: 'shield-check',
        title: 'No Spam, No Creeps',
        body: 'Only people you actually meet face to face. No follower counts, no cold DMs, no algorithm.',
    },
    {
        icon: 'browser-check',
        title: 'No App To Install',
        body: "Works in any browser, on any phone. Save it to your home screen and it's there forever.",
    },
    {
        icon: 'handshake',
        title: 'Find Them Again',
        body: 'Every connection is saved locally on your device. Find them at the next burn, the next campfire, the next anything.',
    },
];

const MINI_NAV_ITEMS = [
    { id: 'profile', icon: 'user-circle' },
    { id: 'connect', icon: 'qr-code' },
    { id: 'meets',   icon: 'users' },
];

// ── Helpers ───────────────────────────────────────────────────

const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const pick = (arr, n) => shuffle(arr).slice(0, n);

// ── Custom Hooks ──────────────────────────────────────────────

const useInView = (options = {}) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        if (!ref.current || typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                obs.disconnect();
            }
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px', ...options });
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
};

// ── Sub-Components ────────────────────────────────────────────

const PopIcon = ({ name, size, alt = '' }) => (
    <img src={`${POP}/${name}.svg`} width={size} height={size} alt={alt} />
);

const MiniBottomNav = ({ active = 'meets', theme = 'light' }) => (
    <div className={`${styles.miniNav} ${theme === 'dark' ? styles.miniNavDark : ''}`}>
        {MINI_NAV_ITEMS.map(item => (
            <span
                key={item.id}
                className={`${styles.miniNavItem} ${active === item.id ? styles.miniNavActive : ''}`}
            >
                <img src={`${POP}/${item.icon}.svg`} alt="" width={20} height={20} />
            </span>
        ))}
    </div>
);

// ── Mock photo URLs ───────────────────────────────────────────

const MOCK_PHOTOS = {
    alex:  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop',
    sam:   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    jamie: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
};

// ── Phone screens ─────────────────────────────────────────────

const PhoneShowQR = () => (
    <div className={`${styles.phoneScreen} ${styles.screenShow}`}>
        <div className={styles.screenH}>Show QR</div>
        <div className={styles.qrCard}>
            <div className={styles.qrCardImg}>
                <img src="/qr.png" alt="" />
                <span className={styles.qrCardAvatarOverlay}>A</span>
            </div>
        </div>
        <div className={styles.screenLabel}>Event</div>
        <div className={styles.eventSelect}>
            <span>Burning Man</span>
            <svg className={styles.eventChevron} width="12" height="10" viewBox="0 0 16 14" fill="currentColor" aria-hidden="true">
                <path d="M2 2 L14 2 L8 12 Z" />
            </svg>
        </div>
        <MiniBottomNav active="connect" />
    </div>
);

// Scan screen — toast appears within the same frame after a delay
const PhoneScanWithToast = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastLeaving, setToastLeaving] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => setShowToast(true), 2200);      // was 1500
        const leaveTimer = setTimeout(() => setToastLeaving(true), 2200 + 2000); // leave after 2s visible
        return () => {
            clearTimeout(showTimer);
            clearTimeout(leaveTimer);
        };
    }, []);

    return (
        <div className={`${styles.phoneScreen} ${styles.screenScan}`}>
        <div className={styles.screenH} style={{ color: '#fff' }}>Scan QR</div>
            <div className={styles.viewfinder}>
                <span className={`${styles.corner} ${styles.cornerTl}`} />
                <span className={`${styles.corner} ${styles.cornerTr}`} />
                <span className={`${styles.corner} ${styles.cornerBl}`} />
                <span className={`${styles.corner} ${styles.cornerBr}`} />
                {!showToast && <span className={styles.scanLine} />}
            </div>

            <div className={styles.scanBottom}>
                <div className={styles.scanEventDropdown}>
                    <span>Burning Man</span>
                    <svg width="10" height="8" viewBox="0 0 16 14" fill="currentColor" aria-hidden="true">
                        <path d="M2 2 L14 2 L8 12 Z" />
                    </svg>
                </div>
            </div>

            {showToast && (
                <div className={`${styles.mockToast} ${toastLeaving ? styles.mockToastLeaving : ''}`}>
                    <img src={MOCK_PHOTOS.alex} alt="" className={styles.mockToastPhoto} />
                    <div className={styles.mockToastText}>
                        <div className={styles.mockToastTitle}>New Connection</div>
                        <div className={styles.mockToastName}>Alex Rivera</div>
                        <div className={styles.mockToastMeta}>Burning Man</div>
                    </div>
                </div>
            )}

            <MiniBottomNav active="connect" theme="dark" />
        </div>
    );
};

const PhoneMeets = () => (
    <div className={`${styles.phoneScreen} ${styles.screenDone}`}>
        <div className={styles.screenH }>Meets</div>
        <div className={styles.meetsList}>
            <div className={`${styles.meetEntry} ${styles.meetEntryNew}`}>
                <img src={MOCK_PHOTOS.alex} alt="" className={styles.meetAvatarPhoto} />
                <div className={styles.meetMeta}>
                    <strong>Alex Rivera</strong>
                    <span>Now · Burning Man</span>
                </div>
                <span className={styles.newDot} />
            </div>
            <div className={styles.meetEntry}>
                <img src={MOCK_PHOTOS.sam} alt="" className={styles.meetAvatarPhoto} />
                <div className={styles.meetMeta}>
                    <strong>Sam</strong>
                    <span>1d ago · Afrikaburn</span>
                </div>
            </div>
            <div className={styles.meetEntry}>
                <img src={MOCK_PHOTOS.jamie} alt="" className={styles.meetAvatarPhoto} />
                <div className={styles.meetMeta}>
                    <strong>Jamie</strong>
                    <span>2d ago · Boom</span>
                </div>
            </div>
        </div>
        <MiniBottomNav active="meets" />
    </div>
);

// ── Animated Phone ────────────────────────────────────────────
// 3 screens: ShowQR → Scan (toast appears within) → Meets
// Scan screen gets 4.5s total: 1.5s scan + 2.2s toast visible + 0.6s toast leaving + 0.2s buffer

const SCREEN_DURATIONS = [2500, 4500, 2500];

const AnimatedPhone = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const duration = SCREEN_DURATIONS[activeStep];
        const timer = setTimeout(() => {
            setFading(true);
            setTimeout(() => {
                setActiveStep(prev => (prev + 1) % SCREEN_DURATIONS.length);
                setFading(false);
            }, 300);
        }, duration);
        return () => clearTimeout(timer);
    }, [activeStep]);

    const renderScreen = () => {
        switch (activeStep) {
            case 0: return <PhoneShowQR />;
            case 1: return <PhoneScanWithToast />;
            case 2: return <PhoneMeets />;
            default: return <PhoneShowQR />;
        }
    };

    return (
        <div className={styles.animatedPhoneWrapper}>
            <div className={styles.phone}>
                <div className={styles.phoneFrame}>
                    <div className={`${styles.phoneScreenWrapper} ${fading ? styles.phoneScreenFading : ''}`}>
                        {renderScreen()}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Section Components ────────────────────────────────────────

const HeroSection = ({ heroRef, bubbles, icons, waving, onIconClick, onGetStarted, onSignIn }) => (
    <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroDecor}>
            {bubbles.map((text, i) => (
                <div key={i} className={`${styles.bubble} ${styles[`bubble${i + 1}`]}`}>{text}</div>
            ))}
            <img src={`${POP}/${icons[0]}.svg`} className={`${styles.floatHeart} ${styles.heart1}`} alt="" width={40} height={40} />
            <img src={`${POP}/${icons[1]}.svg`} className={`${styles.floatHeart} ${styles.heart2}`} alt="" width={40} height={40} />
            <img src={`${POP}/${icons[2]}.svg`} className={`${styles.floatHeart} ${styles.heart3}`} alt="" width={40} height={40} />
            <img src={`${POP}/${icons[3]}.svg`} className={`${styles.floatIcon} ${styles.cropTopRight}`} alt="" width={40} height={40} />
            <img src={`${POP}/${icons[4]}.svg`} className={`${styles.floatIcon} ${styles.cropBottomLeft}`} alt="" width={40} height={40} />
            <img src={`${POP}/${icons[5]}.svg`} className={`${styles.floatIcon} ${styles.starMid}`} alt="" width={40} height={40} />
        </div>

        <div className={styles.heroContent}>
            <button
                type="button"
                className={`${styles.appIcon} ${waving ? styles.appIconEager : ''}`}
                onClick={onIconClick}
                aria-label="We Met — say hi"
            >
                <PopIcon name="waving-hand-light" size={56} alt="" />
            </button>

            <span className={styles.kicker}>For festival people</span>
            <h1 className={styles.title}>
                Never lose<br />a connection.
            </h1>
            <p className={styles.tagline}>
                No signal? No problem. Save people you meet with a simple QR scan.
            </p>
            <div className={styles.ctaRow}>
                <button className={styles.ctaPrimary} onClick={onGetStarted}>
                    Get Started
                </button>
                <button className={styles.ctaGhost} onClick={onSignIn}>
                    Sign In
                </button>
            </div>
            <p className={styles.noAccountNote}>No account needed. Free forever.</p>
        </div>
    </section>
);

const HowItWorksSection = ({ sectionRef, inView }) => (
    <section ref={sectionRef} className={`${styles.section} ${styles.sectionFirst} ${inView ? styles.isVisible : ''}`}>
        <div className={styles.sectionDecor}>
            <img src={`${POP}/star.svg`} className={`${styles.floatIcon} ${styles.scatterStarA}`} alt="" width={36} height={36} />
            <img src={`${POP}/flash.svg`} className={`${styles.floatIcon} ${styles.cropLeftMid}`} alt="" width={36} height={36} />
        </div>

        <div className={styles.sectionHead}>
            <div className={styles.sectionLabelRow}>
                <span className={styles.sectionLabel}>How It Works</span>
            </div>
            <h2 className={styles.sectionTitle}>Three Taps.</h2>
        </div>

        <div className={styles.howItWorksLayout}>
            <ol className={styles.steps}>
                {STEPS.map((step, i) => (
                    <li key={step.title} className={styles.step}>
                        <div className={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</div>
                        <div className={styles.stepIcon}>
                            <PopIcon name={step.icon} size={40} alt="" />
                        </div>
                        <div className={styles.stepText}>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepBody}>{step.body}</p>
                        </div>
                    </li>
                ))}
            </ol>
            <AnimatedPhone />
        </div>
    </section>
);

const FeaturesSection = ({ sectionRef, inView }) => (
    <section ref={sectionRef} className={`${styles.section} ${inView ? styles.isVisible : ''}`}>
        <div className={styles.sectionDecor}>
            <img src={`${POP}/heart.svg`} className={`${styles.floatIcon} ${styles.scatterHeartB}`} alt="" width={36} height={36} />
            <img src={`${POP}/star.svg`} className={`${styles.floatIcon} ${styles.scatterStarB}`} alt="" width={36} height={36} />
        </div>

        <div className={styles.sectionHead}>
            <span className={`${styles.sectionLabel} ${styles.sectionLabelFeatures}`}>Why we built it</span>
            <h2 className={styles.sectionTitle}>Connections matter.</h2>
        </div>

        <div className={styles.features}>
            {FEATURES.map((feature) => (
                <div key={feature.title} className={styles.feature}>
                    <div className={styles.featureIcon}>
                        <PopIcon name={feature.icon} size={36} alt="" />
                    </div>
                    <div className={styles.featureText}>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureBody}>{feature.body}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

// ── Main Component ────────────────────────────────────────────

export default function MarketingLanding() {
    const router = useRouter();

    const [bubbles, setBubbles] = useState(BUBBLE_TEXTS.slice(0, 10));
    const [icons, setIcons] = useState(() => Array(6).fill('heart'));
    const [waving, setWaving] = useState(false);

    useEffect(() => {
        setBubbles(pick(BUBBLE_TEXTS, 10));
        setIcons(Array.from({ length: 6 }, () => FLOAT_ICONS[Math.floor(Math.random() * FLOAT_ICONS.length)]));

        const tag = 'background:#F5722F;color:#FFE066;padding:6px 12px;border-radius:6px;font-family:ui-monospace,monospace;font-weight:600;';
        const sub = 'color:#0C098C;font-family:ui-monospace,monospace;font-size:11px;';
        console.log('%c👋 Hey, festival people.', tag);
        console.log('%cBuilt for the kind of people who hug strangers and mean it.', sub);
    }, []);

    // Scroll parallax on hero decorations
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let raf = 0;
        const apply = () => {
            document.documentElement.style.setProperty('--scroll-y', String(window.scrollY));
            raf = 0;
        };
        const onScroll = () => { if (!raf) raf = window.requestAnimationFrame(apply); };
        window.addEventListener('scroll', onScroll, { passive: true });
        apply();
        return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
    }, []);

    // Mouse parallax on hero
    const heroRef = useRef(null);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(hover: none)').matches) return;
        const hero = heroRef.current;
        if (!hero) return;

        let raf = 0, targetX = 0, targetY = 0, currentX = 0, currentY = 0;

        const tick = () => {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;
            hero.style.setProperty('--mx', currentX.toFixed(4));
            hero.style.setProperty('--my', currentY.toFixed(4));
            const settled = Math.abs(targetX - currentX) < 0.001 && Math.abs(targetY - currentY) < 0.001;
            raf = settled ? 0 : requestAnimationFrame(tick);
        };

        const onMove = (e) => {
            const rect = hero.getBoundingClientRect();
            targetX = (e.clientX - rect.left) / rect.width - 0.5;
            targetY = (e.clientY - rect.top) / rect.height - 0.5;
            if (!raf) raf = requestAnimationFrame(tick);
        };

        const onLeave = () => {
            targetX = 0; targetY = 0;
            if (!raf) raf = requestAnimationFrame(tick);
        };

        hero.addEventListener('mousemove', onMove);
        hero.addEventListener('mouseleave', onLeave);
        return () => {
            hero.removeEventListener('mousemove', onMove);
            hero.removeEventListener('mouseleave', onLeave);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const handleIconClick = () => {
        if (waving) return;
        setWaving(true);
        setTimeout(() => setWaving(false), 1200);
    };

    const handleGetStarted = () => router.push('/profile?from=landing');
    const handleSignIn = () => router.push('/auth');

    const [stepsRef, stepsInView] = useInView();
    const [featuresRef, featuresInView] = useInView();

    return (
        <main className={styles.page}>
            <HeroSection
                heroRef={heroRef}
                bubbles={bubbles}
                icons={icons}
                waving={waving}
                onIconClick={handleIconClick}
                onGetStarted={handleGetStarted}
                onSignIn={handleSignIn}
            />

            <HowItWorksSection sectionRef={stepsRef} inView={stepsInView} />

            <FeaturesSection sectionRef={featuresRef} inView={featuresInView} />

            {/* ── Final CTA ─────────────────────────────────────────
                Commented out — keeping for potential future use.
                Consider using on a dedicated /about or /press page.
            ─────────────────────────────────────────────────────── */}
            {/* <FinalCtaSection onGetStarted={handleGetStarted} /> */}
        </main>
    );
}