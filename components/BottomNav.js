import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/components/BottomNav.module.scss';

// Constants
const NAV_ITEMS = [
    {
        href: '/profile',
        label: 'PROFILE',
        activeRoutes: ['/profile'],
        activeColor: '#FF6B35',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12.1597 16C10.1243 16 8.29182 16.8687 7.01276 18.2556C8.38039 19.3474 10.114 20 12 20C13.9695 20 15.7727 19.2883 17.1666 18.1081C15.8956 16.8074 14.1219 16 12.1597 16ZM12 4C7.58172 4 4 7.58172 4 12C4 13.8106 4.6015 15.4807 5.61557 16.8214C7.25639 15.0841 9.58144 14 12.1597 14C14.6441 14 16.8933 15.0066 18.5218 16.6342C19.4526 15.3267 20 13.7273 20 12C20 7.58172 16.4183 4 12 4ZM12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5ZM12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7Z"></path>
            </svg>
        ),
    },
    {
        href: '/connect',
        label: 'CONNECT',
        activeRoutes: ['/connect', '/scan'],
        activeColor: '#FF6B35',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.8611 2.39057C12.8495 1.73163 14.1336 1.71797 15.1358 2.35573L19.291 4.99994H20.9998C21.5521 4.99994 21.9998 5.44766 21.9998 5.99994V14.9999C21.9998 15.5522 21.5521 15.9999 20.9998 15.9999H19.4801C19.5396 16.9472 19.0933 17.9102 18.1955 18.4489L13.1021 21.505C12.4591 21.8907 11.6609 21.8817 11.0314 21.4974C10.3311 22.1167 9.2531 22.1849 8.47104 21.5704L3.33028 17.5312C2.56387 16.9291 2.37006 15.9003 2.76579 15.0847C2.28248 14.7057 2 14.1254 2 13.5109V6C2 5.44772 2.44772 5 3 5H7.94693L11.8611 2.39057ZM4.17264 13.6452L4.86467 13.0397C6.09488 11.9632 7.96042 12.0698 9.06001 13.2794L11.7622 16.2518C12.6317 17.2083 12.7903 18.6135 12.1579 19.739L17.1665 16.7339C17.4479 16.5651 17.5497 16.2276 17.4448 15.9433L13.0177 9.74551C12.769 9.39736 12.3264 9.24598 11.9166 9.36892L9.43135 10.1145C8.37425 10.4316 7.22838 10.1427 6.44799 9.36235L6.15522 9.06958C5.58721 8.50157 5.44032 7.69318 5.67935 7H4V13.5109L4.17264 13.6452ZM14.0621 4.04306C13.728 3.83047 13.3 3.83502 12.9705 4.05467L7.56943 7.65537L7.8622 7.94814C8.12233 8.20827 8.50429 8.30456 8.85666 8.19885L11.3419 7.45327C12.5713 7.08445 13.8992 7.53859 14.6452 8.58303L18.5144 13.9999H19.9998V6.99994H19.291C18.9106 6.99994 18.5381 6.89148 18.2172 6.68727L14.0621 4.04306ZM6.18168 14.5448L4.56593 15.9586L9.70669 19.9978L10.4106 18.7659C10.6256 18.3897 10.5738 17.9178 10.2823 17.5971L7.58013 14.6247C7.2136 14.2215 6.59175 14.186 6.18168 14.5448Z"></path>
            </svg>
        ),
    },
    {
        href: '/meets',
        label: 'MEETS',
        activeRoutes: ['/', '/meets'],
        activeColor: '#FF6B35',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.5271L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.264 19 8.5C19 7.11935 18.2016 5.92603 17.041 5.35635L17.5962 3.41321Z"></path>
            </svg>
        ),
    },
];

// Component: Nav Item
const NavItem = React.memo(({ href, icon, label, isActive, activeColor }) => {
    const router = useRouter();
    const itemClass = `${ styles.navItem } ${isActive ? styles.active : styles.inactive }`;
    
    const handleClick = (e) => {
        e.preventDefault();
        router.push(href);
    };
    
    return (
        <a 
            href={ href } 
            onClick={ handleClick } 
            className={ itemClass }
            style={{ '--active-color': activeColor }}
        >
            { icon }
            <span className={ styles.label }>{ label }</span>
        </a>
    );
});

// Helper: Check if route is active
const isRouteActive = (pathname, activeRoutes) => {
    return activeRoutes.includes(pathname);
};

const SCROLL_THRESHOLD = {
    SHOW: 10,
    HIDE: 50,
};

// Hook: Scroll visibility
const useScrollVisibility = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let lastY = 0;
        let ticking = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Show when scrolling up or at top
                    if (currentScrollY < lastY || currentScrollY < SCROLL_THRESHOLD.SHOW) {
                        setIsVisible(true);
                    } 
                    // Hide when scrolling down past threshold
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

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return isVisible;
};

// Main Component
export default function BottomNav() {
    const router = useRouter();
    const isVisible = useScrollVisibility();

    return (
        <nav className={ `${ styles.nav } ${ isVisible ? styles.visible : styles.hidden }` }>
            {NAV_ITEMS.map((item) => (
                <NavItem
                    key={ item.href }
                    href={ item.href }
                    icon={ item.icon }
                    label={ item.label }
                    activeColor={ item.activeColor }
                    isActive={ isRouteActive(router.pathname, item.activeRoutes)}
                />
            ))}
        </nav>
    );
}