// ══════════════════════════════════════════════════════════════
// constants/events.js
// ══════════════════════════════════════════════════════════════
// Master list of supported festivals and events.
//
// Names are evergreen — no year suffix. The year a connection
// happened is captured by the Meet's own timestamp, not the
// event name, so this list never needs annual maintenance.
//
// To add a new event: add its name to the array below.
// To retire one: just remove it — existing Meets store the name
// as plain text at time of connection, so removing it here has
// no effect on historical data.
//
// Events are displayed in the order they appear here.
// ══════════════════════════════════════════════════════════════

export const EVENTS = [
    // ── Burn Circuit ─────────────────────────────────────────
    { name: "Burning Man" },
    { name: "Afrikaburn" },
    { name: "Boom" },
    { name: "Borderland" },
    { name: "Nowhere" },
    { name: "Midburn" },
    { name: "Kiez Burn" },
    { name: "Transformus" },
    { name: "Blazing Swan" },
    { name: "Element 11" },
    // ── Music Festivals ───────────────────────────────────────
    { name: "Coachella" },
    { name: "Glastonbury" },
    { name: "Tomorrowland" },
    { name: "Lightning in a Bottle" },
    { name: "Shambhala" },
    { name: "Envision" },
    { name: "Rainbow Serpent" },
    { name: "Ozora" },
    { name: "Fusion" },
    { name: "Epizode" },
    { name: "Symbiosis" },
    { name: "Lucidity" },
    { name: "Desert Hearts" },
    { name: "Ocaso" },
    { name: "Wanderlust" },
    // ── Catch-all ─────────────────────────────────────────────
    { name: "General" },
];

export const formatEvent = (event) => event.name;