import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function Meets() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [installPrompt, setInstallPrompt] = useState(null)
    const [showInstallBanner, setShowInstallBanner] = useState(false)

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault()
            setInstallPrompt(e)
            setShowInstallBanner(true)
        }
        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstall = async () => {
        if (!installPrompt) return
        installPrompt.prompt()
        const { outcome } = await installPrompt.userChoice
        if (outcome === 'accepted') {
            setShowInstallBanner(false)
        }
        setInstallPrompt(null)
    }

    if (loading) return <div style={{ minHeight: '100vh', background: '#fdf6e3' }} />

    return (
        <div style={{ padding: '2rem', minHeight: '100vh' }}>

            {!user && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.5rem',
                    backgroundColor: '#fff',
                    border: '2px solid black',
                    borderRadius: '2px',
                    boxShadow: '3px 3px 0px rgba(0,0,0,0.15)',
                    fontFamily: 'monospace',
                }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                        ⚠️ Not synced — connections only saved on this device
                    </span>
                    <button
                        onClick={() => router.push('/auth')}
                        style={{
                            marginLeft: '1rem',
                            padding: '0.375rem 0.75rem',
                            backgroundColor: '#F5722F',
                            color: 'white',
                            border: '2px solid black',
                            borderRadius: '2px',
                            fontFamily: 'monospace',
                            fontWeight: '900',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}>
                        Sync
                    </button>
                </div>
            )}

            {showInstallBanner && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.5rem',
                    backgroundColor: '#fff',
                    border: '2px solid black',
                    borderRadius: '2px',
                    boxShadow: '3px 3px 0px rgba(0,0,0,0.15)',
                    fontFamily: 'monospace',
                }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                        📲 Add We Met to your home screen
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                        <button
                            onClick={handleInstall}
                            style={{
                                padding: '0.375rem 0.75rem',
                                backgroundColor: '#F5722F',
                                color: 'white',
                                border: '2px solid black',
                                borderRadius: '2px',
                                fontFamily: 'monospace',
                                fontWeight: '900',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}>
                            Install
                        </button>
                        <button
                            onClick={() => setShowInstallBanner(false)}
                            style={{
                                padding: '0.375rem 0.5rem',
                                backgroundColor: 'transparent',
                                color: 'black',
                                border: '2px solid black',
                                borderRadius: '2px',
                                fontFamily: 'monospace',
                                fontWeight: '900',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                            }}>
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <h1>Meets</h1>
            <p>Coming soon...</p>
        </div>
    )
}