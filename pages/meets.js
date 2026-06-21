import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import { useStorage } from '../hooks/useStorage'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import StepCardList from '../components/StepCardList'
import MeetsFilterPanel, { TIME_PRESETS } from '../components/MeetsFilterPanel'
import styles from '../styles/pages/Meets.module.scss'

const POP = '/icons/pop'

const EMPTY_STEPS = [
    { icon: 'flash', label: 'Tap Connect', num: '01' },
    { icon: 'qr-code', label: 'Show or scan', num: '02' },
    { icon: 'shield-check', label: "You're Connected!", num: '03' },
]

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

export default function Meets() {
    const { user, loading } = useAuth()
    const { connections, isReady, profile } = useStorage()

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

    // Calendar-day based grouping (fixed — was previously using raw elapsed
    // milliseconds, which misclassified events near midnight).
    const formatDateLabel = (scannedAt) => {
        if (!scannedAt) return 'Unknown'
        const date = new Date(scannedAt)
        const now = new Date()

        const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
        const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86400000)

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

    // ── Loading state — header + spinner + skeleton cards ───────
    if (!mounted || loading || !isReady) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Meets</h1>
                </div>
                <div className={styles.inner}>
                    <div className={styles.loadingSpinnerRow}>
                        <div className={styles.loadingSpinner} />
                        <div className={styles.loadingText}>Loading Meets...</div>
                    </div>
                    <div className={styles.skeletonList}>
                        {[0, 1, 2].map(i => (
                            <div key={i} className={styles.skeletonCard}>
                                <div className={styles.skeletonAvatar} />
                                <div className={styles.skeletonLines}>
                                    <div className={styles.skeletonLine} style={{ width: '70%' }} />
                                    <div className={styles.skeletonLine} style={{ width: '45%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // ── No profile state — reuses the shared EmptyState component ───
    if (!profile) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Meets</h1>
                </div>
                <div className={styles.inner}>
                    <div className={styles.noProfileWrapper}>
                        <EmptyState onSetEditing={() => router.push('/profile')} />
                    </div>
                </div>
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
                        <img src={`${POP}/warning-triangle.svg`} alt="" width={18} height={18} style={{ verticalAlign: '-4px', marginRight: 8 }} />
                        <button className={styles.topBannerLink} onClick={() => router.push('/auth?mode=signin')}>Sign In To Back Up</button>
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
                                placeholder="Search by name or event..."
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

                {hasConnections && (filters.festival !== 'all' || filters.timePeriod !== 'all') && (
                    <div className={styles.activeFilters}>
                        {filters.festival !== 'all' && (
                            <span className={styles.filterPill}>
                                {filters.festival}
                                <button
                                    className={styles.filterPillRemove}
                                    onClick={() => setFilters(f => ({ ...f, festival: 'all' }))}
                                    aria-label="Remove festival filter"
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                        {filters.timePeriod !== 'all' && (
                            <span className={styles.filterPill}>
                                {TIME_PRESETS.find(p => p.key === filters.timePeriod)?.label || filters.timePeriod}
                                <button
                                    className={styles.filterPillRemove}
                                    onClick={() => setFilters(f => ({ ...f, timePeriod: 'all' }))}
                                    aria-label="Remove time period filter"
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {!hasConnections ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyTitleRow}>
                            <img src={`${POP}/handshake.svg`} alt="" width={22} height={22} style={{ flexShrink: 0 }} />
                            <p className={styles.emptyText}>
                                You have no meets yet. Let's change that!
                            </p>
                        </div>
                        <StepCardList steps={EMPTY_STEPS} />
                    </div>
                ) : !hasResults ? (
                    <div className={styles.noResults}>
                        <div className={styles.noResultsTitleRow}>
                            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                                <path d="M8.3175 15.6509C10.0741 15.6509 11.6861 15.0313 12.9474 13.9984L17.6886 18.7501L17.7189 18.7795C18.012 19.073 18.487 19.0737 18.7802 18.7804C19.0734 18.4871 19.0731 18.0115 18.7802 17.718L18.7509 17.6887L18.5427 17.4793L14.0062 12.9334C15.0247 11.6748 15.635 10.0714 15.635 8.32544C15.635 4.27972 12.3588 1 8.3175 1C4.27616 1 1 4.27972 1 8.32544C1 12.3712 4.27616 15.6509 8.3175 15.6509ZM8.3175 2.50266C11.5299 2.50266 14.134 5.10962 14.134 8.32544C14.134 11.5413 11.5299 14.1482 8.3175 14.1482C5.1051 14.1482 2.50103 11.5413 2.50103 8.32544C2.50103 5.10962 5.1051 2.50266 8.3175 2.50266Z" fill="#201F29"/>
                            </svg>
                            <div className={styles.noResultsTitle}>No Meets Found</div>
                        </div>
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
                                                        <span className={styles.cardMetaEvent}>
                                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                                            <span className={styles.cardMetaEventText}>{conn.event}</span>
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
                    connections={connections}
                    onApply={(newFilters) => setFilters(newFilters)}
                    onClose={() => setShowFilterPanel(false)}
                />
            )}
        </div>
    )
}

function DetailView({ conn, onBack, formatTime, handleCopy, copyFeedback }) {
    return (
        <div className={styles.detailPage}>
            <div className={styles.detailHeaderBar}>
                <button className={styles.backBtn} onClick={onBack}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    Back
                </button>
            </div>

            <div className={styles.detailCover}>
                <Avatar src={conn.photo} name={conn.name} size={90} />
                <h2 className={styles.detailName}>{conn.name}</h2>
                <div className={styles.detailMetaRow}>
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {formatTime(conn.scannedAt)}
                    </span>
                    {conn.event && conn.event !== 'Unknown' && (
                        <span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {conn.event}
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.detailContent}>
                {conn.about && (
                    <div className={styles.detailSection}>
                        <div className={styles.detailSectionLabel}>About</div>
                        <p className={styles.detailAboutText}>{conn.about}</p>
                    </div>
                )}

                {(conn.phone || conn.instagram) && (
                    <div className={styles.detailSection}>
                        <div className={styles.detailSectionLabel}>Contact</div>
                        {conn.phone && (
                            <div className={styles.contactTile}>
                                <div className={styles.contactIconBadge}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.82 5.82l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                </div>
                                <span className={styles.contactValue}>{conn.phone}</span>
                                <button
                                    className={`${styles.contactActionQuiet} ${copyFeedback === 'phone' ? styles.contactActionCopied : ''}`}
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
                            <div className={styles.contactTile}>
                                <div className={styles.contactIconBadge}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                                </div>
                                <span className={styles.contactValue}>@{conn.instagram}</span>
                                <button
                                    className={styles.contactActionQuiet}
                                    onClick={() => window.open(`https://instagram.com/${conn.instagram}`, '_blank')}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> View
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}