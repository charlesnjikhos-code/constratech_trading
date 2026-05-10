/**
 * Zonse Point — Ticket Scanner Portal
 *
 * Supports:
 *  - USB / Bluetooth handheld scanners (keyboard-wedge input)
 *  - Camera-based QR scanning via html5-qrcode
 *  - Online validation against PHP/MySQL backend
 *  - Offline fallback: validates from a locally-cached ticket list
 *  - Automatic sync of offline scans when connection is restored
 */

const API_BASE = 'api/tickets.php';

// ── State ────────────────────────────────────────────────────────────────────

const state = {
    eventId:        '',
    online:         navigator.onLine,
    offlineCache:   {},          // { ticket_id: 'valid'|'used' }
    offlineScanned: [],          // [{ ticket_id, scanned_at }]
    stats:          { valid: 0, invalid: 0, total: 0 },
    cameraActive:   false,
    html5QrScanner: null,
};

// ── DOM refs ─────────────────────────────────────────────────────────────────

const dom = {
    connBadge:      document.getElementById('conn-badge'),
    connLabel:      document.getElementById('conn-label'),
    connDot:        document.querySelector('.conn-dot'),
    eventSelect:    document.getElementById('event-select'),
    scanInput:      document.getElementById('scan-input'),
    resultDisplay:  document.getElementById('result-display'),
    resultIcon:     document.getElementById('result-icon'),
    resultTitle:    document.getElementById('result-title'),
    resultSub:      document.getElementById('result-sub'),
    resultDetail:   document.getElementById('result-detail'),
    statValid:      document.getElementById('stat-valid'),
    statInvalid:    document.getElementById('stat-invalid'),
    statTotal:      document.getElementById('stat-total'),
    scanLog:        document.getElementById('scan-log'),
    cameraSection:  document.getElementById('camera-section'),
    cameraToggle:   document.getElementById('btn-camera-toggle'),
    downloadBtn:    document.getElementById('btn-download'),
    syncBtn:        document.getElementById('btn-sync'),
    offlineInfo:    document.getElementById('offline-info'),
    pendingBadge:   document.getElementById('pending-badge'),
    pendingCount:   document.getElementById('pending-count'),
    toast:          document.getElementById('toast'),
};

// ── Connectivity ──────────────────────────────────────────────────────────────

function updateConnStatus(online) {
    state.online = online;
    dom.connBadge.className = 'conn-badge ' + (online ? 'online' : 'offline');
    dom.connLabel.textContent = online ? 'Online' : 'Offline';

    if (online && state.offlineScanned.length > 0) {
        showToast('Connection restored — tap Sync to upload offline scans.');
    }
}

window.addEventListener('online',  () => updateConnStatus(true));
window.addEventListener('offline', () => updateConnStatus(false));

// ── Events loader ─────────────────────────────────────────────────────────────

async function loadEvents() {
    try {
        const res  = await fetch(`${API_BASE}?action=events`);
        const json = await res.json();
        if (!json.success) return;

        dom.eventSelect.innerHTML = '<option value="">— Select event —</option>';
        json.data.forEach(ev => {
            const opt  = document.createElement('option');
            opt.value  = ev.event_id;
            const date = new Date(ev.event_date).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            opt.textContent = `${ev.event_name} (${date})`;
            dom.eventSelect.appendChild(opt);
        });
    } catch {
        showToast('Could not load events — check connection.');
    }
}

dom.eventSelect.addEventListener('change', () => {
    state.eventId = dom.eventSelect.value;
    loadOfflineCache();
    dom.scanInput.focus();
});

// ── Offline cache persistence ─────────────────────────────────────────────────

function cacheKey()        { return `zp_cache_${state.eventId}`; }
function pendingKey()      { return `zp_pending_${state.eventId}`; }

function loadOfflineCache() {
    if (!state.eventId) return;
    try {
        state.offlineCache   = JSON.parse(localStorage.getItem(cacheKey()))   || {};
        state.offlineScanned = JSON.parse(localStorage.getItem(pendingKey())) || [];
    } catch {
        state.offlineCache   = {};
        state.offlineScanned = [];
    }
    updateOfflineUI();
}

function saveOfflineCache() {
    localStorage.setItem(cacheKey(),   JSON.stringify(state.offlineCache));
    localStorage.setItem(pendingKey(), JSON.stringify(state.offlineScanned));
    updateOfflineUI();
}

function updateOfflineUI() {
    const total   = Object.keys(state.offlineCache).length;
    const pending = state.offlineScanned.length;

    dom.offlineInfo.innerHTML = total
        ? `Offline cache: <strong>${total}</strong> tickets loaded for this event.`
        : 'No offline cache — tap <strong>Download</strong> before the event.';

    if (pending > 0) {
        dom.pendingBadge.classList.add('visible');
        dom.pendingCount.textContent = pending;
    } else {
        dom.pendingBadge.classList.remove('visible');
    }
}

// ── Download tickets for offline use ─────────────────────────────────────────

dom.downloadBtn.addEventListener('click', async () => {
    if (!state.eventId) { showToast('Please select an event first.'); return; }
    if (!state.online)  { showToast('Download requires an internet connection.'); return; }

    dom.downloadBtn.disabled = true;
    dom.downloadBtn.textContent = 'Downloading…';

    try {
        const res  = await fetch(`${API_BASE}?action=download&event_id=${encodeURIComponent(state.eventId)}`);
        const json = await res.json();

        if (!json.success) {
            showToast('Download failed: ' + json.message);
            return;
        }

        state.offlineCache = {};
        json.data.tickets.forEach(t => {
            state.offlineCache[t.ticket_id] = t.status;
        });
        saveOfflineCache();
        showToast(`Downloaded ${json.data.count} tickets for offline use.`);
    } catch {
        showToast('Download error — check connection.');
    } finally {
        dom.downloadBtn.disabled = false;
        dom.downloadBtn.textContent = 'Download';
    }
});

// ── Sync offline scans to server ──────────────────────────────────────────────

dom.syncBtn.addEventListener('click', async () => {
    if (!state.online) { showToast('Sync requires an internet connection.'); return; }
    if (state.offlineScanned.length === 0) { showToast('Nothing to sync.'); return; }

    dom.syncBtn.disabled = true;
    dom.syncBtn.textContent = 'Syncing…';

    try {
        const res  = await fetch(`${API_BASE}?action=sync`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ scanned_tickets: state.offlineScanned }),
        });
        const json = await res.json();

        if (!json.success) {
            showToast('Sync failed: ' + json.message);
            return;
        }

        state.offlineScanned = [];
        saveOfflineCache();
        showToast(`Sync done: ${json.data.synced} synced, ${json.data.skipped} skipped.`);
    } catch {
        showToast('Sync error — check connection.');
    } finally {
        dom.syncBtn.disabled = false;
        dom.syncBtn.textContent = 'Sync';
    }
});

// ── Core scan handler ─────────────────────────────────────────────────────────

async function handleScan(rawCode) {
    const ticketId = rawCode.trim();
    if (!ticketId) return;

    if (!state.eventId) {
        showResult('invalid', 'No Event Selected', 'Choose an event first.', []);
        return;
    }

    showResult('loading', 'Checking…', ticketId, []);

    if (state.online) {
        await validateOnline(ticketId);
    } else {
        validateOffline(ticketId);
    }
}

async function validateOnline(ticketId) {
    try {
        const res  = await fetch(`${API_BASE}?action=validate`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ ticket_id: ticketId, event_id: state.eventId }),
        });
        const json = await res.json();

        if (!json.success) {
            showResult('invalid', 'Server Error', json.message, []);
            logScan(false, ticketId, 'Error');
            return;
        }

        const d = json.data;
        if (d.valid) {
            const chips = [d.ticket_type, d.event_name].filter(Boolean);
            showResult('valid', 'Entry Granted', d.holder_name || ticketId, chips);
            logScan(true, ticketId, d.holder_name);

            // Keep offline cache in sync.
            if (state.offlineCache[ticketId] !== undefined) {
                state.offlineCache[ticketId] = 'used';
                saveOfflineCache();
            }
        } else {
            const reason = {
                not_found:    'Ticket not found',
                already_used: `Already scanned${d.used_at ? ' at ' + formatTime(d.used_at) : ''}`,
                cancelled:    'Ticket cancelled',
                invalid:      'Ticket invalid',
            }[d.reason] || d.message;

            const chips = d.holder_name ? [d.holder_name] : [];
            showResult('invalid', 'Denied', reason, chips);
            logScan(false, ticketId, reason);
        }
    } catch {
        // Network failed mid-scan — fall back to offline.
        updateConnStatus(false);
        validateOffline(ticketId);
    }
}

function validateOffline(ticketId) {
    const status = state.offlineCache[ticketId];

    if (status === undefined) {
        showResult('invalid', 'Denied', 'Ticket not in offline list', []);
        logScan(false, ticketId, 'Not in cache');
        return;
    }

    if (status === 'used') {
        showResult('invalid', 'Denied', 'Already scanned (offline record)', []);
        logScan(false, ticketId, 'Already used');
        return;
    }

    // Mark as used locally and queue for sync.
    state.offlineCache[ticketId] = 'used';
    state.offlineScanned.push({ ticket_id: ticketId, scanned_at: isoNow() });
    saveOfflineCache();

    showResult('valid', 'Entry Granted', ticketId + ' (offline)', ['Offline']);
    logScan(true, ticketId, 'Offline scan');
}

// ── Result display ────────────────────────────────────────────────────────────

let resultTimeout;

function showResult(type, title, subtitle, chips = []) {
    clearTimeout(resultTimeout);

    const icons = { valid: '✅', invalid: '❌', loading: '', idle: '🎫' };

    dom.resultDisplay.className = type;
    dom.resultIcon.textContent  = icons[type] || '';
    dom.resultTitle.textContent = title;
    dom.resultSub.textContent   = subtitle;

    dom.resultDetail.innerHTML  = chips
        .map(c => `<span class="result-chip">${esc(c)}</span>`)
        .join('');

    if (type === 'loading') {
        dom.resultIcon.innerHTML = '<div class="spinner"></div>';
    }

    if (type === 'valid' || type === 'invalid') {
        updateStats(type === 'valid');
        resultTimeout = setTimeout(() => resetResult(), 4000);
    }
}

function resetResult() {
    dom.resultDisplay.className = 'idle';
    dom.resultIcon.textContent  = '🎫';
    dom.resultTitle.textContent = 'Ready to Scan';
    dom.resultSub.textContent   = 'Scan a QR code or barcode to validate entry.';
    dom.resultDetail.innerHTML  = '';
    dom.scanInput.value         = '';
    dom.scanInput.focus();
}

// ── Stats ─────────────────────────────────────────────────────────────────────

function updateStats(valid) {
    state.stats.total++;
    if (valid) state.stats.valid++; else state.stats.invalid++;
    dom.statValid.textContent   = state.stats.valid;
    dom.statInvalid.textContent = state.stats.invalid;
    dom.statTotal.textContent   = state.stats.total;
}

// ── Scan log ──────────────────────────────────────────────────────────────────

function logScan(valid, ticketId, label) {
    const li = document.createElement('li');
    li.className = 'log-item ' + (valid ? 'valid' : 'invalid');
    li.innerHTML = `
        <span class="log-icon">${valid ? '✅' : '❌'}</span>
        <span class="log-id">${esc(ticketId.slice(0, 20))}</span>
        <span class="log-name">${esc(label || '')}</span>
        <span class="log-time">${formatTime(new Date())}</span>
    `;
    dom.scanLog.prepend(li);

    // Keep log to last 50 entries.
    while (dom.scanLog.children.length > 50) {
        dom.scanLog.removeChild(dom.scanLog.lastChild);
    }
}

// ── USB / BT scanner input (keyboard-wedge) ───────────────────────────────────
// Handheld scanners type very fast then press Enter.
// We listen for Enter on the focused text input.

dom.scanInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = dom.scanInput.value.trim();
        if (val) {
            dom.scanInput.value = '';
            handleScan(val);
        }
    }
});

// Keep the scan input focused unless the user is interacting with other controls.
document.addEventListener('click', e => {
    const interactive = ['SELECT', 'BUTTON', 'INPUT', 'A'];
    if (!interactive.includes(e.target.tagName)) {
        dom.scanInput.focus();
    }
});

// Global keydown capture: if the user types while no input is focused and it's
// not a modifier key, redirect keystrokes to the scan input field.
document.addEventListener('keydown', e => {
    if (document.activeElement === dom.scanInput) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key.length === 1) {
        dom.scanInput.focus();
        // The character will land naturally in the focused input.
    }
});

// ── Camera QR scanning (html5-qrcode) ────────────────────────────────────────

dom.cameraToggle.addEventListener('click', () => {
    if (state.cameraActive) {
        stopCamera();
    } else {
        startCamera();
    }
});

function startCamera() {
    if (!window.Html5Qrcode) {
        showToast('QR library not loaded — check your connection.');
        return;
    }

    dom.cameraSection.classList.add('active');
    dom.cameraToggle.textContent = 'Stop Camera';
    state.cameraActive = true;

    state.html5QrScanner = new Html5Qrcode('qr-reader');
    state.html5QrScanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 280, height: 280 } },
        (decodedText) => {
            // Debounce: ignore if we scanned the same code in the last 2 s.
            if (state._lastCameraCode === decodedText) return;
            state._lastCameraCode = decodedText;
            setTimeout(() => { state._lastCameraCode = null; }, 2000);

            handleScan(decodedText);
        },
        () => { /* scan failure — ignore */ }
    ).catch(err => {
        showToast('Camera error: ' + err);
        stopCamera();
    });
}

function stopCamera() {
    if (state.html5QrScanner) {
        state.html5QrScanner.stop().catch(() => {});
        state.html5QrScanner = null;
    }
    dom.cameraSection.classList.remove('active');
    dom.cameraToggle.textContent = 'Use Camera';
    state.cameraActive  = false;
    dom.scanInput.focus();
}

// ── Toast ─────────────────────────────────────────────────────────────────────

let toastTimeout;
function showToast(msg) {
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => dom.toast.classList.remove('show'), 3500);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatTime(d) {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function isoNow() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

// ── Boot ──────────────────────────────────────────────────────────────────────

updateConnStatus(navigator.onLine);
loadEvents();
resetResult();
