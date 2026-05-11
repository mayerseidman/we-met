// ══════════════════════════════════════════════════════════════
// pages/api/og.js — Open Graph image for /
// ══════════════════════════════════════════════════════════════
// Renders the 1200×630 social card shown on WhatsApp, Twitter,
// Slack, iMessage, etc. when someone shares the marketing URL.
// Uses @vercel/og (Satori → PNG) on the Edge runtime.
// ══════════════════════════════════════════════════════════════

import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

// Brand tokens (mirror styles/variables.scss)
const CREAM = '#FFEFD7';
const NAVY = '#0C098C';
const ORANGE = '#F5722F';
const YELLOW = '#FFE066';
const NEON = '#00FF9D';
const PINK = '#FF6B9D';
const PURPLE = '#B47AFF';
const WHITE = '#FFFFFF';

// Bundled fonts (Satori needs TTF/OTF — Edge runtime loads via fetch + new URL).
const FONT_MONO_BOLD = fetch(new URL('./_fonts/GeistMono-Bold.ttf', import.meta.url)).then((r) =>
    r.arrayBuffer()
);
const FONT_SANS_REGULAR = fetch(new URL('./_fonts/Geist-Regular.ttf', import.meta.url)).then((r) =>
    r.arrayBuffer()
);

export default async function handler() {
    const [boldData, regularData] = await Promise.all([FONT_MONO_BOLD, FONT_SANS_REGULAR]);

    const bubble = (bg, color, text, style = {}) => ({
        background: bg,
        color,
        border: `4px solid ${NAVY}`,
        borderRadius: 20,
        padding: '14px 22px',
        fontFamily: 'GeistMono',
        fontWeight: 700,
        fontSize: 28,
        boxShadow: `6px 6px 0 ${NAVY}`,
        display: 'flex',
        position: 'absolute',
        ...style,
    });

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: CREAM,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'GeistMono',
                    position: 'relative',
                    padding: 60,
                }}
            >
                {/* Decorative chat bubbles — placed around the edges so they don't crowd the title/tagline. */}
                <div style={bubble(YELLOW, NAVY, 'Hi!', { top: 30, left: 60, transform: 'rotate(-8deg)' })}>Hi!</div>
                <div style={bubble(NEON, NAVY, 'Ciao!', { top: 40, right: 70, transform: 'rotate(6deg)' })}>Ciao!</div>
                <div style={bubble(WHITE, NAVY, 'Howdy!', { top: 200, left: 20, transform: 'rotate(-10deg)' })}>Howdy!</div>
                <div style={bubble(ORANGE, WHITE, 'Aloha!', { top: 200, right: 30, transform: 'rotate(6deg)' })}>Aloha!</div>
                <div style={bubble(PINK, WHITE, 'Hola!', { bottom: 30, left: 80, transform: 'rotate(-5deg)' })}>Hola!</div>
                <div style={bubble(PURPLE, WHITE, 'Hey!', { bottom: 40, right: 100, transform: 'rotate(8deg)' })}>Hey!</div>

                {/* App icon tile — orange with rotation, matches in-app icon */}
                <div
                    style={{
                        width: 132,
                        height: 132,
                        background: ORANGE,
                        border: `6px solid ${NAVY}`,
                        borderRadius: 32,
                        boxShadow: `10px 10px 0 ${NAVY}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'rotate(-4deg)',
                        marginBottom: 36,
                        fontSize: 76,
                    }}
                >
                    👋
                </div>

                {/* Wordmark */}
                <div
                    style={{
                        fontSize: 156,
                        fontWeight: 700,
                        color: NAVY,
                        letterSpacing: 4,
                        lineHeight: 1,
                        display: 'flex',
                    }}
                >
                    WE MET
                </div>

                {/* Tagline */}
                <div
                    style={{
                        fontFamily: 'Geist',
                        fontSize: 30,
                        fontWeight: 400,
                        color: NAVY,
                        marginTop: 28,
                        textAlign: 'center',
                        maxWidth: 820,
                        lineHeight: 1.3,
                        display: 'flex',
                    }}
                >
                    Save everyone you meet at festivals — and keep the magic alive.
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                { name: 'GeistMono', data: boldData, style: 'normal', weight: 700 },
                { name: 'Geist', data: regularData, style: 'normal', weight: 400 },
            ],
            headers: {
                'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
            },
        }
    );
}
