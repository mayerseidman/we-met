import { useState, useEffect } from 'react';
import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/components/BottomNav.module.scss';

// ══════════════════════════════════════════════════════════════
// BottomNav Component
// ══════════════════════════════════════════════════════════════

// ── Icons (inline SVG using currentColor) ─────────────────────

const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width="30" height="30">
        <path fill="currentColor" fillRule="evenodd" d="M7.00018 0.000488281C3.13436 0.000488281 0.000488281 3.13436 0.000488281 7.00018c0 3.86582 3.133871719 6.99972 6.999691719 6.99972 3.86582 0 6.99972 -3.1339 6.99972 -6.99972S10.866 0.000488281 7.00018 0.000488281ZM1.25049 7.00018c0 -3.17547 2.57422 -5.74969 5.74969 -5.74969 3.17542 0 5.74972 2.57422 5.74972 5.74969 0 1.70375 -0.7411 3.23442 -1.9184 4.28732C9.91429 10.1947 8.53824 9.5 6.99994 9.5c-1.53818 0 -2.91414 0.6946 -3.83133 1.7872 -1.17719 -1.0528 -1.91812 -2.5834 -1.91812 -4.28702ZM3.875 5.75c0 -1.72589 1.39911 -3.125 3.125 -3.125s3.125 1.39911 3.125 3.125S8.72589 8.875 7 8.875 3.875 7.47589 3.875 5.75Z" clipRule="evenodd"/>
    </svg>
);

// const ConnectIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width="30" height="30">
//         <path fill="currentColor" fillRule="evenodd" d="M1.73483 1.73483C1.80516 1.66451 1.90054 1.625 2 1.625h2c0.34518 0 0.625 -0.27982 0.625 -0.625 0 -0.345178 -0.27982 -0.625 -0.625 -0.625H2c-0.43098 0 -0.8443 0.171205 -1.149049 0.475951C0.546205 1.1557 0.375 1.56902 0.375 2v2c0 0.34518 0.279822 0.625 0.625 0.625 0.34518 0 0.625 -0.27982 0.625 -0.625V2c0 -0.09946 0.03951 -0.19484 0.10983 -0.26517ZM9.375 1c0 -0.345178 0.27982 -0.625 0.625 -0.625h2c0.431 0 0.8443 0.171205 1.149 0.475951 0.3048 0.304749 0.476 0.718069 0.476 1.149049v2c0 0.34518 -0.2798 0.625 -0.625 0.625s-0.625 -0.27982 -0.625 -0.625V2c0 -0.09946 -0.0395 -0.19484 -0.1098 -0.26517 -0.0704 -0.07032 -0.1657 -0.10983 -0.2652 -0.10983h-2c-0.34518 0 -0.625 -0.27982 -0.625 -0.625ZM2.5 4c0 -0.82843 0.67157 -1.5 1.5 -1.5h2c0.82843 0 1.5 0.67157 1.5 1.5v2c0 0.82843 -0.67157 1.5 -1.5 1.5H4c-0.82843 0 -1.5 -0.67157 -1.5 -1.5V4Zm1.25 5.375c0 -0.34518 -0.27982 -0.625 -0.625 -0.625s-0.625 0.27982 -0.625 0.625v1.5c0 0.3452 0.27982 0.625 0.625 0.625h1.5c0.34518 0 0.625 -0.2798 0.625 -0.625s-0.27982 -0.625 -0.625 -0.625H3.75v-0.875ZM5 9.25c0 -0.34518 0.27982 -0.625 0.625 -0.625h1.5c0.34518 0 0.625 0.27982 0.625 0.625v1.5c0 0.3452 -0.27982 0.625 -0.625 0.625s-0.625 -0.2798 -0.625 -0.625v-0.875h-0.875C5.27982 9.875 5 9.59518 5 9.25Zm5 -6.125c0 -0.34518 -0.27982 -0.625 -0.625 -0.625s-0.625 0.27982 -0.625 0.625v1.5c0 0.34518 0.27982 0.625 0.625 0.625h1.5c0.3452 0 0.625 -0.27982 0.625 -0.625S11.2202 4 10.875 4H10v-0.875Zm-1.25 3.5c0 -0.34518 0.27982 -0.625 0.625 -0.625h1.5c0.3452 0 0.625 0.27982 0.625 0.625v1.5c0 0.34518 -0.2798 0.625 -0.625 0.625s-0.625 -0.27982 -0.625 -0.625V7.25h-0.875c-0.34518 0 -0.625 -0.27982 -0.625 -0.625ZM10 9.375c0 -0.34518 -0.27982 -0.625 -0.625 -0.625s-0.625 0.27982 -0.625 0.625v1.5c0 0.3452 0.27982 0.625 0.625 0.625h1.5c0.3452 0 0.625 -0.2798 0.625 -0.625s-0.2798 -0.625 -0.625 -0.625H10v-0.875Zm3 0c0.3452 0 0.625 0.27982 0.625 0.625v2c0 0.431 -0.1712 0.8443 -0.476 1.149 -0.3047 0.3048 -0.718 0.476 -1.149 0.476h-2c-0.34518 0 -0.625 -0.2798 -0.625 -0.625s0.27982 -0.625 0.625 -0.625h2c0.0995 0 0.1948 -0.0395 0.2652 -0.1098 0.0703 -0.0704 0.1098 -0.1657 0.1098 -0.2652v-2c0 -0.34518 0.2798 -0.625 0.625 -0.625ZM1.625 10c0 -0.34518 -0.27982 -0.625 -0.625 -0.625 -0.345178 0 -0.625 0.27982 -0.625 0.625v2c0 0.431 0.171205 0.8443 0.475951 1.149 0.304749 0.3048 0.718069 0.476 1.149049 0.476h2c0.34518 0 0.625 -0.2798 0.625 -0.625s-0.27982 -0.625 -0.625 -0.625H2c-0.09946 0 -0.19484 -0.0395 -0.26517 -0.1098 -0.07032 -0.0704 -0.10983 -0.1657 -0.10983 -0.2652v-2Z" clipRule="evenodd"/>
//     </svg>
// );

const ConnectIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8611 2.39057C12.8495 1.73163 14.1336 1.71797 15.1358 2.35573L19.291 4.99994H20.9998C21.5521 4.99994 21.9998 5.44766 21.9998 5.99994V14.9999C21.9998 15.5522 21.5521 15.9999 20.9998 15.9999H19.4801C19.5396 16.9472 19.0933 17.9102 18.1955 18.4489L13.1021 21.505C12.4591 21.8907 11.6609 21.8817 11.0314 21.4974C10.3311 22.1167 9.2531 22.1849 8.47104 21.5704L3.33028 17.5312C2.56387 16.9291 2.37006 15.9003 2.76579 15.0847C2.28248 14.7057 2 14.1254 2 13.5109V6C2 5.44772 2.44772 5 3 5H7.94693L11.8611 2.39057ZM4.17264 13.6452L4.86467 13.0397C6.09488 11.9632 7.96042 12.0698 9.06001 13.2794L11.7622 16.2518C12.6317 17.2083 12.7903 18.6135 12.1579 19.739L17.1665 16.7339C17.4479 16.5651 17.5497 16.2276 17.4448 15.9433L13.0177 9.74551C12.769 9.39736 12.3264 9.24598 11.9166 9.36892L9.43135 10.1145C8.37425 10.4316 7.22838 10.1427 6.44799 9.36235L6.15522 9.06958C5.58721 8.50157 5.44032 7.69318 5.67935 7H4V13.5109L4.17264 13.6452ZM14.0621 4.04306C13.728 3.83047 13.3 3.83502 12.9705 4.05467L7.56943 7.65537L7.8622 7.94814C8.12233 8.20827 8.50429 8.30456 8.85666 8.19885L11.3419 7.45327C12.5713 7.08445 13.8992 7.53859 14.6452 8.58303L18.5144 13.9999H19.9998V6.99994H19.291C18.9106 6.99994 18.5381 6.89148 18.2172 6.68727L14.0621 4.04306ZM6.18168 14.5448L4.56593 15.9586L9.70669 19.9978L10.4106 18.7659C10.6256 18.3897 10.5738 17.9178 10.2823 17.5971L7.58013 14.6247C7.2136 14.2215 6.59175 14.186 6.18168 14.5448Z"></path></svg>
);

const MeetsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width="30" height="30">
        <path fill="currentColor" fillRule="evenodd" d="M8.26489 6.02111c0.53908 -0.69714 0.85984 -1.57167 0.85984 -2.52111 0 -0.94944 -0.32076 -1.82397 -0.85984 -2.521112C8.49771 0.911256 8.74388 0.875 8.99851 0.875c1.44979 0 2.62499 1.17525 2.62499 2.625s-1.1752 2.625 -2.62499 2.625c-0.25463 0 -0.5008 -0.03626 -0.73362 -0.10389ZM11.4079 13.003c0.0607 -0.1976 0.0934 -0.4075 0.0934 -0.625v-0.4755c0 -1.98357 -0.9063 -3.73383 -2.31691 -4.90113 2.66391 0.0956 4.81571 2.24088 4.81571 4.90113v0.4755c0 0.3452 -0.2798 0.625 -0.625 0.625h-1.9672Zm-2.65942 -1.25C8.66812 9.81599 7.03327 8.24805 5.0003 8.24805S1.33249 9.81599 1.25212 11.753h7.49636Zm-8.749456562 0.1495c0 -2.72176 2.252406562 -4.90445 5.001276562 -4.90445 2.74888 0 5.0013 2.18269 5.0013 4.90445v0.4755c0 0.3452 -0.27984 0.625 -0.62502 0.625H0.624023c-0.345178 0 -0.624999562 -0.2798 -0.624999562 -0.625v-0.4755ZM3.625 3.5c0 -0.75939 0.61561 -1.375 1.375 -1.375s1.375 0.61561 1.375 1.375S5.75939 4.875 5 4.875 3.625 4.25939 3.625 3.5ZM5 0.875C3.55025 0.875 2.375 2.05025 2.375 3.5S3.55025 6.125 5 6.125 7.625 4.94975 7.625 3.5 6.44975 0.875 5 0.875Z" clipRule="evenodd"/>
    </svg>
);

// ── Constants ─────────────────────────────────────────────────

const NAV_ITEMS = [
    {
        href: '/profile',
        label: 'PROFILE',
        activeRoutes: ['/profile'],
        icon: <ProfileIcon />,
    },
    {
        id: 'connect',
        label: 'CONNECT',
        activeRoutes: ['/connect', '/scan'],
        icon: <ConnectIcon />,
    },
    {
        href: '/meets',
        label: 'MEETS',
        activeRoutes: ['/', '/meets'],
        icon: <MeetsIcon />,
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
                    } else if (currentScrollY > lastY && currentScrollY > SCROLL_THRESHOLD.HIDE) {
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

const NavItem = React.memo(({ item, isActive, isNavHovered, onConnectClick }) => {
    const router = useRouter();

    // When nav is hovered, active item looks inactive — all items use inactive style
    // When nav is not hovered, active item shows as active
    const itemClass = `${styles.navItem} ${isActive && !isNavHovered ? styles.active : styles.inactive}`;

    const handleClick = (e) => {
        e.preventDefault();
        if (item.id === 'connect') {
            onConnectClick();
        } else if (item.href === '/profile' && router.pathname === '/profile') {
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
    const [isNavHovered, setIsNavHovered] = useState(false);

    return (
        <nav
            className={`${styles.nav} ${isVisible ? styles.visible : styles.hidden} ${isHidden ? styles.slideOut : ''}`}
            onMouseEnter={() => setIsNavHovered(true)}
            onMouseLeave={() => setIsNavHovered(false)}
        >
            {NAV_ITEMS.map((item) => (
                <NavItem
                    key={item.id || item.href}
                    item={item}
                    isActive={isRouteActive(router.pathname, item.activeRoutes)}
                    isNavHovered={isNavHovered}
                    onConnectClick={onConnectClick}
                />
            ))}
        </nav>
    );
}