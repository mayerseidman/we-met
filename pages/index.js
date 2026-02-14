import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStorage } from '../hooks/useStorage';

export default function HomePage() {
    const router = useRouter();
    const { profile, isReady } = useStorage(); // isReady already exists!
    
    console.log("PROFILE:", profile, "isReady:", isReady);
    
    useEffect(() => {
        // Don't redirect until storage is ready
        if (!isReady) return;
        
        // Once ready, redirect based on profile
        if (profile) {
            router.push('/meets');
        } else {
            router.push('/landing');
        }
    }, [profile, isReady, router]);
    
    // Show loading screen while checking
    if (!isReady) {
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#FFEFD7'
            }}>
                {/* Optional: add loading spinner or logo */}
            </div>
        );
    }
    
    return null;
}