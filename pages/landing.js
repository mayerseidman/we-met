// pages/landing.js - Refactored with proper structure
import { useRouter } from 'next/router';
import React from 'react';
import styles from '../styles/pages/Landing.module.scss';

// ==================
// CONSTANTS
// ==================
const CONTENT = {
    heading: 'We Met',
    subtitle: 'Never lose a connection. Save everyone you meet at festivals and keep the magic alive!',
    ctaText: 'GET STARTED!',
};

const FEATURES = [
    {
        id: 'qr-profiles',
        icon: '📱',
        text: 'QR code profiles',
    },
    {
        id: 'instant-connections',
        icon: '⚡',
        text: 'Instant connections',
    },
    {
        id: 'never-lose-touch',
        icon: '🔥',
        text: 'Never lose touch',
    },
];

const CIRCLES = [
    { id: 'circle1', className: styles.circle1 },
    { id: 'circle2', className: styles.circle2 },
    { id: 'circle3', className: styles.circle3 },
];

// ==================
// COMPONENTS
// ==================

// Decorative Circle Component
const Circle = React.memo(({ className }) => (
    <div className={`${styles.circle} ${className}`} />
));

Circle.displayName = 'Circle';

// Feature Item Component
const FeatureItem = React.memo(({ icon, text }) => (
    <div className={styles.feature}>
        <span className={styles.featureIcon}>{icon}</span>
        <span>{text}</span>
    </div>
));

FeatureItem.displayName = 'FeatureItem';

// Features List Component
const FeaturesList = React.memo(() => (
    <div className={styles.features}>
        {FEATURES.map((feature) => (
            <FeatureItem
                key={feature.id}
                icon={feature.icon}
                text={feature.text}
            />
        ))}
    </div>
));

FeaturesList.displayName = 'FeaturesList';

// ==================
// MAIN COMPONENT
// ==================
export default function Landing() {
    const router = useRouter();

    const handleGetStarted = () => {
        localStorage.setItem('hasVisited', 'true');
        router.push('/profile');
    };

    return (
        <div className={styles.container}>
            {/* Decorative circles */}
            {CIRCLES.map((circle) => (
                <Circle key={circle.id} className={circle.className} />
            ))}

            {/* Main content */}
            <div className={styles.content}>
                <h1 className={styles.heading}>{CONTENT.heading}</h1>
                
                <p className={styles.subtitle}>{CONTENT.subtitle}</p>

                <button 
                    className={styles.ctaButton} 
                    onClick={handleGetStarted}
                >
                    {CONTENT.ctaText}
                </button>

                <FeaturesList />
            </div>
        </div>
    );
}