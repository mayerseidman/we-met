import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/components/BottomNav.module.scss';

// ══════════════════════════════════════════════════════════════
// BottomNav Component
// ══════════════════════════════════════════════════════════════

// ── Constants ─────────────────────────────────────────────────

const POP = '/icons/pop';

const NavIcon = ({ name }) => (
    <img src={`${POP}/${name}.svg`} alt="" width={30} height={30} />
);

const NAV_ITEMS = [
    {
        href: '/profile',
        label: 'PROFILE',
        activeRoutes: ['/profile'],
        activeColor: '#FF6B35',
        icon: <NavIcon name="user-circle" />,
    },
    {
        id: 'connect',
        label: 'CONNECT',
        activeRoutes: ['/connect', '/scan'],
        activeColor: '#FF6B35',
        icon: <NavIcon name="qr-code" />,
    },
    {
        href: '/meets',
        label: 'MEETS',
        activeRoutes: ['/', '/meets'],
        activeColor: '#FF6B35',
        icon: <NavIcon name="users" />,
    },
];

const SCROLL_THRESHOLD = {
    SHOW: 10,
    HIDE: 50,
};

// ── Helper Functions ──────────────────────────────────────────

const isRouteActive = (pathname, activeRoutes) => {
    return activeRoutes.includes(pathname);
};

// ── Custom Hooks ──────────────────────────────────────────────

const useScrollVisibility = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let lastY = 0;
        let ticking = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (currentScrollY < lastY || currentScrollY < SCROLL_THRESHOLD.SHOW) {
                        setIsVisible(true);
                    } 
                    else if (currentScrollY > lastY && currentScrollY > SCROLL_THRESHOLD.HIDE) {
                        setIsVisible(false);
                    }

                    lastY = currentScrollY;
                    ticking = false;
                });

                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return isVisible;
};

// ── Sub-Components ────────────────────────────────────────────

const NavItem = React.memo(({ item, isActive, activeColor, onConnectClick }) => {
    const router = useRouter();
    const itemClass = `${styles.navItem} ${isActive ? styles.active : styles.inactive}`;
    
    const handleClick = (e) => {
        e.preventDefault();
        
        if (item.id === 'connect') {
            onConnectClick();
        } else if (item.href === '/profile' && router.pathname === '/profile') {
            // Trigger custom event to tell Profile page to switch to view mode
            window.dispatchEvent(new CustomEvent('profileViewRequest'));
        } else if (item.href) {
            router.push(item.href);
        }
    };
    
    return (
        <a 
            href={item.href || '#'} 
            onClick={handleClick} 
            className={itemClass}
            style={{ '--active-color': activeColor }}
        >
            {item.icon}
            <span className={styles.label}>{item.label}</span>
        </a>
    );
});

NavItem.displayName = 'NavItem';

// ── Main Component ────────────────────────────────────────────

export default function BottomNav({ onConnectClick, isHidden }) {
    const router = useRouter();
    const isVisible = useScrollVisibility();


    return (
        <nav className={`${styles.nav} ${isVisible ? styles.visible : styles.hidden} ${isHidden ? styles.slideOut : ''}`}>
            {NAV_ITEMS.map((item) => (
                <NavItem
                    key={item.id || item.href}
                    item={item}
                    activeColor={item.activeColor}
                    isActive={isRouteActive(router.pathname, item.activeRoutes)}
                    onConnectClick={onConnectClick}
                />
            ))}
        </nav>
    );
}