// ══════════════════════════════════════════════════════════════
// components/Toast.jsx
// ══════════════════════════════════════════════════════════════
// Simple toast notification that appears above the bottom nav.
//
// WHY THIS EXISTS:
// Gives users feedback after actions like sign up, sign in,
// profile save etc. without blocking the UI like an alert would.
//
// HOW TO USE:
// const { showToast } = useToast()
// showToast('Account created! 🎉')
//
// USED IN:
// - pages/auth.js (sign up / sign in feedback)
// - pages/profile.js (profile saved feedback) — coming soon
// ══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import styles from '../styles/components/Toast.module.scss'

export default function Toast({ message, visible, onHide }) {
    const [closing, setClosing] = useState(false)

    useEffect(() => {
        if (visible) {
            setClosing(false)
            const timer = setTimeout(() => {
                setClosing(true)
                setTimeout(onHide, 280)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [visible, onHide])

    if (!visible) return null

    return (
        <div className={`${styles.toast} ${closing ? styles.toastClosing : ''}`}>
            {message}
        </div>
    )
}