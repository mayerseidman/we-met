import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import { useStorage } from '../hooks/useStorage'
import Avatar from '../components/Avatar'
import MeetsFilterPanel from '../components/MeetsFilterPanel'
import styles from '../styles/pages/Meets.module.scss'

const POP = '/icons/pop'

// ── Time period filtering helpers ───────────────────────────────
function isInTimePeriod(scannedAt, timePeriod) {
    if (timePeriod === 'all' || !scannedAt) return true
    const date = new Date(scannedAt)
    const now = new Date()

    if (timePeriod === 'thisMonth') {
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
    }
    if (timePeriod === 'lastMonth') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        return date.getFullYear() === lastMonth.getFullYear() && date.getMonth() === lastMonth.getMonth()
    }
    if (timePeriod === 'thisYear') {
        return date.getFullYear() === now.getFullYear()
    }
    return true
}

function formatRelativeSync(syncedAt) {
    if (!syncedAt) return null
    const diffMs = Date.now() - new Date(syncedAt).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 30) return `${diffDays}d ago`
    return new Date(syncedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function Meets() {
    const { user, loading } = useAuth()
    const { connections, isReady } = useStorage()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [installPrompt, setInstallPrompt] = useState(null)
    const [showInstallBanner, setShowInstallBanner] = useState(false)
    const [selectedConn, setSelectedConn] = useState(null)
    const [copyFeedback, setCopyFeedback] = useState(null)
    const [isMobile, setIsMobile] = useState(false)

    // Search + filters
    const [searchQuery, setSearchQuery] = useState('')
    const [showFilterPanel, setShowFilterPanel] = useState(false)
    const [filters, setFilters] = useState({ festival: 'all', timePeriod: 'all' })

    // Placeholder until real sync timestamp is wired up from backend
    const lastSyncedAt = user ? new Date().toISOString() : null

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

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

    // ── Apply search + filters ──────────────────────────────────
    const filteredConnections = useMemo(() => {
        let result = connections

        if (filters.festival !== 'all') {
            result = result.filter(c => c.event === filters.festival)
        }
        if (filters.timePeriod !== 'all') {
            result = result.filter(c => isInTimePeriod(c.scannedAt, filters.timePeriod))
        }
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase()
            result = result.filter(c =>
                (c.name && c.name.toLowerCase().includes(q)) ||
                (c.event && c.event.toLowerCase().includes(q))
            )
        }
        return result
    }, [connections, filters, searchQuery])

    const activeFilterCount = (filters.festival !== 'all' ? 1 : 0) + (filters.timePeriod !== 'all' ? 1 : 0)
    const isFiltering = activeFilterCount > 0 || searchQuery.trim().length > 0

    if (!mounted || loading || !isReady) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.loadingSpinner} />
                <div className={styles.loadingText}>Loading Meets...</div>
            </div>
        )
    }

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

    const grouped = groupByDate(filteredConnections)
    const hasConnections = connections.length > 0
    const hasResults = filteredConnections.length > 0

    return (
        <div className={styles.page}>
            {!user && hasConnections && (
                <div className={styles.topBanner}>
                    <span className={styles.topBannerText}>
                        <img src={`${POP}/warning-triangle.svg`} alt="" width={18} height={18} style={{ verticalAlign: '-4px', marginRight: 6 }} />
                        Local only.{' '}
                        <button className={styles.topBannerLink} onClick={() => router.push('/auth')}>Sign in to back up</button>
                    </span>
                </div>
            )}

            {showInstallBanner && (
                <div className={styles.topBanner}>
                    <span className={styles.topBannerText}>
                        <img src={`${POP}/smartphone.svg`} alt="" width={18} height={18} style={{ verticalAlign: '-4px', marginRight: 6 }} />
                        Add We Met to your home screen
                    </span>
                    <div className={styles.topBannerActions}>
                        <button className={styles.topBannerLink} onClick={handleInstall}>Install</button>
                        <button className={styles.topBannerClose} onClick={() => setShowInstallBanner(false)} aria-label="Close"><img src={`${POP}/close.svg`} alt="" width={14} height={14} /></button>
                    </div>
                </div>
            )}

            <div className={styles.header}>
                <h1 className={styles.title}>
                    Meets
                    {hasConnections && (
                        <span className={styles.titleCount}>({connections.length})</span>
                    )}
                </h1>
            </div>

            <div className={styles.inner}>
                {hasConnections && (
                    <div className={styles.searchRow}>
                        <div className={styles.searchWrapper}>
                            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="Search by name or event"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className={styles.searchClear} onClick={() => setSearchQuery('')}>✕</button>
                            )}
                            <span className={styles.filterDivider} />
                            <button
                                className={`${styles.filterTrigger} ${activeFilterCount > 0 ? styles.filterTriggerActive : ''}`}
                                onClick={() => setShowFilterPanel(true)}
                                aria-label="Filters"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="4" y1="6" x2="20" y2="6"/>
                                    <line x1="8" y1="12" x2="16" y2="12"/>
                                    <line x1="11" y1="18" x2="13" y2="18"/>
                                </svg>
                                {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
                            </button>
                        </div>
                    </div>
                )}

                {!hasConnections ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>
                            <img src={`${POP}/handshake.svg`} alt="" width={64} height={64} />
                        </div>
                        <p className={styles.emptyText}>
                            Tap <strong>Connect</strong> to get started.
                        </p>
                        <div className={styles.emptySteps}>
                            <div className={styles.emptyStep}>
                                <img src={`${POP}/qr-code.svg`} alt="" width={20} height={20} className={styles.emptyStepIcon} />
                                <span>Show your QR</span>
                                <span className={styles.emptyStepNum}>01</span>
                            </div>
                            <div className={styles.emptyStep}>
                                <img src={`${POP}/camera.svg`} alt="" width={20} height={20} className={styles.emptyStepIcon} />
                                <span>They scan it</span>
                                <span className={styles.emptyStepNum}>02</span>
                            </div>
                            <div className={styles.emptyStep}>
                                <img src={`${POP}/shield-check.svg`} alt="" width={20} height={20} className={styles.emptyStepIcon} />
                                <span>Saved forever</span>
                                <span className={styles.emptyStepNum}>03</span>
                            </div>
                        </div>
                    </div>
                ) : !hasResults ? (
                    <div className={styles.noResults}>
                        <div className={styles.noResultsIcon}>
                            <img src={`${POP}/qr-code.svg`} alt="" width={48} height={48} style={{ filter: 'brightness(0) opacity(0.3)' }} />
                        </div>
                        <div className={styles.noResultsTitle}>No Meets Found</div>
                        <p className={styles.noResultsText}>
                            {searchQuery
                                ? <>We couldn&apos;t find any meets for &quot;{searchQuery}&quot;</>
                                : <>No meets match your filters</>}
                        </p>
                        <button
                            className={styles.noResultsClear}
                            onClick={() => { setSearchQuery(''); setFilters({ festival: 'all', timePeriod: 'all' }) }}
                        >
                            Clear {searchQuery ? 'Search' : 'Filters'}
                        </button>
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
                                        <div className={styles.cardAvatar}>
                                            <Avatar src={conn.photo} name={conn.name} size={44} />
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <div className={styles.cardName}>{conn.name}</div>
                                            <div className={styles.cardMeta}>
                                                <span>
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                    {formatTimeShort(conn.scannedAt)}
                                                </span>
                                                {conn.event && conn.event !== 'Unknown' && (
                                                    <>
                                                        <span className={styles.cardMetaDivider} />
                                                        <span>
                                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                                            {conn.event.length > 14 ? conn.event.slice(0, 14) + '…' : conn.event}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <svg className={styles.chevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showFilterPanel && (
                <MeetsFilterPanel
                    isMobile={isMobile}
                    initialFestival={filters.festival}
                    initialTimePeriod={filters.timePeriod}
                    resultCount={connections.length}
                    onApply={(newFilters) => setFilters(newFilters)}
                    onClose={() => setShowFilterPanel(false)}
                />
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