import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStorage } from '../hooks/useStorage';

export default function HomePage() {
    const router = useRouter();
    const { profile } = useStorage();
    
    useEffect(() => {
        // If profile exists, go to meets, if no profile, go to landing
        if (!profile) {
            router.push('/meets');
        } else {
            router.push('/landing');
        }
    }, [profile, router]);
    
    return null; // Just a redirect page
}