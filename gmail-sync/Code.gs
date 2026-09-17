const TRAVEL_OS_VERSION = '1.0.0';

function syncTravelOs() {
  const cfg = getConfig_();
  validateConfig_(cfg);

  const github = readTripData_(cfg);
  const data = github.data;
  const query = buildGmailQuery_(cfg);
  const threads = GmailApp.search(query, 0, Number(cfg.MAX_THREADS || 60));
  const seen = loadSeenIds_();
  const candidates = [];
  const review = [];
  const newlySeen = [];

  const messages = [];
  threads.forEach(thread => thread.getMessages().forEach(message => messages.push(message)));
  messages.sort((a, b) => a.getDate().getTime() - b.getDate().getTime());

  messages.forEach(message => {
    const id = message.getId();
    if (seen.has(id)) return;
    newlySeen.push(id);

    const parsed = parseTravelMessage_(message, data.trip);
    if (!parsed) return;
    if (parsed.reviewReason) {
      review.push(parsed);
      return;
    }
    candidates.push(parsed);
  });

  let changed = 0;
  candidates.forEach(event => {
    changed += mergeEventIntoTrip_(data, event) ? 1 : 0;
  });

  data.sync = data.sync || {};
  data.sync.source = 'Gmail → Google Apps Script → GitHub';
  data.sync.mode = 'auto';
  data.sync.lastChecked = formatEt_(new Date());
  data.sync.lastResult = `${changed} change${changed === 1 ? '' : 's'} · ${review.length} review`;
  data.sync.engine = `gmail-sync/${TRAVEL_OS_VERSION}`;
  data.sync.privacy = 'public-safe-fields-only';

  const before = stableJson_(github.dataOriginal);
  const after = stableJson_(data);
  if (before !== after) {
    writeTripData_(cfg, github.sha, data, changed, review.length);
  }

  saveSeenIds_(newlySeen);
  saveReviewItems_(review);

  console.log(JSON.stringify({
    query,
    scannedThreads: threads.length,
    parsed: candidates.length,
    changed,
    review: review.length,
    committed: before !== after
  }, null, 2));
}

function previewTravelEmails() {
  const cfg = getConfig_();
  const github = readTripData_(cfg);
  const threads = GmailApp.search(buildGmailQuery_(cfg), 0, 30);
  const rows = [];
  threads.forEach(thread => thread.getMessages().forEach(message => {
    const parsed = parseTravelMessage_(message, github.data.trip);
    if (parsed) rows.push({
      date: message.getDate(),
      from: message.getFrom(),
      subject: message.getSubject(),
      parsed
    });
  }));
  console.log(JSON.stringify(rows, null, 2));
  return rows;
}

function testGitHubConnection() {
  const cfg = getConfig_();
  validateConfig_(cfg);
  const github = readTripData_(cfg);
  console.log(JSON.stringify({
    ok: true,
    repo: cfg.GITHUB_REPO,
    branch: cfg.GITHUB_BRANCH,
    file: cfg.TRIP_FILE,
    trip: github.data.trip && github.data.trip.title,
    bookings: (github.data.bookings || []).length
  }, null, 2));
}

function install15MinuteTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'syncTravelOs')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('syncTravelOs').timeBased().everyMinutes(15).create();
  console.log('Installed 15-minute Travel OS sync trigger.');
}

function removeTravelOsTriggers() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'syncTravelOs')
    .forEach(t => ScriptApp.deleteTrigger(t));
}

function getLastReviewItems() {
  const raw = PropertiesService.getScriptProperties().getProperty('LAST_REVIEW_ITEMS') || '[]';
  const items = JSON.parse(raw);
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
    `newer_than:${days}d`,
    '-in:spam',
    '-in:trash',
    '{',
    'from:res-marriott.com',
    'from:tx.ihg.com',
    'from:ihg.com',
    'from:hyatt.com',
    'from:aa.com',
    'from:americanairlines.com',
    'from:united.com',
    'from:delta.com',
    'from:southwest.com',
    'from:jetblue.com',
    'from:alaskaair.com',
    'from:hertz.com',
    'from:enterprise.com',
    'from:nationalcar.com',
    'from:avis.com',
    'from:budget.com',
    'subject:"reservation confirmation"',
    'subject:"trip confirmation"',
    'subject:"booking confirmation"',
    'subject:"reservation is confirmed"',
    '}'
  ].join(' ');
}

function parseTravelMessage_(message, trip) {
  const subject = normalizeSpace_(message.getSubject() || '');
  const from = normalizeSpace_(message.getFrom() || '').toLowerCase();
  const body = normalizeBody_(message.getPlainBody() || '');
  const meta = { subject, from, body, receivedAt: message.getDate() };

  let event = null;
  if (/res-marriott\.com/.test(from)) event = parseMarriott_(meta);
  else if (/(^|[.@])ihg\.com|tx\.ihg\.com/.test(from)) event = parseIhg_(meta);
  else if (isAirlineSender_(from)) event = parseAirline_(meta);
  else if (isRentalSender_(from)) event = parseRentalCar_(meta);
  else event = parseGenericTravel_(meta);

  if (!event) return null;
  event.receivedAt = meta.receivedAt.toISOString();
  event.subjectFingerprint = hash_(subject).slice(0, 16);

  if (!event.sourceKey) {
    event.sourceKey = hash_(`${event.provider || 'travel'}|${subject}|${event.date || event.checkIn || event.pickupDate || ''}`);
  }

  if (!isRelevantToTrip_(event, trip)) return null;
  return event;
}

function parseMarriott_(meta) {
  const confirm = meta.subject.match(/^Reservation Confirmation\s+#([A-Z0-9-]+)\s+for\s+(.+)$/i);
  const cancel = meta.subject.match(/^Reservation Cancellation\s+#([A-Z0-9-]+)\s+for\s+(.+)$/i);
  if (!confirm && !cancel) return null;

  const m = confirm || cancel;
  const confirmation = m[1];
  const hotelName = normalizeSpace_(m[2]);
  const dates = findCheckInOut_(meta.body);
  const address = findUsCanadaHotelAddress_(meta.body);

  const event = {
    type: 'hotel',
    action: cancel ? 'CANCEL' : 'BOOK',
    provider: 'Marriott Bonvoy',
    name: hotelName,
    confirmationHash: hash_(`marriott|${confirmation}`),
    sourceKey: hash_(`marriott|${confirmation}`),
    checkIn: dates.checkIn,
    checkOut: dates.checkOut,
    address: address || undefined
  };

  if (!event.checkIn || !event.checkOut) {
    const fallback = findLikelyDateRange_(meta.body);
    event.checkIn = event.checkIn || fallback.start;
    event.checkOut = event.checkOut || fallback.end;
  }
  if (!event.checkIn || !event.checkOut) event.reviewReason = 'Marriott email recognized but stay dates were not parsed safely.';
  return event;
}

function parseIhg_(meta) {
  const isConfirm = /reservation.+confirmed|reservation is confirmed/i.test(meta.subject + ' ' + meta.body.slice(0, 800));
  const isCancel = /reservation.+cancel(?:led|ation)|cancellation/i.test(meta.subject);
  if (!isConfirm && !isCancel) return null;

  const confirmation = firstMatch_(meta.subject + '\n' + meta.body, /(?:Confirmation(?: Number)?|#)\s*[:#]?\s*([A-Z0-9-]{6,})/i);
  let hotelName = firstMatch_(meta.subject, /reservation at\s+(.+?)\s+is confirmed/i);
  if (!hotelName) hotelName = firstMatch_(meta.body, /(?:your reservation is confirmed!|confirmation #[A-Z0-9-]+)\s*\n+([^\n]{3,80})/i);
  const dates = findCheckInOut_(meta.body);
  const fallback = findLikelyDateRange_(meta.body);

  const event = {
    type: 'hotel',
    action: isCancel ? 'CANCEL' : 'BOOK',
    provider: 'IHG One Rewards',
    name: normalizeSpace_(hotelName || 'IHG hotel'),
    checkIn: dates.checkIn || fallback.start,
    checkOut: dates.checkOut || fallback.end,
    sourceKey: confirmation ? hash_(`ihg|${confirmation}`) : undefined
  };
  if (!event.checkIn || !event.checkOut) event.reviewReason = 'IHG email recognized but stay dates were not parsed safely.';
  return event;
}

function parseAirline_(meta) {
  const hay = `${meta.subject}\n${meta.body}`;
  if (!/(trip|flight|itinerary|reservation|confirmation|ticket)/i.test(hay)) return null;

  const provider = airlineProvider_(meta.from);
  const confirmation = firstMatch_(hay, /(?:confirmation|record locator|confirmation code)\s*(?:number|#|code)?\s*[:#]?\s*([A-Z0-9]{5,8})/i);
  const route = findAirportRoute_(hay);
  const date = findFlightDate_(hay);
  const times = findFlightTimes_(hay);
  const flightNumber = firstMatch_(hay, /\b((?:AA|UA|DL|WN|B6|AS)\s?\d{1,4})\b/i);
  const isCancel = /cancel(?:led|ation)|trip canceled|flight canceled/i.test(meta.subject);

  const event = {
    type: 'flight',
    action: isCancel ? 'CANCEL' : 'BOOK',
    provider,
    from: route.from,
    to: route.to,
    date,
    depart: times.depart,
    arrive: times.arrive,
    flightNumber: flightNumber ? flightNumber.replace(/\s+/, ' ') : undefined,
    nonstop: undefined,
    sourceKey: confirmation ? hash_(`${provider}|${confirmation}`) : undefined
  };

  if (!event.from || !event.to || !event.date) {
    event.reviewReason = `${provider} email recognized but route/date was not parsed safely.`;
  }
  return event;
}

function parseRentalCar_(meta) {
  const hay = `${meta.subject}\n${meta.body}`;
  if (!/(reservation|rental|confirmation|pickup|pick-up)/i.test(hay)) return null;
  const provider = rentalProvider_(meta.from);
  const confirmation = firstMatch_(hay, /(?:confirmation|reservation)(?: number| #| code)?\s*[:#]?\s*([A-Z0-9-]{5,})/i);
  const dates = findPickupReturnDates_(hay);
  const isCancel = /cancel(?:led|ation)/i.test(meta.subject);
  const event = {
    type: 'car',
    action: isCancel ? 'CANCEL' : 'BOOK',
    provider,
    name: `${provider} rental car`,
    pickupDate: dates.pickupDate,
    dropoffDate: dates.dropoffDate,
    pickup: firstMatch_(hay, /(?:Pick[- ]?up Location|Pickup Location)\s*:?\s*([^\n]{3,100})/i),
    dropoff: firstMatch_(hay, /(?:Return Location|Drop[- ]?off Location)\s*:?\s*([^\n]{3,100})/i),
    sourceKey: confirmation ? hash_(`${provider}|${confirmation}`) : undefined
  };
  if (!event.pickupDate && !event.dropoffDate) event.reviewReason = `${provider} rental email recognized but rental dates were not parsed safely.`;
  return event;
}

function parseGenericTravel_(meta) {
  if (!/(reservation|booking|itinerary|trip)/i.test(meta.subject)) return null;
  if (!/(hotel|flight|airlines|rental car|check-in|check in|check-out|check out)/i.test(meta.body.slice(0, 4000))) return null;
  return {
    type: 'unknown',
    action: 'REVIEW',
    provider: 'Unknown travel provider',
    reviewReason: 'Travel-like email found but provider/parser is not supported yet.'
  };
}

function mergeEventIntoTrip_(data, event) {
  data.bookings = data.bookings || [];
  const items = data.bookings;
  let idx = findMatchingBookingIndex_(items, event);

  if (event.action === 'CANCEL') {
    if (idx < 0) idx = items.findIndex(x => x.source && x.source.key === event.sourceKey);
    if (idx < 0) return false;
    const old = items[idx];
    const replacement = Object.assign({}, old, {
      status: 'STILL NEEDED',
      detail: `Previous ${event.provider} reservation was canceled; rebooking needed.`
    });
    delete replacement.source;
    if (event.type === 'hotel') {
      if (old.label) replacement.name = old.label.toLowerCase().includes('los angeles') ? 'Thousand Oaks / Westlake Village' : (old.label.toLowerCase().includes('san jose') ? 'San Jose' : old.name);
      replacement.address = '待确认';
    }
    items[idx] = replacement;
    return stableJson_(old) !== stableJson_(replacement);
  }

  if (event.action !== 'BOOK') return false;

  const safe = eventToPublicBooking_(event);
  if (idx >= 0) {
    const old = items[idx];
    const next = Object.assign({}, old, safe, {
      label: old.label || safe.label,
      status: 'BOOKED'
    });
    items[idx] = next;
    return stableJson_(old) !== stableJson_(next);
  }

  safe.status = 'BOOKED';
  safe.label = safe.label || autoLabel_(safe);
  items.push(safe);
  return true;
}

function eventToPublicBooking_(event) {
  const now = new Date().toISOString();
  const base = {
    type: event.type,
    status: 'BOOKED',
    source: {
      provider: event.provider,
      key: event.sourceKey,
      syncedAt: now
    }
  };

  if (event.type === 'hotel') {
    Object.assign(base, {
      name: event.name,
      checkIn: event.checkIn,
      checkOut: event.checkOut,
      nights: daysBetween_(event.checkIn, event.checkOut),
      address: event.address || '待确认',
      detail: `${event.provider} · Gmail auto-sync`
    });
  } else if (event.type === 'flight') {
    Object.assign(base, {
      from: event.from,
      to: event.to,
      date: event.date,
      depart: event.depart || '待确认',
      arrive: event.arrive || '待确认',
      flightNumber: event.flightNumber || '待确认',
      nonstop: event.nonstop !== false,
      detail: `${event.provider} · Gmail auto-sync`
    });
  } else if (event.type === 'car') {
    Object.assign(base, {
      name: event.name || `${event.provider} rental car`,
      pickup: event.pickup || '待确认',
      dropoff: event.dropoff || '待确认',
      pickupDate: event.pickupDate,
      dropoffDate: event.dropoffDate,
      detail: `${event.provider} · Gmail auto-sync`
    });
  }
  return base;
}

function findMatchingBookingIndex_(items, event) {
  let idx = items.findIndex(x => x.source && x.source.key === event.sourceKey);
  if (idx >= 0) return idx;

  if (event.type === 'flight') {
    idx = items.findIndex(x => x.type === 'flight' && x.from === event.from && x.to === event.to && sameDate_(x.date, event.date));
    if (idx >= 0) return idx;
    idx = items.findIndex(x => x.type === 'flight' && x.status === 'STILL NEEDED' && sameDate_(x.date, event.date));
    return idx;
  }

  if (event.type === 'hotel') {
    idx = items.findIndex(x => (x.type === 'hotel' || x.type === 'stay') && sameDate_(x.checkIn, event.checkIn) && sameDate_(x.checkOut, event.checkOut));
    if (idx >= 0) return idx;
    idx = items.findIndex(x => (x.type === 'hotel' || x.type === 'stay') && x.status === 'STILL NEEDED' && rangesOverlap_(x.checkIn, x.checkOut, event.checkIn, event.checkOut));
    return idx;
  }

  if (event.type === 'car') {
    return items.findIndex(x => x.type === 'car' && (x.status === 'STILL NEEDED' || !x.source));
  }
  return -1;
}

function isRelevantToTrip_(event, trip) {
  if (!trip || !trip.start || !trip.end) return true;
  const start = new Date(trip.start);
  const end = new Date(trip.end);
  start.setDate(start.getDate() - 2);
  end.setDate(end.getDate() + 2);

  if (event.type === 'hotel') {
    if (!event.checkIn || !event.checkOut) return true;
    return rangesOverlap_(toYmd_(start), toYmd_(end), event.checkIn, event.checkOut);
  }
  const date = event.date || event.pickupDate || event.dropoffDate;
  if (!date) return true;
  const d = parseYmd_(date);
  return d >= start && d <= end;
}

function findCheckInOut_(text) {
  return {
    checkIn: extractDateAfterLabel_(text, /check[- ]?in(?: date)?/i),
    checkOut: extractDateAfterLabel_(text, /check[- ]?out(?: date)?/i)
  };
}

function findPickupReturnDates_(text) {
  return {
    pickupDate: extractDateAfterLabel_(text, /pick[- ]?up(?: date)?/i),
    dropoffDate: extractDateAfterLabel_(text, /(?:return|drop[- ]?off)(?: date)?/i)
  };
}

function extractDateAfterLabel_(text, labelRegex) {
  const m = labelRegex.exec(text);
  if (!m) return null;
  const slice = text.slice(m.index, m.index + 220);
  return firstDate_(slice);
}

function findLikelyDateRange_(text) {
  const dates = allDates_(text).filter((x, i, a) => i === 0 || x !== a[i - 1]);
  if (dates.length < 2) return { start: null, end: null };
  for (let i = 0; i < Math.min(dates.length - 1, 8); i++) {
    const a = parseYmd_(dates[i]);
    const b = parseYmd_(dates[i + 1]);
    const days = Math.round((b - a) / 86400000);
    if (days >= 1 && days <= 30) return { start: dates[i], end: dates[i + 1] };
  }
  return { start: null, end: null };
}

function findAirportRoute_(text) {
  let m = text.match(/\(([A-Z]{3})\)[^\n]{0,100}?(?:\bto\b|→|➜|–|—)[^\n]{0,100}?\(([A-Z]{3})\)/i);
  if (m) return { from: m[1].toUpperCase(), to: m[2].toUpperCase() };
  m = text.match(/\b([A-Z]{3})\s*(?:→|➜|\bto\b|[-–—]>?)\s*([A-Z]{3})\b/);
  if (m && isLikelyAirportCode_(m[1]) && isLikelyAirportCode_(m[2])) return { from: m[1], to: m[2] };
  return { from: null, to: null };
}

function findFlightDate_(text) {
  const labels = [/depart(?:ure|ing)?/i, /flight date/i, /outbound/i];
  for (const r of labels) {
    const d = extractDateAfterLabel_(text, r);
    if (d) return d;
  }
  return firstDate_(text);
}

function findFlightTimes_(text) {
  const depart = firstMatch_(text, /(?:Depart|Departure)\s*:?\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  const arrive = firstMatch_(text, /(?:Arrive|Arrival)\s*:?\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  return { depart: depart ? normalizeSpace_(depart).toUpperCase() : null, arrive: arrive ? normalizeSpace_(arrive).toUpperCase() : null };
}

function findUsCanadaHotelAddress_(text) {
  const lines = text.split('\n').map(normalizeSpace_).filter(Boolean);
  return lines.find(line => /\b(?:USA|United States|Canada)\b/i.test(line) && /\d/.test(line) && line.length < 180) || null;
}

function firstDate_(text) {
  const all = allDates_(text);
  return all.length ? all[0] : null;
}

function allDates_(text) {
  const out = [];
  const month = '(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)';
  const re1 = new RegExp(`\\b${month}\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(20\\d{2})\\b`, 'gi');
  let m;
  while ((m = re1.exec(text))) out.push(datePartsToYmd_(m[1], m[2], m[3]));
  const re2 = new RegExp(`\\b(\\d{1,2})\\s+${month}\\s+(20\\d{2})\\b`, 'gi');
  while ((m = re2.exec(text))) out.push(datePartsToYmd_(m[2], m[1], m[3]));
  return out.filter(Boolean);
}

function datePartsToYmd_(monthName, day, year) {
  const months = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,sept:9,oct:10,nov:11,dec:12};
  const n = months[String(monthName).toLowerCase().slice(0,4)] || months[String(monthName).toLowerCase().slice(0,3)];
  if (!n) return null;
  return `${year}-${String(n).padStart(2,'0')}-${String(Number(day)).padStart(2,'0')}`;
}

function isAirlineSender_(from) {
  return /(aa\.com|americanairlines\.com|united\.com|delta\.com|southwest\.com|jetblue\.com|alaskaair\.com)/i.test(from);
}

function airlineProvider_(from) {
  if (/aa\.com|americanairlines\.com/i.test(from)) return 'American Airlines';
  if (/united\.com/i.test(from)) return 'United Airlines';
  if (/delta\.com/i.test(from)) return 'Delta Air Lines';
  if (/southwest\.com/i.test(from)) return 'Southwest Airlines';
  if (/jetblue\.com/i.test(from)) return 'JetBlue';
  if (/alaskaair\.com/i.test(from)) return 'Alaska Airlines';
  return 'Airline';
}

function isRentalSender_(from) {
  return /(hertz\.com|enterprise\.com|nationalcar\.com|avis\.com|budget\.com)/i.test(from);
}

function rentalProvider_(from) {
  if (/hertz\.com/i.test(from)) return 'Hertz';
  if (/enterprise\.com/i.test(from)) return 'Enterprise';
  if (/nationalcar\.com/i.test(from)) return 'National';
  if (/avis\.com/i.test(from)) return 'Avis';
  if (/budget\.com/i.test(from)) return 'Budget';
  return 'Rental car';
}

function isLikelyAirportCode_(s) {
  const block = new Set(['THE','AND','FOR','YOU','ALL','NEW','USA','CAR','HOT','SUN','MON','TUE','WED','THU','FRI','SAT']);
  return /^[A-Z]{3}$/.test(s) && !block.has(s);
}

function autoLabel_(x) {
  if (x.type === 'flight') return `${x.from} → ${x.to}`;
  if (x.type === 'hotel') return 'Hotel stay';
  if (x.type === 'car') return 'Rental car';
  return 'Travel booking';
}

function readTripData_(cfg) {
  const url = `https://api.github.com/repos/${cfg.GITHUB_REPO}/contents/${encodePath_(cfg.TRIP_FILE)}?ref=${encodeURIComponent(cfg.GITHUB_BRANCH)}`;
  const r = githubFetch_(cfg, url, { method: 'get' });
  const obj = JSON.parse(r.getContentText());
  const json = Utilities.newBlob(Utilities.base64Decode(String(obj.content).replace(/\s/g, ''))).getDataAsString('UTF-8');
  const data = JSON.parse(json);
  return { sha: obj.sha, data: JSON.parse(JSON.stringify(data)), dataOriginal: JSON.parse(JSON.stringify(data)) };
}

function writeTripData_(cfg, sha, data, changed, reviewCount) {
  const url = `https://api.github.com/repos/${cfg.GITHUB_REPO}/contents/${encodePath_(cfg.TRIP_FILE)}`;
  const content = JSON.stringify(data, null, 2) + '\n';
  const payload = {
    message: `Auto-sync travel bookings from Gmail (${changed} changed, ${reviewCount} review)`,
    content: Utilities.base64Encode(content, Utilities.Charset.UTF_8),
    sha,
    branch: cfg.GITHUB_BRANCH
  };
  githubFetch_(cfg, url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  });
}

function githubFetch_(cfg, url, options) {
  options = Object.assign({}, options, {
    muteHttpExceptions: true,
    headers: Object.assign({}, options.headers || {}, {
      Authorization: `Bearer ${cfg.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Family-Travel-OS-Gmail-Sync'
    })
  });
  const r = UrlFetchApp.fetch(url, options);
  if (r.getResponseCode() < 200 || r.getResponseCode() >= 300) {
    throw new Error(`GitHub ${r.getResponseCode()}: ${r.getContentText().slice(0, 1000)}`);
  }
  return r;
}

function loadSeenIds_() {
  const raw = PropertiesService.getScriptProperties().getProperty('SEEN_MESSAGE_IDS') || '';
  return new Set(raw.split(',').filter(Boolean));
}

function saveSeenIds_(newIds) {
  if (!newIds.length) return;
  const p = PropertiesService.getScriptProperties();
  const existing = (p.getProperty('SEEN_MESSAGE_IDS') || '').split(',').filter(Boolean);
  const merged = Array.from(new Set(existing.concat(newIds))).slice(-220);
  p.setProperty('SEEN_MESSAGE_IDS', merged.join(','));
}

function saveReviewItems_(items) {
  const safe = items.slice(-20).map(x => ({
    provider: x.provider,
    type: x.type,
    reason: x.reviewReason,
    receivedAt: x.receivedAt,
    subjectFingerprint: x.subjectFingerprint
  }));
  PropertiesService.getScriptProperties().setProperty('LAST_REVIEW_ITEMS', JSON.stringify(safe));
}

function hash_(s) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8);
  return bytes.map(b => ('0' + ((b + 256) % 256).toString(16)).slice(-2)).join('');
}

function normalizeBody_(s) {
  return String(s).replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function normalizeSpace_(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function firstMatch_(text, re) {
  const m = String(text || '').match(re);
  return m ? normalizeSpace_(m[1]) : null;
}

function sameDate_(a, b) {
  return !!a && !!b && String(a).slice(0, 10) === String(b).slice(0, 10);
}

function rangesOverlap_(aStart, aEnd, bStart, bEnd) {
  if (!aStart || !aEnd || !bStart || !bEnd) return false;
  return parseYmd_(aStart) <= parseYmd_(bEnd) && parseYmd_(bStart) <= parseYmd_(aEnd);
}

function parseYmd_(s) {
  return new Date(`${String(s).slice(0, 10)}T12:00:00Z`);
}

function toYmd_(d) {
  return Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd');
}

function daysBetween_(a, b) {
  if (!a || !b) return null;
  return Math.max(0, Math.round((parseYmd_(b) - parseYmd_(a)) / 86400000));
}

function formatEt_(d) {
  return Utilities.formatDate(d, 'America/New_York', 'yyyy-MM-dd HH:mm z');
}

function stableJson_(obj) {
  return JSON.stringify(obj);
}

function encodePath_(path) {
  return String(path).split('/').map(encodeURIComponent).join('/');
}
