/*
 * Lead spam guard, shared by the corporate site and both microsite repos.
 * Keep the copies identical: src/lib/spam-guard.js (managemowed) and
 * lib/spam-guard.js (managemowed-seattle, managemowed-spokane).
 *
 * Scores a submission on invisible signals only; real visitors never see a
 * challenge. A score at or above THRESHOLD is quarantined by the caller: it
 * is stored or logged as spam, no emails go out, and the bot still receives
 * a normal success response so it gets no signal to adapt.
 *
 * Signals that only ever come from bots (honeypot, links in the name field,
 * link shorteners, adult/crypto/SEO pitches) score at or above the threshold
 * on their own. Weaker signals (no form script, instant submit, gibberish,
 * odd phone) need to stack before anything is held.
 */

const THRESHOLD = 6;

const SHORTENER_RE = /\b(tinyurl\.com|bit\.ly|t\.co\/|goo\.gl|is\.gd|cutt\.ly|rb\.gy|ow\.ly|shorturl\.|tiny\.cc|t\.me\/|rebrand\.ly|s\.id\/|v\.gd)/i;
const URL_RE = /(https?:\/\/|www\.)/i;
const SPAM_WORDS_RE = /\b(escort|escorts|porn|porno|sex|sexy|nude|nudes|onlyfans|webcam|hookup|dating|casino|viagra|cialis|crypto|cryptocurrency|bitcoin|btc|forex|binance|backlinks?|guest ?posts?|seo (services|agency|expert)|rank(ing)? your (site|website)|first page of google|increase (your )?traffic|payday|telegram)\b/i;

function str(v) { return v == null ? '' : String(v); }

// Tokens like "1wqVwHZ", "oPE3B73", "TUJE13928JUYEGRT": random mixed-case or
// letter/digit soup. Ordinary words, names, suite numbers and zip codes pass.
function isGibberishToken(t) {
  if (t.length < 5 || !/^[A-Za-z0-9]+$/.test(t) || !/[A-Za-z]/.test(t)) return false;
  const mixedDigits = /\d/.test(t) && /[A-Za-z]/.test(t) && t.length >= 6 && !/^\d+[A-Za-z]{1,2}$/.test(t) && !/^[A-Za-z]{1,2}\d+$/.test(t);
  const caseFlips = (t.match(/[a-z][A-Z]/g) || []).length;
  return mixedDigits || caseFlips >= 2;
}

function assessLead(input) {
  const f = input || {};
  const name = str(f.fullName);
  const company = str(f.company);
  const email = str(f.email);
  const phone = str(f.phone);
  const free = [str(f.details), str(f.propertyLocation)].join(' ');
  const all = [name, company, free].join(' ');
  const reasons = [];
  let score = 0;
  function hit(points, reason) { score += points; reasons.push(reason); }

  if (str(f.website).trim()) hit(10, 'honeypot');
  if (URL_RE.test(name) || SHORTENER_RE.test(name) || /\.(com|net|org|ru|xyz|top|info|biz)\b/i.test(name)) hit(6, 'link-in-name');
  if (SHORTENER_RE.test(all)) hit(6, 'link-shortener');
  if (SPAM_WORDS_RE.test(all)) hit(6, 'spam-keywords');
  if (URL_RE.test(company)) hit(2, 'link-in-company');
  if (URL_RE.test(free)) hit(1, 'link-in-details');

  const gibberish = all.split(/[^A-Za-z0-9]+/).filter(isGibberishToken).length;
  if (gibberish >= 2) hit(4, 'gibberish');
  else if (gibberish === 1) hit(1, 'gibberish-token');

  if (name.length > 60 || name.trim().split(/\s+/).length > 6) hit(3, 'name-looks-like-message');
  if (name && !/[A-Za-zÀ-ɏ]/.test(name)) hit(2, 'name-no-letters');

  const digits = phone.replace(/\D/g, '');
  if (digits.length > 15) hit(2, 'phone-too-long');
  else if (digits.length === 11 && digits[0] !== '1') hit(1, 'phone-not-us');

  if (email && /^[a-z]+\d{5,}@/i.test(email)) hit(1, 'email-pattern');

  // Form script signals. A missing marker means the POST did not come from
  // our page script (direct API hit). Elapsed time is measured client side.
  if (f._mm !== 'v1') hit(2, 'no-form-script');
  else {
    const elapsed = Number(f._elapsed);
    if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < 2500) hit(3, 'too-fast');
  }

  return { spam: score >= THRESHOLD, score: score, reasons: reasons };
}

module.exports = { assessLead: assessLead, THRESHOLD: THRESHOLD };
