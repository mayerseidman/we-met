// ══════════════════════════════════════════════════════════════
// constants/events.js
// ══════════════════════════════════════════════════════════════
// Master list of supported festivals and events.
// To add a new event, add an entry to the EVENTS array.
// Events are displayed in the order they appear here.

export const EVENTS = [
    // ── Burn Circuit ─────────────────────────────────────────
    { name: "Burning Man 2025", category: "burn" },
    { name: "Afrikaburn 2025", category: "burn" },
    { name: "Boom 2025", category: "burn" },
    { name: "Borderland 2025", category: "burn" },
    { name: "Nowhere 2025", category: "burn" },
    { name: "Midburn 2025", category: "burn" },
    { name: "Kiez Burn 2025", category: "burn" },
    { name: "Transformus 2025", category: "burn" },
    { name: "Blazing Swan 2025", category: "burn" },
    { name: "Element 11 2025", category: "burn" },

    // ── Music Festivals ───────────────────────────────────────
    { name: "Coachella 2025", category: "music" },
    { name: "Glastonbury 2025", category: "music" },
    { name: "Tomorrowland 2025", category: "music" },
    { name: "Lightning in a Bottle 2025", category: "music" },
    { name: "Shambhala 2025", category: "music" },
    { name: "Envision 2025", category: "music" },
    { name: "Rainbow Serpent 2025", category: "music" },
    { name: "Ozora 2025", category: "music" },
    { name: "Fusion 2025", category: "music" },
    { name: "Epizode 2025", category: "music" },
    { name: "Symbiosis 2025", category: "music" },
    { name: "Lucidity 2025", category: "music" },
    { name: "Desert Hearts 2025", category: "music" },
    { name: "Ocaso 2025", category: "music" },
    { name: "Wanderlust 2025", category: "music" },

    // ── Catch-all ─────────────────────────────────────────────
    { name: "General", category: "general" },
];

export const formatEvent = (event) => event.name;