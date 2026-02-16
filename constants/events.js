export const PLACEHOLDER_HEADSHOT =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop";

export const EVENTS = [
  { name: "Burning Man", count: 120 },
  { name: "Boom", count: 0 },
  { name: "General", count: 12 },
  { name: "Afrikaburn 2025", count: null },
  { name: "Lightning in a Bottle 2025", count: null },
  { name: "Coachella 2025", count: null },
];

export const formatEvent = (event) =>
  event.count !== null ? `${event.name} (${event.count})` : event.name;

  