// Full JS extracted from index.html
// data
let monthlyHours = {}; // { "AUG 2025": { flights: [ {id, timestamp, hours, entryDate, type, points} ] } }
let personnelFileLink = '';

// Activity definitions for points calculation
const pointActivities = [
    { id: 'patrol-90', points: 5, type: 'patrol' },
    { id: 'patrol-60', points: 4, type: 'patrol' },
    { id: 'patrol-30', points: 3, type: 'patrol' },
    { id: 'partnered-flight', points: 2, type: 'addon' },
    { id: 'pursuit', points: 2, type: 'exclusive' },
    { id: 'other-deployment', points: 2, type: 'exclusive' },
    { id: 'event-deployment', points: 2, type: 'exclusive' },
    { id: 'sfs-deployment', points: 5, type: 'exclusive' },
    { id: 'training-instructor', points: 6, type: 'exclusive' }
];

// cookie helpers
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/; SameSite=Lax";
}
function getCookie(name) {
    const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[2]) : null;
}

// Helper function to format stats display
function formatStat(label, hours, money) {
    if (hours === 0) return '';
    return `<div><strong>${label}:</strong> ${hours.toFixed(1)}h (${formatMoney(money)})</div>`;
}

// localStorage helpers
function saveMonthlyHoursToStorage() {
    try { localStorage.setItem('monthlyHours', JSON.stringify(monthlyHours)); } catch (e) { console.warn(e); }
    updateMonthlyHoursDisplay();
    updateOTMonthlyHoursDisplay();
}
function loadMonthlyHoursFromStorage() {
    try {
        const raw = localStorage.getItem('monthlyHours');
        if (raw) monthlyHours = JSON.parse(raw);
    } catch (e) { console.warn(e); }
    updateMonthlyHoursDisplay();
    updateOTMonthlyHoursDisplay();
}

// collapsed months persistence
function loadCollapsedMonths() {
    try {
        const raw = localStorage.getItem('collapsedMonths');
        return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
}
function saveCollapsedMonths(obj) {
    try { localStorage.setItem('collapsedMonths', JSON.stringify(obj)); } catch (e) { console.warn(e); }
}

function openSFSReports() {
    window.open('https://lspd.gta.world/viewforum.php?f=952', '_blank');
}
function openStudentArea() {
    window.open('https://lspd.gta.world/viewforum.php?f=2267', '_blank');
}
// NEW: open overtime forum thread (button)
function openOvertimeForum() {
    window.open('https://lspd.gta.world/viewtopic.php?f=195&t=107709', '_blank');
}

// page load
window.onload = function () {
    loadSavedData();
    updateMonthlyHoursDisplay();
    updateFlightLogButton();
    updateRemoveOfficerBtn();

    // Auto-fill personnel file link in OT request if saved
    const savedLink = getCookie('personnelFileLink');
    if (savedLink) {
        const otFlightLogLink = document.getElementById('ot-flightlog-link');
        if (otFlightLogLink) {
            otFlightLogLink.value = savedLink;
        }
    }

    // Auto-fill routing number if saved
    const savedRouting = getCookie('routingNumber');
    if (savedRouting) {
        const routingInput = document.getElementById('ot-routing');
        if (routingInput) {
            routingInput.value = savedRouting;
        }
    }

    // Auto-fill instructor name if saved
    const savedInstructor = getCookie('instructorName');
    if (savedInstructor) {
        const instructorInput = document.getElementById('instructor-name');
        if (instructorInput) {
            instructorInput.value = savedInstructor;
        }
    }

    // Auto-fill tactical pilot if saved
    const savedTacticalPilot = getCookie('tacticalPilot');
    if (savedTacticalPilot) {
        const tacticalPilotInput = document.getElementById('tactical-pilot');
        if (tacticalPilotInput) {
            tacticalPilotInput.value = savedTacticalPilot;
        }
    }

    // Auto-fill OT officer name if saved
    const savedOtOfficerName = getCookie('otOfficerName');
    if (savedOtOfficerName) {
        const otOfficerNameInput = document.getElementById('ot-officer-name');
        if (otOfficerNameInput) {
            otOfficerNameInput.value = savedOtOfficerName;
        }
    }

    // Add event listener to save routing number as it's typed
    const routingInput = document.getElementById('ot-routing');
    if (routingInput) {
        routingInput.addEventListener('input', function () {
            const value = this.value.trim();
            setCookie('routingNumber', value, 9999);
        });
    }

    // Add event listener to save instructor name as it's typed
    const instructorInput = document.getElementById('instructor-name');
    if (instructorInput) {
        instructorInput.addEventListener('input', function () {
            const value = this.value.trim();
            setCookie('instructorName', value, 9999);
        });
    }

    // Add event listener to save tactical pilot as it's typed
    const tacticalPilotInput = document.getElementById('tactical-pilot');
    if (tacticalPilotInput) {
        tacticalPilotInput.addEventListener('input', function () {
            const value = this.value.trim();
            setCookie('tacticalPilot', value, 9999);
        });
    }

    // Add event listener to save OT officer name as it's typed
    const otOfficerNameInput = document.getElementById('ot-officer-name');
    if (otOfficerNameInput) {
        otOfficerNameInput.addEventListener('input', function () {
            const value = this.value.trim();
            setCookie('otOfficerName', value, 9999);
        });
    }

    const deploymentSelect = document.getElementById('deployment-type');
    const customInput = document.getElementById('custom-deployment');

    // Hide custom input by default
    if (customInput) {
        customInput.style.display = 'none';
    }

    if (deploymentSelect) {
        // Initial check
        if (customInput && deploymentSelect.value === 'Custom') {
            customInput.style.display = 'block';
        }

        // Change event listener
        deploymentSelect.addEventListener('change', function () {
            if (customInput) {
                customInput.style.display = this.value === 'Custom' ? 'block' : 'none';
                if (this.value !== 'Custom') {
                    customInput.value = ''; // Clear the input when hidden
                }
            }
        });
    }

    const flightDate = document.getElementById('flight-date');
    if (flightDate) flightDate.addEventListener('change', updateFlightLogButton);

    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    checkboxes.forEach(cb => cb.addEventListener('change', updateFlightLogButton));
};

function loadSavedData() {
    loadMonthlyHoursFromStorage();
    const saved = getCookie('personnelFileLink');
    if (saved) personnelFileLink = saved;
    if (personnelFileLink || getCookie('personnelSaved') === '1') {
        const section = document.getElementById('personnel-section'); if (section) section.remove();
    }
}

function updateFlightLogButton() {
    const date = document.getElementById('flight-date').value;
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]:checked');
    const button = document.getElementById('generate-flight-btn');

    // Check for invalid combinations
    const hasPatrol = document.getElementById('patrol-90').checked ||
        document.getElementById('patrol-60').checked ||
        document.getElementById('patrol-30').checked;
    let isValid = true;

    if (hasPatrol) {
        // While on patrol, can't do: pursuit, other deployment, event deployment, or instruction
        const incompatibleWithPatrol = [
            'pursuit',
            'other-deployment',
            'event-deployment',
            'training-instructor'
        ];

        incompatibleWithPatrol.forEach(id => {
            if (document.getElementById(id)?.checked) {
                isValid = false;
            }
        });
    }

    // Can only have one patrol type selected at a time
    const patrolCount = ['patrol-90', 'patrol-60', 'patrol-30'].filter(id =>
        document.getElementById(id)?.checked
    ).length;
    if (patrolCount > 1) {
        isValid = false;
    }

    // Can only have one each of other deployment and event deployment
    ['other-deployment', 'event-deployment'].forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox?.checked) {
            // Check for incompatible combinations
            if (hasPatrol) {
                isValid = false;
            }
        }
    });

    // Enable button only if date selected, at least one checkbox checked, and combinations are valid
    if (date && checkboxes.length > 0 && isValid) {
        button.classList.remove('disabled');
        button.disabled = false;
    } else {
        button.classList.add('disabled');
        button.disabled = true;
    }
}

function toggleCheckbox(id) {
    const cb = document.getElementById(id); if (!cb) return; cb.checked = !cb.checked; updateFlightLogButton();
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page'); pages.forEach(p => p.classList.remove('active'));
    const navBtns = document.querySelectorAll('.nav-btn'); navBtns.forEach(b => b.classList.remove('active'));
    const pageEl = document.getElementById(pageId);
    if (pageEl) pageEl.classList.add('active');
    // set the clicked nav button to active (works if triggered by a nav button)
    try {
        if (event && event.target && event.target.classList.contains('nav-btn')) event.target.classList.add('active');
    } catch (e) { }
}

function setTodayDate() {
    const today = new Date();
    const utcDate = new Date(today.getTime() + today.getTimezoneOffset() * 60000);
    document.getElementById('flight-date').value = utcDate.toISOString().split('T')[0];
    updateFlightLogButton();
}
function setSFSToday() {
    const today = new Date(); const utcDate = new Date(today.getTime() + today.getTimezoneOffset() * 60000);
    document.getElementById('sfs-date').value = utcDate.toISOString().split('T')[0];
}

function savePersonnelFile() {
    const linkEl = document.getElementById('personnel-file');
    const link = linkEl ? linkEl.value : '';
    if (!link) { alert('Please paste a link before saving.'); return; }
    personnelFileLink = link;
    setCookie('personnelFileLink', personnelFileLink, 9999);
    setCookie('personnelSaved', '1', 9999);
    const section = document.getElementById('personnel-section'); if (section) section.remove();
}
function openPersonnelFile() {
    const link = personnelFileLink || getCookie('personnelFileLink');
    if (link) window.open(link, '_blank'); else alert('No personnel file link saved. Please save a link first.');
}

// Helper function to calculate flight hours and format display
function calculateMonthStats(flights) {
    let astroHours = 0;
    let sfsHours = 0;
    if (Array.isArray(flights)) {
        flights.forEach(flight => {
            if (typeof flight.hours === 'number' && !isNaN(flight.hours)) {
                if (flight.type === 'SFS') {
                    sfsHours += flight.hours;
                } else {
                    astroHours += flight.hours;
                }
            }
        });
    }
    const totalHours = astroHours + sfsHours;
    const astroOT = astroHours * 3000;
    const sfsOT = sfsHours * 6000;
    const totalOT = astroOT + sfsOT;
    return { astroHours, sfsHours, totalHours, astroOT, sfsOT, totalOT };
}

function formatMoney(amount) {
    return '$' + amount.toLocaleString('en-US');
}

// Helper function to calculate flight hours and overtime
function calculateFlightStats(flights) {
    let astroHours = 0;
    let sfsHours = 0;
    let totalPoints = 0;
    let totalFlights = 0;

    if (Array.isArray(flights)) {
        totalFlights = flights.length;
        flights.forEach(flight => {
            if (typeof flight.hours === 'number' && !isNaN(flight.hours)) {
                if (flight.type === 'SFS') {
                    sfsHours += flight.hours;
                } else {
                    astroHours += flight.hours;
                }
            }
            if (typeof flight.points === 'number' && !isNaN(flight.points)) {
                totalPoints += flight.points;
            }
        });
    }

    const totalHours = astroHours + sfsHours;
    const astroOT = astroHours * 3000;
    const sfsOT = sfsHours * 6000;
    const totalOT = astroOT + sfsOT;

    return {
        astroHours,
        sfsHours,
        totalHours,
        astroOT,
        sfsOT,
        totalOT,
        totalPoints,
        totalFlights
    };
}

function formatMoney(amount) {
    return '$' + amount.toLocaleString('en-US');
}

// helper: format date portion as 16/AUG/2025 and time as HH:MM UTC
function formatDateAndTimeUTC(isoString) {
    try {
        const d = new Date(isoString);
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const day = String(d.getUTCDate()).padStart(2, '0');
        const mon = months[d.getUTCMonth()];
        const year = d.getUTCFullYear();
        const hh = String(d.getUTCHours()).padStart(2, '0');
        const mm = String(d.getUTCMinutes()).padStart(2, '0');
        return `${day}/${mon}/${year} ${hh}:${mm} UTC`;
    } catch (e) { return isoString; }
}

// Sane UTC time normalizer for user-entered XX:XX strings.
// Returns a string like "HH:MM UTC" or appends " UTC" if it can't fully normalize.
function normalizeToUTCTime(input) {
    if (!input || typeof input !== 'string') return '00:00 UTC';
    const s = input.trim();
    if (s === '') return '00:00 UTC';
    // match H:MM or HH:MM (allow spaces around colon)
    const m = s.match(/^(\d{1,2})\s*[:\-]\s*(\d{2})$/);
    if (m) {
        let hh = parseInt(m[1], 10);
        let mm = parseInt(m[2], 10);
        if (isNaN(hh) || isNaN(mm)) return s + ' UTC';
        if (hh < 0) hh = 0;
        if (hh > 23) hh = hh % 24; // wrap large hours sensibly
        if (mm < 0) mm = 0;
        if (mm > 59) mm = mm % 60;
        return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ' UTC';
    }
    // if doesn't match expected pattern, return value with UTC appended so it's explicit
    return s + (s.toUpperCase().includes('UTC') ? '' : ' UTC');
}

// update UI: sort months ascending (older first), build collapsible boxes
function updateMonthlyHoursDisplay() {
    const display = document.getElementById('monthly-hours-display');
    if (display) updateMonthlyHoursDisplayForElement(display);
}

function updateMonthlyHoursDisplayForElement(display, idPrefix) {
    if (!display) return;
    const collapsed = loadCollapsedMonths();

    if (!monthlyHours || Object.keys(monthlyHours).length === 0) {
        display.innerHTML = '<div class="month-stat">No flight hours recorded yet</div>';
        return;
    }

    function formatStat(label, hours, money) {
        if (hours === 0) return '';
        return `<div><strong>${label}:</strong> ${hours.toFixed(1)}h (${formatMoney(money)})</div>`;
    }

    // turn entries into [ [monthKey, data], ... ] and sort ascending by month/year
    const entries = Object.entries(monthlyHours);
    entries.sort((a, b) => {
        const toDate = (m) => {
            const parts = m.split(' ');
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const mi = monthNames.indexOf(parts[0]);
            const year = parseInt(parts[1], 10) || 0;
            return Date.UTC(year, mi, 1);
        };
        return toDate(a[0]) - toDate(b[0]); // ascending: older first
    });

    let html = '';
    entries.forEach(([monthKey, data]) => {
        const stats = calculateFlightStats(data.flights);
        const totalDisplay = stats.totalHours.toFixed(1);
        const encodedMonth = encodeURIComponent(monthKey);
        const isCollapsed = !!collapsed[monthKey];
        const caretClass = isCollapsed ? 'caret collapsed' : 'caret';

        html += `<div class="month-stat" data-month="${monthKey}">
                    <div class="month-header" onclick="toggleMonth('${encodedMonth}')">
                        <div class="month-left">
                            <svg class="${caretClass} icon-shrink" viewBox="0 0 24 24" width="14" height="14">
                                <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"></path>
                            </svg>
                            <div class="month-title">${monthKey}</div>
                        </div>
                        <div class="month-total">${stats.totalHours.toFixed(1)} hrs</div>
                    </div>
                    <div class="month-flights ${isCollapsed ? 'collapsed' : ''}" id="flights-${encodedMonth}">
                        <div class="month-stats-summary">
                            ${formatStat('ASTRO', stats.astroHours, stats.astroOT)}
                            ${formatStat('SFS', stats.sfsHours, stats.sfsOT)}
                            ${stats.totalHours > 0 ? '<div><strong>Total Hours:</strong> ' + stats.totalHours.toFixed(1) + 'h</div>' : ''}
                            ${stats.totalOT > 0 ? '<div><strong>Total OT:</strong> ' + formatMoney(stats.totalOT) + '</div>' : ''}
                        </div>`;

        if (Array.isArray(data.flights) && data.flights.length > 0) {
            // sort flights by timestamp ascending (older first)
            const flightsSorted = data.flights.slice().sort((x, y) => new Date(x.timestamp) - new Date(y.timestamp));
            flightsSorted.forEach(flight => {
                const entryDate = new Date(flight.entryDate + 'T00:00:00Z');
                const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                const dateDisplay = String(entryDate.getUTCDate()).padStart(2, '0') + '/' + months[entryDate.getUTCMonth()] + '/' + entryDate.getUTCFullYear();
                const displayDT = formatDateAndTimeUTC(flight.timestamp);
                const timeOnly = displayDT.split(' ').slice(1).join(' '); // "14:23 UTC"
                const hoursText = (typeof flight.hours === 'number' && !isNaN(flight.hours)) ? flight.hours.toFixed(1) : null;
                const safeId = String(flight.id).replace(/'/g, "\\'");
                const flightType = flight.type || 'ASTRO (Normal)'; // Default to normal if type not set
                const points = typeof flight.points === 'number' ? flight.points : 0;
                // per-flight OT calculation: ASTRO = $3,000/hr, SFS = $6,000/hr
                const perHourRate = (flight.type && flight.type === 'SFS') ? 6000 : 3000;
                const otAmount = (typeof flight.hours === 'number' && !isNaN(flight.hours)) ? Math.round(flight.hours * perHourRate) : 0;
                // build parts and omit hours/OT if not provided
                const parts = [dateDisplay, flightType, timeOnly];
                if (hoursText !== null) parts.push(hoursText + 'h');
                parts.push(points + 'pts');
                if (otAmount > 0 && hoursText !== null) parts.push(formatMoney(otAmount));
                const line = parts.join(' - ');
                html += `<div class="flight-entry" id="flight-${safeId}">
                                    <div>${line}</div>
                                    <div><button class="flight-remove-btn" onclick="removeFlight('${encodedMonth}','${safeId}')">✕</button></div>
                                </div>`;
            });
        } else {
            html += `<div class="flight-entry"><div>No flights</div></div>`;
        }

        html += `</div></div>`;
    });

    display.innerHTML = html;
}

// toggle collapsed state per month & persist
function toggleMonth(encodedMonthKey, prefix) {
    const monthKey = decodeURIComponent(encodedMonthKey);

    // Find and update all matching sections (both in flight log and overtime request)
    const prefixes = ['flights-', 'ot-flights-'];
    prefixes.forEach(p => {
        const flightsEl = document.getElementById(p + encodedMonthKey);
        if (flightsEl) {
            const monthStat = flightsEl.closest('.month-stat');
            const caretIcon = monthStat?.querySelector('.caret');

            if (flightsEl.classList.contains('collapsed')) {
                flightsEl.classList.remove('collapsed');
                caretIcon?.classList.remove('collapsed');
            } else {
                flightsEl.classList.add('collapsed');
                caretIcon?.classList.add('collapsed');
            }
        }
    });

    // Update collapsed state in storage
    const collapsed = loadCollapsedMonths();
    if (collapsed[monthKey]) {
        delete collapsed[monthKey];
    } else {
        collapsed[monthKey] = true;
    }
    saveCollapsedMonths(collapsed);
}

// Add officer: create a simple crew-member entry (no per-entry remove button)
function addFlightOfficer() {
    const container = document.getElementById('flight-officers');
    if (!container) return;
    const newOfficer = document.createElement('div');
    newOfficer.className = 'crew-member';
    // input takes full width inside crew-member
    newOfficer.innerHTML = `<input type="text" placeholder="DIVISION RANK FIRSTNAME LASTNAME">`;
    container.appendChild(newOfficer);
    updateRemoveOfficerBtn();
}

// Remove only button (removes last officer in the list)
function removeLastOfficer() {
    const container = document.getElementById('flight-officers');
    if (!container) return;
    const children = container.querySelectorAll('.crew-member');
    if (children.length === 0) return;
    container.removeChild(children[children.length - 1]);
    updateRemoveOfficerBtn();
}

// update state of the single remove button
function updateRemoveOfficerBtn() {
    const btn = document.getElementById('remove-officer-btn');
    const container = document.getElementById('flight-officers');
    if (!btn || !container) return;
    const has = container.querySelectorAll('.crew-member').length > 0;
    if (has) {
        btn.classList.remove('disabled');
        btn.disabled = false;
    } else {
        btn.classList.add('disabled');
        btn.disabled = true;
    }
}

function generateFlightLog() {
    const date = document.getElementById('flight-date').value;
    const hoursRaw = document.getElementById('flight-hours').value;
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]:checked');

    if (!date) { alert('Please select a date for the flight log entry'); return; }
    if (checkboxes.length === 0) { alert('Please select at least one activity'); return; }

    // Build month key (based off the entry date's month)
    const dateObj = new Date(date + 'T00:00:00Z');
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthKey = months[dateObj.getUTCMonth()] + ' ' + dateObj.getUTCFullYear();

    if (!monthlyHours[monthKey]) monthlyHours[monthKey] = { total: 0, flights: [] };

    // create flight id and timestamp (exact UTC time clicked)
    const flightId = String(Date.now()) + '-' + Math.random().toString(36).slice(2, 8);
    const timestampUTC = new Date().toISOString();
    const hours = (hoursRaw && !isNaN(parseFloat(hoursRaw))) ? parseFloat(hoursRaw) : null;

    // Calculate points based on selected checkboxes
    let points = 0;
    let highestPatrolPoints = 0;
    let sfsPoints = 0;
    let partneredPoints = 0;

    // Check all checkboxes
    pointActivities.forEach(activity => {
        const checkbox = document.getElementById(activity.id);
        if (checkbox && checkbox.checked) {
            if (activity.id === 'sfs-deployment') {
                sfsPoints = activity.points;
            } else if (activity.id === 'partnered-flight') {
                partneredPoints = activity.points;
            } else if (activity.type === 'patrol') {
                highestPatrolPoints = Math.max(highestPatrolPoints, activity.points);
            } else if (activity.type === 'exclusive') {
                points = activity.points;
            }
        }
    });

    // Calculate final points:
    // If we have patrol points, use those, otherwise use the exclusive points
    // Then add SFS and partnered points if present
    points = (highestPatrolPoints > 0 ? highestPatrolPoints : points) + sfsPoints + partneredPoints;

    // Check if SFS deployment is checked
    const isSFS = document.getElementById('sfs-deployment') && document.getElementById('sfs-deployment').checked;

    monthlyHours[monthKey].flights.push({
        points,
        id: flightId,
        timestamp: timestampUTC,
        hours: (hours !== null && !isNaN(hours)) ? Number(hours) : null,
        entryDate: date,
        type: isSFS ? 'SFS' : 'ASTRO (Normal)'
    });

    saveMonthlyHoursToStorage();

    // Check for logical restrictions
    function isPatrolSelected() {
        return document.getElementById('patrol-90').checked ||
            document.getElementById('patrol-60').checked ||
            document.getElementById('patrol-30').checked;
    }

    // Validate activity selections based on rules
    const patrol = document.getElementById('patrol-90').checked ? 'patrol-90' :
        document.getElementById('patrol-60').checked ? 'patrol-60' :
            document.getElementById('patrol-30').checked ? 'patrol-30' : null;

    const hasPatrol = patrol !== null;
    const hasPursuit = document.getElementById('pursuit').checked;
    const hasOtherDeployment = document.getElementById('other-deployment').checked;
    const hasSFSDeployment = document.getElementById('sfs-deployment').checked;
    const hasEventDeployment = document.getElementById('event-deployment').checked;
    const hasPartneredFlight = document.getElementById('partnered-flight').checked;
    const hasTrainingInstructor = document.getElementById('training-instructor').checked;

    // Validate selections
    if (hasPatrol && (hasOtherDeployment || hasEventDeployment || hasTrainingInstructor)) {
        alert('Cannot log other deployments, event deployments, or instruction flights while on patrol');
        return;
    }

    // Format date for BBCode (DD/MON/YYYY)
    const formattedDate = String(dateObj.getUTCDate()).padStart(2, '0') + '/' + months[dateObj.getUTCMonth()] + '/' + dateObj.getUTCFullYear();
    // Show N/A when hours missing, ensure exactly one decimal place
    const hoursDisplay = (hours !== null && !isNaN(hours)) ? Number(hours.toFixed(1)) : 'N/A';

    // Define the correct order of activities and their display names
    const orderedActivities = [
        { id: 'pursuit', name: 'Pursuit Deployment' },
        { id: 'other-deployment', name: 'Other Deployment' },
        { id: 'patrol-30', name: '30+ Minute Patrol' },
        { id: 'patrol-60', name: '60+ Minute Patrol' },
        { id: 'patrol-90', name: '90+ Minute Patrol' },
        { id: 'event-deployment', name: 'Event Deployment' },
        { id: 'sfs-deployment', name: 'SFS Deployment' },
        { id: 'partnered-flight', name: 'Partnered Flight' },
        { id: 'training-instructor', name: 'Training Flight (Instructor)' }
    ];

    let activitiesHTML = '';
    orderedActivities.forEach(activity => {
        const checkbox = document.getElementById(activity.id);
        if (checkbox) {
            const points = pointActivities.find(p => p.id === activity.id)?.points || 0;
            activitiesHTML += `${checkbox.checked ? '[cbc]' : '[cb]'} [b]${activity.name}[/b]: ${points} points\n`;
        }
    });

    const bbcode = `[divbox2=white][center][b]FLIGHT LOG ENTRY[/b][/center]
[hr][/hr]

[list=none][*][b]Date[/b]: ${formattedDate}
[*][b]Total Flight Hours (Optional)[/b]: ${hoursDisplay} [/list]

[list=none]
${activitiesHTML}[/list][/divbox2]`;

    document.getElementById('flight-output').value = bbcode;

    updateMonthlyHoursDisplay();

    // clear hours, date, and all checkboxes for next entry
    document.getElementById('flight-hours').value = '';
    // clear the date as requested
    const dateEl = document.getElementById('flight-date'); if (dateEl) dateEl.value = '';
    // uncheck all activity checkboxes
    const allCbs = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    allCbs.forEach(cb => { cb.checked = false; });
    updateFlightLogButton(); // ensure button state updated
}

// remove a flight by month and id, update totals & storage, refresh UI
function removeFlight(encodedMonthKey, flightId) {
    const monthKey = decodeURIComponent(encodedMonthKey);
    if (!monthlyHours[monthKey]) return;
    const flights = monthlyHours[monthKey].flights || [];
    const idx = flights.findIndex(f => String(f.id) === String(flightId));
    if (idx === -1) return;
    flights.splice(idx, 1)[0];

    // If this was the last flight in the month, remove the entire month
    if (flights.length === 0) {
        delete monthlyHours[monthKey];
    }

    saveMonthlyHoursToStorage();
    updateMonthlyHoursDisplay();
}

// SFS & Training report generators retained from previous implementation
function generateSFSReport() {
    const tacticalPilot = document.getElementById('tactical-pilot').value;
    const deploymentType = document.getElementById('deployment-type').value;
    const customDeployment = document.getElementById('custom-deployment').value;
    const date = document.getElementById('sfs-date').value;
    const timeStartedRaw = document.getElementById('time-started').value;
    const timeEndedRaw = document.getElementById('time-ended').value;
    const narrative = document.getElementById('narrative').value;
    const additionalNotes = document.getElementById('additional-notes').value;
    const oocNotes = document.getElementById('ooc-notes').value;
    const caseFile = document.getElementById('case-file').value;
    const signature = document.getElementById('signature').value;

    if (!date) { alert('Please select a date for the SFS deployment report'); return; }

    const dateObj = new Date(date + 'T00:00:00Z');
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const formattedDate = String(dateObj.getUTCDate()).padStart(2, '0') + '/' + months[dateObj.getUTCMonth()] + '/' + dateObj.getUTCFullYear();

    // Normalize times to display with UTC explicitly
    const timeStarted = normalizeToUTCTime(timeStartedRaw); // e.g. "14:05 UTC" or "input UTC"
    const timeEnded = normalizeToUTCTime(timeEndedRaw);

    // collect officers (each crew-member input)
    const officerInputs = document.querySelectorAll('#flight-officers input[type="text"]');
    let officersHTML = '';
    let hasOfficers = false;
    officerInputs.forEach(input => {
        if (input.value.trim()) {
            officersHTML += `[*] ${input.value.trim()}\n`;
            hasOfficers = true;
        }
    });

    const finalDeploymentType = deploymentType === 'Custom' ? customDeployment : deploymentType;

    // Only include flight officers section if there are officers
    const flightOfficersSection = hasOfficers ? `[u]1.2[/u] [b]Tactical Flight Officers: [/b][list]
${officersHTML}[/list]

` : '';

    const bbcode = `[divbox2=white][center][asdlogo=200][color=transparent][size=40]asdbestsd[/size][/color][lspdlogo=200][color=transparent][size=40]asdbestsd[/size][/color][sfslogo=200]

[size=150][b]LOS SANTOS POLICE DEPARTMENT[/b][/size]
[size=115][b]Air Support Division[/b][/size]
[i]The mission is the same, only the vehicle has changed.[/i]
[hr][/hr][size=125]Special Flights Section Deployment Report[/size][hr][/hr]


[justify][b][size=150]Section I[/size][/b]
[hr][/hr]

[u]1.1[/u] [b]Tactical Pilot: [/b][list]
[*] ${tacticalPilot || 'DIVISION RANK FIRSTNAME LASTNAME'}
[/list]
${flightOfficersSection}


[u]1.3[/u] [b]Type of Deployment: [/b] ${finalDeploymentType || 'Event/TFS/SFS Operation/VIP Transport/HRAW Assistance/DB Sting OP/Etc.'}


[b][size=150]Section II[/size][/b]
[hr][/hr]
[u]2.1[/u] [b]Date: [/b] ${formattedDate}
[u]2.2[/u] [b]Time Started: [/b] ${timeStarted || '00:00 UTC'}
[u]2.3[/u] [b]Time Ended: [/b] ${timeEnded || '00:00 UTC'}



[b][size=150]Section III[/size][/b]
[hr][/hr]
(In case of classified DB Sting OP, only use section 3.3)

[u]3.1[/u] [b]Short detailed narrative:[/b]
[indent=25]${narrative || 'NARRATIVE'}[/indent]


[u]3.2[/u] [b]Additional notes: [/b] [indent=25]${additionalNotes || 'NOTES'}[/indent]
[ooc][u]3.2.1[/u] [b]Additional OOC notes: [/b] ${oocNotes || 'NOTES'} [/ooc]


[u]3.3[/u] [b]Case File: [/b] [indent=25]${caseFile || 'CASEFILENUMBER'}[/indent]



[b]Signature:[/b] ${signature || 'SIGNHERE'}
[/justify][/divbox2]`;

    document.getElementById('sfs-output').value = bbcode;
}

function generateTrainingReport() {
    const instructor = document.getElementById('instructor-name').value;
    const flightNumber = document.getElementById('flight-number').value;
    const comments = document.getElementById('training-comments').value;

    const bbcode = `[divbox2=white][center][lspdlogo=200][color=transparent]asdbestsd[/color][asdLogo=200]

[size=150][b]LOS SANTOS POLICE DEPARTMENT[/b][/size]
[size=115][b]Air Support Division[/b][/size]
[i]The mission is the same, only the vehicle has changed.[/i]
[hr][/hr][center][size=125]Training Flight Report[/size][hr][/hr]



[justify]
[b]Instructor:[/b] ${instructor || 'FIRSTNAME LASTNAME'}
[b]Flight Number:[/b] ${flightNumber || '#'}

[b]Comments:[/b] ${comments || 'BRIEF SUMMARY AND FEEDBACK'}
[/justify]`;

    document.getElementById('training-output').value = bbcode;
}

// NEW: generate Overtime Request BBCode using user's requested template
function generateOvertimeRequest() {
    const name = document.getElementById('ot-officer-name').value.trim();
    const flightLink = document.getElementById('ot-flightlog-link').value.trim();
    const regularHours = document.getElementById('ot-regular-hours').value.trim();
    const routing = document.getElementById('ot-routing').value.trim();
    const month = document.getElementById('ot-month').value.trim();
    const sfsHours = document.getElementById('ot-sfs-hours').value.trim();
    const amount = document.getElementById('ot-amount').value.trim();

    // build url BBCode for flight log: if empty use example placeholder
    const linkPart = flightLink ? `[url=${flightLink}]CLICK[/url]` : `[url=example]CLICK[/url]`;

    const bbcode = `[b]Officer Name and Rank:[/b] ${name || ''}
[b]Link to flight log: [/b]${linkPart}
[b]Total regular hours for month:[/b] ${regularHours || ''}
[b]Personal Bank Routing #:[/b] ${routing || ''}
[b]Month for OT claim:[/b] ${month || 'MONTH/YEAR'}
[b]Total SFS flight hours for month (if applicable:)[/b] ${sfsHours || ''}
[b]Amount payable:[/b] ${amount || ''}`;

    document.getElementById('ot-output').value = bbcode;
}

function copyToClipboard(elementId) {
    const textarea = document.getElementById(elementId);
    if (!textarea || textarea.value.trim() === '') {
        alert('Please generate the form first!');
        return;
    }
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    try {
        document.execCommand('copy');
    } catch (e) {
        alert('Failed to copy. Please select and copy manually.');
    }
}

function updateMonthlyHoursDisplay() {
    const display = document.getElementById('monthly-hours-display');
    if (display) {
        updateMonthlyHoursDisplayForElement(display, 'flights-');
    }
}

function updateOTMonthlyHoursDisplay() {
    const display = document.getElementById('ot-monthly-hours-display');
    if (display) {
        updateMonthlyHoursDisplayForElement(display, 'ot-flights-');
        // Add auto-fill buttons after updating the display
        addAutoFillButtons();
    }
}

function updateMonthlyHoursDisplayForElement(display, idPrefix) {
    if (!display) return;
    const collapsed = loadCollapsedMonths();

    if (!monthlyHours || Object.keys(monthlyHours).length === 0) {
        display.innerHTML = '<div class="month-stat">No flight hours recorded yet</div>';
        return;
    }

    const entries = Object.entries(monthlyHours);
    entries.sort((a, b) => {
        const toDate = (m) => {
            const parts = m.split(' ');
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const mi = monthNames.indexOf(parts[0]);
            const year = parseInt(parts[1], 10) || 0;
            return Date.UTC(year, mi, 1);
        };
        return toDate(a[0]) - toDate(b[0]);
    });

    let html = '';
    entries.forEach(([monthKey, data]) => {
        const stats = calculateFlightStats(data.flights);
        const totalDisplay = stats.totalHours.toFixed(1);
        const encodedMonth = encodeURIComponent(monthKey);
        const isCollapsed = !!collapsed[monthKey];
        const caretClasses = ['caret'];
        if (isCollapsed) caretClasses.push('collapsed');
        const caretClass = caretClasses.join(' ');

        html += `<div class="month-stat" data-month="${monthKey}">
            <div class="month-header" onclick="toggleMonth('${encodedMonth}', '${idPrefix}')">
                <div class="month-left">
                    <svg class="${caretClass} icon-shrink" viewBox="0 0 24 24" width="14" height="14">
                        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"></path>
                    </svg>
                    <div class="month-title">${monthKey}</div>
                </div>
                <div class="month-total">Monthly Summary</div>
            </div>
            <div class="month-flights ${isCollapsed ? 'collapsed' : ''}" id="${idPrefix}${encodedMonth}">
                <div class="month-stats-summary">
                    ${formatStat('ASTRO', stats.astroHours, stats.astroOT)}
                    ${formatStat('SFS', stats.sfsHours, stats.sfsOT)}
                    ${stats.totalFlights > 0 ? '<div><strong>Total Flights:</strong> ' + stats.totalFlights + '</div>' : ''}
                    ${stats.totalPoints > 0 ? '<div><strong>Total Points:</strong> ' + stats.totalPoints + '</div>' : ''}
                    ${stats.totalHours > 0 ? '<div><strong>Total Hours:</strong> ' + stats.totalHours.toFixed(1) + 'h</div>' : ''}
                    ${stats.totalOT > 0 ? '<div><strong>Total OT:</strong> ' + formatMoney(stats.totalOT) + '</div>' : ''}
                </div>`;

        if (Array.isArray(data.flights) && data.flights.length > 0) {
            // sort flights by timestamp ascending (older first)
            const flightsSorted = data.flights.slice().sort((x, y) => new Date(x.timestamp) - new Date(y.timestamp));
            flightsSorted.forEach(flight => {
                const entryDate = new Date(flight.entryDate + 'T00:00:00Z');
                const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                const dateDisplay = String(entryDate.getUTCDate()).padStart(2, '0') + '/' + months[entryDate.getUTCMonth()] + '/' + entryDate.getUTCFullYear();
                const displayDT = formatDateAndTimeUTC(flight.timestamp);
                const timeOnly = displayDT.split(' ').slice(1).join(' '); // "14:23 UTC"
                const hoursText = (typeof flight.hours === 'number' && !isNaN(flight.hours)) ? flight.hours.toFixed(1) : null;
                const safeId = String(flight.id).replace(/'/g, "\\'");
                const flightType = flight.type || 'ASTRO (Normal)'; // Default to normal if type not set
                const points = typeof flight.points === 'number' ? flight.points : 0;
                // per-flight OT calculation: ASTRO = $3,000/hr, SFS = $6,000/hr
                const perHourRate = (flight.type && flight.type === 'SFS') ? 6000 : 3000;
                const otAmount = (typeof flight.hours === 'number' && !isNaN(flight.hours)) ? Math.round(flight.hours * perHourRate) : 0;
                // build parts and omit hours/OT if not provided
                const parts = [dateDisplay, flightType, timeOnly];
                if (hoursText !== null) parts.push(hoursText + 'h');
                parts.push(points + 'pts');
                if (otAmount > 0 && hoursText !== null) parts.push(formatMoney(otAmount));
                const line = parts.join(' - ');
                html += `<div class="flight-entry" id="ot-flight-${safeId}">
                            <div>${line}</div>
                            <div><button class="flight-remove-btn" onclick="removeFlight('${encodedMonth}','${safeId}')">✕</button></div>
                        </div>`;
            });
        } else {
            html += `<div class="flight-entry"><div>No flights</div></div>`;
        }

        html += `</div></div>`;
    });

    display.innerHTML = html;
}

function addAutoFillButtons() {
    // Get both display elements
    const displays = [
        document.getElementById('monthly-hours-display'),
        document.getElementById('ot-monthly-hours-display')
    ].filter(Boolean); // Remove null/undefined values

    if (displays.length === 0) return;

    const entries = Object.entries(monthlyHours);
    entries.forEach(([monthKey, data]) => {
        const encodedMonth = encodeURIComponent(monthKey);
        // Find all matching month stats across both displays
        const monthStats = document.querySelectorAll(`[data-month="${monthKey}"]`);
        monthStats.forEach(monthStat => {
            // Find the month-stats-summary div to place the button in
            const summaryDiv = monthStat.querySelector('.month-flights .month-stats-summary');
            if (summaryDiv && !summaryDiv.querySelector('.btn-secondary')) {
                const buttonDiv = document.createElement('div');
                buttonDiv.className = 'summary-button-container';
                const button = document.createElement('button');
                button.textContent = 'Auto-Fill OT Request';
                button.className = 'btn btn-secondary';
                button.onclick = () => autoFillOvertimeRequest(monthKey, data);
                buttonDiv.appendChild(button);
                summaryDiv.appendChild(buttonDiv);
            }
        });
    });
}

function autoFillOvertimeRequest(monthKey, data) {
    const stats = calculateFlightStats(data.flights);
    // Auto-fill the personnel file link if saved
    const savedLink = getCookie('personnelFileLink');
    if (savedLink) {
        document.getElementById('ot-flightlog-link').value = savedLink;
    }

    // Auto-fill the routing number if saved
    const savedRouting = getCookie('routingNumber');
    if (savedRouting) {
        document.getElementById('ot-routing').value = savedRouting;
    }

    // Auto-fill hours and amount
    document.getElementById('ot-regular-hours').value = stats.astroHours.toFixed(1);
    document.getElementById('ot-sfs-hours').value = stats.sfsHours.toFixed(1);
    document.getElementById('ot-amount').value = formatMoney(stats.totalOT);

    // Format month as "MMM/YYYY"
    const parts = monthKey.split(' ');
    if (parts.length === 2) {
        document.getElementById('ot-month').value = parts[0] + '/' + parts[1]; // e.g., "AUG/2025"
    }

    // Switch to the overtime request tab
    showPage('overtime-request');
    // Also update the active state of the nav button
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('onclick') === "showPage('overtime-request')") {
            b.classList.add('active');
        }
    });
}

// Call this function after the monthly hours display is updated
updateMonthlyHoursDisplay = (function (original) {
    return function () {
        original();
        addAutoFillButtons();
    };
})(updateMonthlyHoursDisplay);