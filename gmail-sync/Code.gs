const TRAVEL_OS_VERSION = '1.1.0';

function syncTravelOs() {
  const cfg = getConfig_();
  validateConfig_(cfg);

  const gh = readTripData_(cfg);
  const data = gh.data;
  const priorMode = data.sync && data.sync.mode;
  const seen = loadSeenIds_();
  const newIds = [];
  const parsed = [];
  const review = [];

  const threads = GmailApp.search(buildGmailQuery_(cfg), 0, Number(cfg.MAX_THREADS || 60));
  const messages = [];
  threads.forEach(t => t.getMessages().forEach(m => messages.push(m)));
  messages.sort((a, b) => a.getDate().getTime() - b.getDate().getTime());

  messages.forEach(message => {
    const id = message.getId();
    if (seen.has(id)) return;
    newIds.push(id);

    const event = parseTravelMessage_(message, data.trip);
    if (!event) return;
    if (event.reviewReason) review.push(event);
    else parsed.push(event);
  });

  let changed = 0;
  parsed.forEach(event => {
    if (mergeEventIntoTrip_(data, event)) changed++;
  });

  const shouldCommit = changed > 0 || review.length > 0 || priorMode !== 'auto';
  if (shouldCommit) {
    data.sync = data.sync || {};
    data.sync.source = 'Gmail → Google Apps Script → GitHub';
    data.sync.mode = 'auto';
    data.sync.lastChecked = formatEt_(new Date());
    data.sync.lastResult = `${changed} change${changed === 1 ? '' : 's'} · ${review.length} review`;
    data.sync.engine = `gmail-sync/${TRAVEL_OS_VERSION}`;
    data.sync.privacy = 'public-safe-fields-only';
    writeTripData_(cfg, gh.sha, data, changed, review.length);
  }

  saveSeenIds_(newIds);
  saveReviewItems_(review);

  console.log(JSON.stringify({
    scannedThreads: threads.length,
    newMessages: newIds.length,
    parsed: parsed.length,
    changed,
    review: review.length,
    committed: shouldCommit
  }, null, 2));
}

function previewTravelEmails() {
  const cfg = getConfig_();
  validateConfig_(cfg);
  const gh = readTripData_(cfg);
  const rows = [];
  GmailApp.search(buildGmailQuery_(cfg), 0, 40).forEach(thread => {
    thread.getMessages().forEach(message => {
      const event = parseTravelMessage_(message, gh.data.trip);
      if (event) rows.push({
        date: message.getDate(),
        from: message.getFrom(),
        subject: message.getSubject(),
        parsed: event
      });
    });
  });
  console.log(JSON.stringify(rows, null, 2));
  return rows;
}

function testGitHubConnection() {
  const cfg = getConfig_();
  validateConfig_(cfg);
  const gh = readTripData_(cfg);
  console.log(JSON.stringify({
    ok: true,
    repo: cfg.GITHUB_REPO,
    branch: cfg.GITHUB_BRANCH,
    file: cfg.TRIP_FILE,
    trip: gh.data.trip && gh.data.trip.title,
    bookings: (gh.data.bookings || []).length
  }, null, 2));
}

function install15MinuteTrigger() {
  removeTravelOsTriggers();
  ScriptApp.newTrigger('syncTravelOs').timeBased().everyMinutes(15).create();
  console.log('Installed 15-minute Travel OS sync trigger.');
}

function removeTravelOsTriggers() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'syncTravelOs')
    .forEach(t => ScriptApp.deleteTrigger(t));
}

function getLastReviewItems() {
  const items = JSON.parse(PropertiesService.getScriptProperties().getProperty('LAST_REVIEW_ITEMS') || '[]');
  console.log(JSON.stringify(items, null, 2));
  return items;
}

function getConfig_() {
  const p = PropertiesService.getScriptProperties();
  return {
    GITHUB_TOKEN: p.getProperty('GITHUB_TOKEN') || '',
    GITHUB_REPO: p.getProperty('GITHUB_REPO') || 'stayrealxxx/family-travel-os',
    GITHUB_BRANCH: p.getProperty('GITHUB_BRANCH') || 'main',
    TRIP_FILE: p.getProperty('TRIP_FILE') || 'trip-data.json',
    GMAIL_LOOKBACK_DAYS: p.getProperty('GMAIL_LOOKBACK_DAYS') || '21',
    MAX_THREADS: p.getProperty('MAX_THREADS') || '60'
  };
}

function validateConfig_(cfg) {
  if (!cfg.GITHUB_TOKEN) throw new Error('Missing Script Property: GITHUB_TOKEN');
  if (!/^[-\w.]+\/[-\w.]+$/.test(cfg.GITHUB_REPO)) throw new Error('Invalid GITHUB_REPO');
}

function buildGmailQuery_(cfg) {
  const days = Math.max(1, Math.min(90, Number(cfg.GMAIL_LOOKBACK_DAYS || 21)));
  return [
    `newer_than:${days}d`, '-in:spam', '-in:trash', '{',
    'from:res-marriott.com', 'from:tx.ihg.com', 'from:ihg.com', 'from:hyatt.com',
    'from:aa.com', 'from:info.email.aa.com', 'from:americanairlines.com',
    'from:united.com', 'from:delta.com', 'from:southwest.com', 'from:jetblue.com', 'from:alaskaair.com',
    'from:hertz.com', 'from:enterprise.com', 'from:nationalcar.com', 'from:avis.com', 'from:budget.com',
    'from:chasetravel.com',
    'subject:"reservation confirmation"', 'subject:"trip confirmation"', 'subject:"booking confirmation"',
    'subject:"reservation is confirmed"', 'subject:"eTicket Itinerary"',
    '}'
  ].join(' ');
}

function parseTravelMessage_(message, trip) {
  const meta = {
    subject: normalizeSpace_(message.getSubject() || ''),
    from: normalizeSpace_(message.getFrom() || '').toLowerCase(),
    body: normalizeBody_(message.getPlainBody() || ''),
    receivedAt: message.getDate()
  };

  let event = null;
  if (/res-marriott\.com/.test(meta.from)) event = parseMarriott_(meta, trip);
  else if (/tx\.ihg\.com|@[^ ]*ihg\.com/.test(meta.from)) event = parseIhg_(meta, trip);
  else if (isAirlineSender_(meta.from)) event = parseAirline_(meta, trip);
  else if (isRentalSender_(meta.from)) event = parseRentalCar_(meta, trip);
  else event = parseGenericTravel_(meta, trip);

  if (!event) return null;
  event.receivedAt = meta.receivedAt.toISOString();
  event.subjectFingerprint = hash_(meta.subject).slice(0, 16);
  if (!event.sourceKey) {
    event.sourceKey = hash_(`${event.provider || 'travel'}|${meta.subject}|${event.date || event.checkIn || event.pickupDate || ''}`);
  }
  if (!isRelevantToTrip_(event, trip)) return null;
  return event;
}

function parseMarriott_(meta, trip) {
  const confirm = meta.subject.match(/^Reservation Confirmation\s+#([A-Z0-9-]+)\s+for\s+(.+)$/i);
  const cancel = meta.subject.match(/^Reservation Cancellation\s+#([A-Z0-9-]+)\s+for\s+(.+)$/i);
  if (!confirm && !cancel) return null;

  const m = confirm || cancel;
  const dates = findCheckInOut_(meta.body);
  const fallback = findTripDateRange_(meta.body, trip);
  const event = {
    type: 'hotel',
    action: cancel ? 'CANCEL' : 'BOOK',
    provider: 'Marriott Bonvoy',
    name: normalizeSpace_(m[2]),
    checkIn: dates.checkIn || fallback.start,
    checkOut: dates.checkOut || fallback.end,
    address: findUsCanadaHotelAddress_(meta.body) || undefined,
    sourceKey: hash_(`marriott|${m[1]}`)
  };
  if (!event.checkIn || !event.checkOut) event.reviewReason = 'Marriott recognized, but stay dates could not be parsed safely.';
  return event;
}

function parseIhg_(meta, trip) {
  const hay = `${meta.subject}\n${meta.body}`;
  const confirmed = /reservation.+confirmed|reservation is confirmed/i.test(hay.slice(0, 1600));
  const cancelled = /reservation.+cancel(?:led|ation)|cancellation/i.test(meta.subject);
  if (!confirmed && !cancelled) return null;

  const confirmation = firstMatch_(hay, /(?:Confirmation(?: Number)?|#)\s*[:#]?\s*([A-Z0-9-]{6,})/i);
  const dates = findCheckInOut_(meta.body);
  const fallback = findTripDateRange_(meta.body, trip);
  let hotelName = firstMatch_(meta.subject, /reservation at\s+(.+?)\s+is confirmed/i);
  if (!hotelName) hotelName = firstMatch_(meta.body, /your reservation is confirmed!\s*\n+([^\n]{3,100})/i);

  const event = {
    type: 'hotel',
    action: cancelled ? 'CANCEL' : 'BOOK',
    provider: 'IHG One Rewards',
    name: normalizeSpace_(hotelName || 'IHG hotel'),
    checkIn: dates.checkIn || fallback.start,
    checkOut: dates.checkOut || fallback.end,
    sourceKey: confirmation ? hash_(`ihg|${confirmation}`) : undefined
  };
  if (!event.checkIn || !event.checkOut) event.reviewReason = 'IHG recognized, but stay dates could not be parsed safely.';
  return event;
}

function parseAirline_(meta, trip) {
  const hay = `${meta.subject}\n${meta.body}`;
  if (!/(trip|flight|itinerary|reservation|confirmation|ticket)/i.test(hay)) return null;

  const provider = airlineProvider_(meta.from);
  const confirmation = firstMatch_(hay, /(?:confirmation|record locator|confirmation code)\s*(?:number|#|code)?\s*[:#]?\s*([A-Z0-9]{5,8})/i);
  const subjectRoute = meta.subject.match(/\(([A-Z]{3})\s*[-–—>]\s*([A-Z]{3})\)/);
  const route = subjectRoute ? { from: subjectRoute[1], to: subjectRoute[2] } : findAirportRoute_(hay);
  const date = findRelevantDate_(hay, trip) || findFlightDate_(hay);
  const times = findFlightTimes_(hay);
  const flightNumber = firstMatch_(hay, /\b((?:AA|UA|DL|WN|B6|AS)\s?\d{1,4})\b/i);
  const cancelled = /cancel(?:led|ation)|trip canceled|flight canceled/i.test(meta.subject);

  const event = {
    type: 'flight', action: cancelled ? 'CANCEL' : 'BOOK', provider,
    from: route.from, to: route.to, date,
    depart: times.depart, arrive: times.arrive,
    flightNumber: flightNumber || undefined,
    sourceKey: confirmation ? hash_(`${provider}|${confirmation}`) : undefined
  };
  if (!event.from || !event.to || !event.date) event.reviewReason = `${provider} recognized, but route/date could not be parsed safely.`;
  return event;
}

function parseRentalCar_(meta, trip) {
  const hay = `${meta.subject}\n${meta.body}`;
  if (!/(reservation|rental|confirmation|pickup|pick-up)/i.test(hay)) return null;
  const provider = rentalProvider_(meta.from);
  const confirmation = firstMatch_(hay, /(?:confirmation|reservation)(?: number| #| code)?\s*[:#]?\s*([A-Z0-9-]{5,})/i);
  const dates = findPickupReturnDates_(hay);
  const range = findTripDateRange_(hay, trip);
  const cancelled = /cancel(?:led|ation)/i.test(meta.subject);

  const event = {
    type: 'car', action: cancelled ? 'CANCEL' : 'BOOK', provider,
    name: `${provider} rental car`,
    pickupDate: dates.pickupDate || range.start,
    dropoffDate: dates.dropoffDate || range.end,
    pickup: firstMatch_(hay, /(?:Pick[- ]?up Location|Pickup Location)\s*:?\s*([^\n]{3,100})/i),
    dropoff: firstMatch_(hay, /(?:Return Location|Drop[- ]?off Location)\s*:?\s*([^\n]{3,100})/i),
    sourceKey: confirmation ? hash_(`${provider}|${confirmation}`) : undefined
  };
  if (!event.pickupDate && !event.dropoffDate) event.reviewReason = `${provider} recognized, but rental dates could not be parsed safely.`;
  return event;
}

function parseGenericTravel_(meta, trip) {
  const hay = `${meta.subject}\n${meta.body.slice(0, 5000)}`;
  if (!/(reservation|booking|itinerary|trip)/i.test(meta.subject)) return null;
  if (!/(hotel|flight|airlines|rental car|check[- ]?in|check[- ]?out)/i.test(hay)) return null;
  const date = findRelevantDate_(hay, trip);
  if (!date) return null;
  return { type: 'unknown', action: 'REVIEW', provider: 'Unknown travel provider', date, reviewReason: 'Travel email matched the active trip but this provider is not supported yet.' };
}

function mergeEventIntoTrip_(data, event) {
  data.bookings = data.bookings || [];
  const items = data.bookings;
  let idx = findMatchingBookingIndex_(items, event);

  if (event.action === 'CANCEL') {
    if (idx < 0) idx = items.findIndex(x => x.source && x.source.key === event.sourceKey);
    if (idx < 0) return false;
    const old = items[idx];
    const next = Object.assign({}, old, {
      status: 'STILL NEEDED',
      detail: `Previous ${event.provider} reservation was canceled; rebooking needed.`
    });
    delete next.source;
    if (event.type === 'hotel') next.address = '待确认';
    items[idx] = next;
    return JSON.stringify(old) !== JSON.stringify(next);
  }

  if (event.action !== 'BOOK') return false;
  const safe = eventToPublicBooking_(event);

  if (idx >= 0) {
    const old = items[idx];
    const next = Object.assign({}, old, safe, { label: old.label || safe.label, status: 'BOOKED' });
    items[idx] = next;
    return JSON.stringify(old) !== JSON.stringify(next);
  }

  safe.status = 'BOOKED';
  safe.label = safe.label || autoLabel_(safe);
  items.push(safe);
  return true;
}

function eventToPublicBooking_(event) {
  const base = {
    type: event.type,
    status: 'BOOKED',
    source: { provider: event.provider, key: event.sourceKey, syncedAt: new Date().toISOString() }
  };

  if (event.type === 'hotel') Object.assign(base, {
    name: event.name, checkIn: event.checkIn, checkOut: event.checkOut,
    nights: daysBetween_(event.checkIn, event.checkOut), address: event.address || '待确认',
    detail: `${event.provider} · Gmail auto-sync`
  });
  if (event.type === 'flight') Object.assign(base, {
    from: event.from, to: event.to, date: event.date,
    depart: event.depart || '待确认', arrive: event.arrive || '待确认',
    flightNumber: event.flightNumber || '待确认', nonstop: true,
    detail: `${event.provider} · Gmail auto-sync`
  });
  if (event.type === 'car') Object.assign(base, {
    name: event.name || `${event.provider} rental car`,
    pickup: event.pickup || '待确认', dropoff: event.dropoff || '待确认',
    pickupDate: event.pickupDate, dropoffDate: event.dropoffDate,
    detail: `${event.provider} · Gmail auto-sync`
  });
  return base;
}

function findMatchingBookingIndex_(items, event) {
  let idx = items.findIndex(x => x.source && x.source.key === event.sourceKey);
  if (idx >= 0) return idx;

  if (event.type === 'flight') {
    idx = items.findIndex(x => x.type === 'flight' && x.from === event.from && x.to === event.to && sameDate_(x.date, event.date));
    if (idx >= 0) return idx;
    return items.findIndex(x => x.type === 'flight' && x.status === 'STILL NEEDED' && sameDate_(x.date, event.date));
  }

  if (event.type === 'hotel') {
    idx = items.findIndex(x => /^(hotel|stay)$/.test(x.type) && sameDate_(x.checkIn, event.checkIn) && sameDate_(x.checkOut, event.checkOut));
    if (idx >= 0) return idx;
    return items.findIndex(x => /^(hotel|stay)$/.test(x.type) && x.status === 'STILL NEEDED' && rangesOverlap_(x.checkIn, x.checkOut, event.checkIn, event.checkOut));
  }

  if (event.type === 'car') return items.findIndex(x => x.type === 'car' && (x.status === 'STILL NEEDED' || !x.source));
  return -1;
}

function isRelevantToTrip_(event, trip) {
  if (!trip || !trip.start || !trip.end) return true;
  const start = tripBoundary_(trip.start, -2);
  const end = tripBoundary_(trip.end, 2);

  if (event.type === 'hotel' && event.checkIn && event.checkOut) {
    return rangesOverlap_(toYmd_(start), toYmd_(end), event.checkIn, event.checkOut);
  }
  const d = event.date || event.pickupDate || event.dropoffDate;
  if (!d) return true;
  const when = parseYmd_(d);
  return when >= start && when <= end;
}

function findRelevantDate_(text, trip) {
  const dates = allDates_(text);
  if (!trip || !trip.start || !trip.end) return dates[0] || null;
  const start = tripBoundary_(trip.start, -2);
  const end = tripBoundary_(trip.end, 2);
  return dates.find(x => {
    const d = parseYmd_(x);
    return d >= start && d <= end;
  }) || null;
}

function findTripDateRange_(text, trip) {
  const dates = Array.from(new Set(allDates_(text)));
  if (dates.length < 2) return { start: null, end: null };
  for (let i = 0; i < dates.length - 1; i++) {
    const a = parseYmd_(dates[i]);
    const b = parseYmd_(dates[i + 1]);
    const days = Math.round((b - a) / 86400000);
    if (days < 1 || days > 30) continue;
    const candidate = { start: dates[i], end: dates[i + 1] };
    if (!trip || rangesOverlap_(toYmd_(tripBoundary_(trip.start, -2)), toYmd_(tripBoundary_(trip.end, 2)), candidate.start, candidate.end)) return candidate;
  }
  return { start: null, end: null };
}

function findCheckInOut_(text) {
  return { checkIn: extractDateAfterLabel_(text, /check[- ]?in(?: date)?/i), checkOut: extractDateAfterLabel_(text, /check[- ]?out(?: date)?/i) };
}

function findPickupReturnDates_(text) {
  return { pickupDate: extractDateAfterLabel_(text, /pick[- ]?up(?: date)?/i), dropoffDate: extractDateAfterLabel_(text, /(?:return|drop[- ]?off)(?: date)?/i) };
}

function extractDateAfterLabel_(text, labelRegex) {
  const m = labelRegex.exec(text);
  if (!m) return null;
  return firstDate_(text.slice(m.index, m.index + 260));
}

function findAirportRoute_(text) {
  let m = text.match(/\(([A-Z]{3})\)[^\n]{0,140}?(?:\bto\b|→|➜|–|—)[^\n]{0,140}?\(([A-Z]{3})\)/i);
  if (m) return { from: m[1].toUpperCase(), to: m[2].toUpperCase() };
  m = text.match(/\b([A-Z]{3})\s*(?:→|➜|[-–—]>?|\bto\b)\s*([A-Z]{3})\b/);
  if (m && isLikelyAirportCode_(m[1]) && isLikelyAirportCode_(m[2])) return { from: m[1], to: m[2] };
  return { from: null, to: null };
}

function findFlightDate_(text) {
  for (const r of [/depart(?:ure|ing)?/i, /flight date/i, /outbound/i]) {
    const d = extractDateAfterLabel_(text, r);
    if (d) return d;
  }
  return firstDate_(text);
}

function findFlightTimes_(text) {
  const depart = firstMatch_(text, /(?:Depart|Departure)\s*:?\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  const arrive = firstMatch_(text, /(?:Arrive|Arrival)\s*:?\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  return { depart: depart && depart.toUpperCase(), arrive: arrive && arrive.toUpperCase() };
}

function findUsCanadaHotelAddress_(text) {
  return text.split('\n').map(normalizeSpace_).filter(Boolean)
    .find(line => /\b(?:USA|United States|Canada)\b/i.test(line) && /\d/.test(line) && line.length < 180) || null;
}

function firstDate_(text) { const a = allDates_(text); return a[0] || null; }

function allDates_(text) {
  const out = [];
  const month = '(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)';
  let m;
  const a = new RegExp(`\\b${month}\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(20\\d{2})\\b`, 'gi');
  while ((m = a.exec(text))) out.push(datePartsToYmd_(m[1], m[2], m[3]));
  const b = new RegExp(`\\b(\\d{1,2})\\s+${month}\\s+(20\\d{2})\\b`, 'gi');
  while ((m = b.exec(text))) out.push(datePartsToYmd_(m[2], m[1], m[3]));
  const c = /\b(0?[1-9]|1[0-2])[\/-](0?[1-9]|[12]\d|3[01])[\/-](20\d{2})\b/g;
  while ((m = c.exec(text))) out.push(`${m[3]}-${String(Number(m[1])).padStart(2,'0')}-${String(Number(m[2])).padStart(2,'0')}`);
  return out.filter(Boolean);
}

function datePartsToYmd_(monthName, day, year) {
  const months = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,sept:9,oct:10,nov:11,dec:12};
  const key = String(monthName).toLowerCase();
  const n = months[key.slice(0,4)] || months[key.slice(0,3)];
  return n ? `${year}-${String(n).padStart(2,'0')}-${String(Number(day)).padStart(2,'0')}` : null;
}

function isAirlineSender_(from) { return /(aa\.com|americanairlines\.com|united\.com|delta\.com|southwest\.com|jetblue\.com|alaskaair\.com)/i.test(from); }
function airlineProvider_(from) {
  if (/aa\.com|americanairlines\.com/i.test(from)) return 'American Airlines';
  if (/united\.com/i.test(from)) return 'United Airlines';
  if (/delta\.com/i.test(from)) return 'Delta Air Lines';
  if (/southwest\.com/i.test(from)) return 'Southwest Airlines';
  if (/jetblue\.com/i.test(from)) return 'JetBlue';
  if (/alaskaair\.com/i.test(from)) return 'Alaska Airlines';
  return 'Airline';
}
function isRentalSender_(from) { return /(hertz\.com|enterprise\.com|nationalcar\.com|avis\.com|budget\.com)/i.test(from); }
function rentalProvider_(from) {
  if (/hertz\.com/i.test(from)) return 'Hertz';
  if (/enterprise\.com/i.test(from)) return 'Enterprise';
  if (/nationalcar\.com/i.test(from)) return 'National';
  if (/avis\.com/i.test(from)) return 'Avis';
  if (/budget\.com/i.test(from)) return 'Budget';
  return 'Rental car';
}

function isLikelyAirportCode_(s) {
  return /^[A-Z]{3}$/.test(s) && !new Set(['THE','AND','FOR','YOU','ALL','NEW','USA','CAR','HOT','SUN','MON','TUE','WED','THU','FRI','SAT']).has(s);
}
function autoLabel_(x) { return x.type === 'flight' ? `${x.from} → ${x.to}` : x.type === 'hotel' ? 'Hotel stay' : x.type === 'car' ? 'Rental car' : 'Travel booking'; }

function readTripData_(cfg) {
  const url = `https://api.github.com/repos/${cfg.GITHUB_REPO}/contents/${encodePath_(cfg.TRIP_FILE)}?ref=${encodeURIComponent(cfg.GITHUB_BRANCH)}`;
  const r = githubFetch_(cfg, url, { method: 'get' });
  const obj = JSON.parse(r.getContentText());
  const json = Utilities.newBlob(Utilities.base64Decode(String(obj.content).replace(/\s/g, ''))).getDataAsString('UTF-8');
  return { sha: obj.sha, data: JSON.parse(json) };
}

function writeTripData_(cfg, sha, data, changed, reviewCount) {
  const url = `https://api.github.com/repos/${cfg.GITHUB_REPO}/contents/${encodePath_(cfg.TRIP_FILE)}`;
  const content = JSON.stringify(data, null, 2) + '\n';
  githubFetch_(cfg, url, {
    method: 'put', contentType: 'application/json',
    payload: JSON.stringify({
      message: `Auto-sync Gmail travel data (${changed} changed, ${reviewCount} review)`,
      content: Utilities.base64Encode(content, Utilities.Charset.UTF_8),
      sha, branch: cfg.GITHUB_BRANCH
    })
  });
}

function githubFetch_(cfg, url, options) {
  options = Object.assign({}, options, { muteHttpExceptions: true });
  options.headers = Object.assign({}, options.headers || {}, {
    Authorization: `Bearer ${cfg.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'Family-Travel-OS-Gmail-Sync'
  });
  const r = UrlFetchApp.fetch(url, options);
  if (r.getResponseCode() < 200 || r.getResponseCode() >= 300) throw new Error(`GitHub ${r.getResponseCode()}: ${r.getContentText().slice(0, 1000)}`);
  return r;
}

function loadSeenIds_() {
  return new Set((PropertiesService.getScriptProperties().getProperty('SEEN_MESSAGE_IDS') || '').split(',').filter(Boolean));
}
function saveSeenIds_(newIds) {
  if (!newIds.length) return;
  const p = PropertiesService.getScriptProperties();
  const old = (p.getProperty('SEEN_MESSAGE_IDS') || '').split(',').filter(Boolean);
  p.setProperty('SEEN_MESSAGE_IDS', Array.from(new Set(old.concat(newIds))).slice(-220).join(','));
}
function saveReviewItems_(items) {
  const safe = items.slice(-20).map(x => ({ provider:x.provider, type:x.type, reason:x.reviewReason, receivedAt:x.receivedAt, subjectFingerprint:x.subjectFingerprint }));
  PropertiesService.getScriptProperties().setProperty('LAST_REVIEW_ITEMS', JSON.stringify(safe));
}

function hash_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8)
    .map(b => ('0' + ((b + 256) % 256).toString(16)).slice(-2)).join('');
}
function normalizeBody_(s) { return String(s).replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim(); }
function normalizeSpace_(s) { return String(s || '').replace(/\s+/g,' ').trim(); }
function firstMatch_(text, re) { const m = String(text || '').match(re); return m ? normalizeSpace_(m[1]) : null; }
function sameDate_(a,b) { return !!a && !!b && String(a).slice(0,10) === String(b).slice(0,10); }
function rangesOverlap_(aStart,aEnd,bStart,bEnd) { return !!aStart && !!aEnd && !!bStart && !!bEnd && parseYmd_(aStart) <= parseYmd_(bEnd) && parseYmd_(bStart) <= parseYmd_(aEnd); }
function parseYmd_(s) { return new Date(`${String(s).slice(0,10)}T12:00:00Z`); }
function tripBoundary_(s, deltaDays) { const d = new Date(s); d.setDate(d.getDate() + deltaDays); return d; }
function toYmd_(d) { return Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd'); }
function daysBetween_(a,b) { return a && b ? Math.max(0, Math.round((parseYmd_(b)-parseYmd_(a))/86400000)) : null; }
function formatEt_(d) { return Utilities.formatDate(d, 'America/New_York', 'yyyy-MM-dd HH:mm z'); }
function encodePath_(path) { return String(path).split('/').map(encodeURIComponent).join('/'); }
