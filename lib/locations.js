const fs   = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'locations.json');

let cache = null;
function loadConfig() {
  if (cache) return cache;
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  cache = JSON.parse(raw);
  return cache;
}

function clearCache() { cache = null; }

function allLocations() {
  return loadConfig().locations;
}

function globalBccEmails() {
  return loadConfig().globalBccEmails || [];
}

function getLocation(key) {
  const cfg = loadConfig();
  return cfg.locations[key] || null;
}

function defaultLocationKey() {
  const cfg = loadConfig();
  return process.env.DEFAULT_LOCATION
      || cfg.defaultLocation
      || Object.keys(cfg.locations)[0];
}

// Strip port + lowercase
function normalizeHost(host) {
  if (!host) return '';
  return String(host).split(':')[0].toLowerCase();
}

// Strict resolve — returns null if host is not in any location's allowlist.
// Use this for security-sensitive actions like lead capture / email sending.
function resolveLocationStrict(host) {
  const cfg  = loadConfig();
  const norm = normalizeHost(host);
  for (const [key, loc] of Object.entries(cfg.locations)) {
    const domains = (loc.domains || []).map(d => d.toLowerCase());
    if (domains.includes(norm)) return { key, ...loc };
  }
  return null;
}

// Lenient resolve — falls back to DEFAULT_LOCATION (or `defaultLocation` from
// config) when host doesn't match anything. Use this ONLY for read-only page
// rendering (so the .replit.app preview URL still shows a sensible page).
function resolveLocation(host) {
  const strict = resolveLocationStrict(host);
  if (strict) return strict;

  const cfg = loadConfig();
  const fallbackKey = defaultLocationKey();
  const fallback    = cfg.locations[fallbackKey];
  return fallback ? { key: fallbackKey, ...fallback } : null;
}

module.exports = {
  loadConfig,
  clearCache,
  allLocations,
  globalBccEmails,
  getLocation,
  defaultLocationKey,
  resolveLocation,
  resolveLocationStrict
};
