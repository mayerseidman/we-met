// ══════════════════════════════════════════════════════════════
// hooks/useToast.js
// ══════════════════════════════════════════════════════════════
// Hook to trigger toast notifications from anywhere in the app.
//
// WHY THIS EXISTS:
// Centralizes toast state so any component can show a toast
// without managing its own visibility state.
//
// HOW TO USE:
// const { toastMessage, toastVisible, showToast, hideToast } = useToast()
// showToast('Hello! 👋')
//
// Then in your JSX:
// <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} />
// ══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react'

export function useToast() {
    const [toastMessage, setToastMessage] = useState('')
    const [toastVisible, setToastVisible] = useState(false)

    // Show a toast with a message
    // Calling this again while a toast is visible will replace it
    const showToast = useCallback((message) => {
        setToastMessage(message)
        setToastVisible(true)
    }, [])

    // Hide the toast
    const hideToast = useCallback(() => {
        setToastVisible(false)
    }, [])

    return { toastMessage, toastVisible, showToast, hideToast }
}