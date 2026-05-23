import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useStorage } from '../hooks/useStorage'
import Avatar from '../components/Avatar'
import styles from '../styles/pages/Meets.module.scss'

export default function Meets() {
    const { user, loading } = useAuth()
    const { connections, isReady } = useStorage()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [installPrompt, setInstallPrompt] = useState(null)
    const [showInstallBanner, setShowInstallBanner] = useState(false)
    const [selectedConn, setSelectedConn] = useState(null)
    const [copyFeedback, setCopyFeedback] = useState(null)

    useEffect(() => { setMounted(true) }, [])

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
        if (outcome === 'accepted') setShowInstallBanner(false)
        setInstallPrompt(null)
    }

    const formatTime = (scannedAt) => {
        if (!scannedAt) return ''
        const date = new Date(scannedAt)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)
        if (diffMins < 1) return 'just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        return `${diffDays}d ago`
    }

    const formatTimeShort = (scannedAt) => {
        if (!scannedAt) return ''
        const date = new Date(scannedAt)
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    }

    const formatDateLabel = (scannedAt) => {
        if (!scannedAt) return 'Unknown'
        const date = new Date(scannedAt)
        const now = new Date()
        const diffDays = Math.floor((now - date) / 86400000)
        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
    }

    const groupByDate = (conns) => {
        const groups = {}
        conns.forEach(conn => {
            const label = formatDateLabel(conn.scannedAt)
            if (!groups[label]) groups[label] = []
            groups[label].push(conn)
        })
        return groups
    }

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyFeedback(field)
            setTimeout(() => setCopyFeedback(null), 2000)
        })
    }

    if (!mounted || loading || !isReady) return <div className={styles.loading} />

    if (selectedConn) {
        return (
            <div className={styles.page}>
                <DetailView
                    conn={selectedConn}
                    onBack={() => setSelectedConn(null)}
                    formatTime={formatTime}
                    handleCopy={handleCopy}
                    copyFeedback={copyFeedback}
                />
            </div>
        )
    }

    const grouped = groupByDate(connections)

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Meets {connections.length > 0 && `(${connections.length})`}
                </h1>
                {user && connections.length > 0 && (
                    <div className={styles.meta}>
                        <span className={styles.metaItem}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                            Synced
                        </span>
                    </div>
                )}
            </div>

            {!user && (
                <div className={styles.banner}>
                    <span className={styles.bannerText}>⚠️ Not synced — saved on this device only</span>
                    <button className={styles.bannerBtn} onClick={() => router.push('/auth')}>Sync</button>
                </div>
            )}

            {showInstallBanner && (
                <div className={styles.banner}>
                    <span className={styles.bannerText}>📲 Add We Met to your home screen</span>
                    <div className={styles.bannerActions}>
                        <button className={styles.bannerBtn} onClick={handleInstall}>Install</button>
                        <button className={styles.bannerClose} onClick={() => setShowInstallBanner(false)}>✕</button>
                    </div>
                </div>
            )}

            {connections.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🤝</div>
                    <div className={styles.emptyTitle}>No meets yet</div>
                    <div className={styles.emptyText}>Scan someone&apos;s QR to get started!</div>
                </div>
            ) : (
                <div className={styles.list}>
                    {Object.entries(grouped).map(([dateLabel, conns]) => (
                        <div key={dateLabel} className={styles.group}>
                            <div className={styles.groupLabel}>{dateLabel}</div>
                            {conns.map((conn, i) => (
                                <button
                                    key={i}
                                    className={styles.card}
                                    onClick={() => setSelectedConn(conn)}
                                >
                                    <Avatar src={conn.photo} name={conn.name} size={44} />
                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardName}>{conn.name}</div>
                                        <div className={styles.cardMeta}>
                                            <span>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                {formatTimeShort(conn.scannedAt)}
                                            </span>
                                            {conn.event && conn.event !== 'Unknown' && (
                                                <span>
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                                    {conn.event.length > 14 ? conn.event.slice(0, 14) + '…' : conn.event}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <svg className={styles.chevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function DetailView({ conn, onBack, formatTime, handleCopy, copyFeedback }) {
    return (
        <div className={styles.detail}>
            <button className={styles.backBtn} onClick={onBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                Back
            </button>

            <div className={styles.detailTop}>
                <Avatar src={conn.photo} name={conn.name} size={90} />
                <h2 className={styles.detailName}>{conn.name}</h2>
                <div className={styles.detailPill}>
                    <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {formatTime(conn.scannedAt)}
                    </span>
                    {conn.event && conn.event !== 'Unknown' && (
                        <span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {conn.event}
                        </span>
                    )}
                </div>
            </div>

            {conn.about && (
                <div className={styles.detailSection}>
                    <div className={styles.detailSectionLabel}>About</div>
                    <div className={styles.detailAbout}>{conn.about}</div>
                </div>
            )}

            {(conn.phone || conn.instagram) && (
                <div className={styles.detailSection}>
                    <div className={styles.detailSectionLabel}>Contact</div>
                    {conn.phone && (
                        <div className={styles.contactRow}>
                            <div className={styles.contactIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.82 5.82l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            </div>
                            <span className={styles.contactText}>{conn.phone}</span>
                            <button
                                className={`${styles.contactBtn} ${copyFeedback === 'phone' ? styles.contactBtnCopied : ''}`}
                                onClick={() => handleCopy(conn.phone, 'phone')}
                            >
                                {copyFeedback === 'phone' ? (
                                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Copied</>
                                ) : (
                                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                                )}
                            </button>
                        </div>
                    )}
                    {conn.instagram && (
                        <div className={styles.contactRow}>
                            <div className={styles.contactIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                            </div>
                            <span className={styles.contactText}>@{conn.instagram}</span>
                            <button
                                className={styles.contactBtn}
                                onClick={() => window.open(`https://instagram.com/${conn.instagram}`, '_blank')}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                View
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}