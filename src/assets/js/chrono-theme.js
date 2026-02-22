/**
 * ChronoTheme - Seasonal/Temporal Theming Engine
 * V5.0 Cinematic Edition
 */

const STORAGE_KEY = 'chronotheme-preferences';

import SunCalc from 'suncalc';

// Seasonal palette configuration (Base Hues)
const SEASONS = {
    winter: { name: 'Winter', dayStart: 335, dayEnd: 59, hBase: 260 },
    spring: { name: 'Spring', dayStart: 60, dayEnd: 151, hBase: 160 },
    summer: { name: 'Summer', dayStart: 152, dayEnd: 243, hBase: 40 },
    autumn: { name: 'Autumn', dayStart: 244, dayEnd: 334, hBase: 30 } // Should be 30 or similar warm hue
};

// Interpolation Keyframes
const SEASON_POINTS = [
    { doy: 60, hue: 160 },  // Spring Start (March 1)
    { doy: 152, hue: 40 },  // Summer Start (June 1)
    { doy: 244, hue: 30 },  // Autumn Start (Sept 1)
    { doy: 335, hue: 260 }  // Winter Start (Dec 1)
];

// Default preferences matching the new schema
const DEFAULT_PREFERENCES = {
    manual: false,

    // Simulation
    doy: 0,             // 0-365
    time: 720,          // 0-1440 (Minutes from midnight)

    // Color Grading
    hueBase: 260,
    hueSecOffset: 40,
    hueTerOffset: 40,
    lightness: 0.05,
    chroma: 0.18,

    // Atmosphere
    blur: 120,
    noise: 0.07,
    saturation: 130,

    // Kinetics
    speed: 1.0,
    scale: 1.0
};

class BlobAnimator {
    constructor() {
        this.blobs = [];
        this.active = false;
        this.lastTime = 0;
        this.speedMultiplier = 1.0;
    }

    init() {
        const blobElements = document.querySelectorAll('.blob');
        if (!blobElements.length) return;

        // Initialize blobs with random positions and velocities
        blobElements.forEach((el, index) => {
            // Get current dimensions
            const rect = el.getBoundingClientRect();
            // Start at random positions within the viewport initially
            // But let's respect some of the CSS intent (size, color)
            // Just override position.

            // Random start position (0 to window width/height - blob size)
            // Note: rect.width might be 0 if hidden, handled in update if needed
            // But usually we want to set x, y relative to viewport

            const x = Math.random() * (window.innerWidth - (rect.width || 400));
            const y = Math.random() * (window.innerHeight - (rect.height || 400));

            // Random direction: -1 to 1
            let vx = (Math.random() - 0.5) * 2;
            let vy = (Math.random() - 0.5) * 2;

            // Normalize and scale velocity
            const mag = Math.hypot(vx, vy);
            if (mag === 0) { vx = 1; vy = 0; }
            else { vx /= mag; vy /= mag; }

            // Base speed (pixels per frame approx) - customizable via speedMultiplier
            // Randomize individual speed slightly
            const speed = (0.2 + Math.random() * 0.3);

            this.blobs.push({
                el,
                x,
                y,
                vx,
                vy,
                speed,
                width: rect.width || 400,
                height: rect.height || 400
            });

            // Set initial position
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });

        this.start();
    }

    start() {
        if (this.active) return;
        this.active = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.update(t));
    }

    stop() {
        this.active = false;
    }

    update(timestamp) {
        if (!this.active) return;

        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Cap dt to prevent huge jumps if tab was inactive
        const safeDt = Math.min(dt, 64);

        // Update global speed modifier from CSS variable via ChronoTheme if needed
        // Or just use the prop we can set.
        // Let's assume ChronoTheme updates this.speedMultiplier

        this.blobs.forEach(blob => {
            // Move
            // Speed factor: safeDt * blob.speed * globalMultiplier
            // Let's say base speed is pixels per millisecond? 
            // 0.5px/ms is fast. 
            // Let's stick to pixel-per-frame logic scaled by dt if we want smooth
            // standard speed: 60fps -> 16ms. 
            // If blob.speed is ~0.5, then 0.5 * 16 = 8px per frame? Too fast.
            // Let's scale down.

            const moveAmt = safeDt * blob.speed * 0.1 * this.speedMultiplier;

            blob.x += blob.vx * moveAmt;
            blob.y += blob.vy * moveAmt;

            // Check bounds (Off-screen detection)
            // Blob is off-screen if:
            // x + width < 0 (Left side out)
            // x > windowWidth (Right side out)
            // y + height < 0 (Top side out)
            // y > windowHeight (Bottom side out)

            const w = window.innerWidth;
            const h = window.innerHeight;
            const bw = blob.width;
            const bh = blob.height;

            let isOffScreen = false;

            if (blob.x + bw < -100) isOffScreen = true; // Left
            if (blob.x > w + 100) isOffScreen = true;   // Right
            if (blob.y + bh < -100) isOffScreen = true; // Top
            if (blob.y > h + 100) isOffScreen = true;   // Bottom

            if (isOffScreen) {
                // RESET
                this.resetBlob(blob, w, h);
            }

            // Apply transform
            // We use translate3d for GPU
            // Note: We need to preserve the scale from CSS variable if possible?
            // The previous CSS used scale(var(--chrono-blob-scale)).
            // We should encompass that here or apply it separately?
            // transform precedence: inline overrules CSS class.
            // We should include the scale in the transform string
            // BUT: JS doesn't easily read the variable instantly every frame without cost.
            // BETTER: The CSS puts scale on the element? 
            // If we write `transform: translate3d(...)`, we wipe out CSS `transform: scale(...)`.
            // Solution: Add a child wrapper or just include read of the var?
            // Optimization: Let's assume scale is handled by the parent or we just apply it here.
            // Since we're in JS, let's just use `var(--chrono-blob-scale)` in the string!
            // Browser handles the variable resolution.
            blob.el.style.transform = `translate3d(${blob.x}px, ${blob.y}px, 0) scale(var(--chrono-blob-scale))`;
        });

        requestAnimationFrame((t) => this.update(t));
    }

    resetBlob(blob, w, h) {
        // Pick a side to enter from: 0=Top, 1=Right, 2=Bottom, 3=Left
        const side = Math.floor(Math.random() * 4);

        switch (side) {
            case 0: // Top (enter from top, moving down)
                blob.y = -blob.height - 50;
                blob.x = Math.random() * w;
                blob.vy = Math.abs(blob.vy); // Ensure positive Y
                blob.vx = (Math.random() - 0.5) * 2; // Random X
                break;
            case 1: // Right (enter from right, moving left)
                blob.x = w + 50;
                blob.y = Math.random() * h;
                blob.vx = -Math.abs(blob.vx); // Ensure negative X
                blob.vy = (Math.random() - 0.5) * 2;
                break;
            case 2: // Bottom (enter from bottom, moving up)
                blob.y = h + 50;
                blob.x = Math.random() * w;
                blob.vy = -Math.abs(blob.vy); // Ensure negative Y
                blob.vx = (Math.random() - 0.5) * 2;
                break;
            case 3: // Left (enter from left, moving right)
                blob.x = -blob.width - 50;
                blob.y = Math.random() * h;
                blob.vx = Math.abs(blob.vx); // Ensure positive X
                blob.vy = (Math.random() - 0.5) * 2;
                break;
        }

        // Randomize speed slightly on reset
        blob.speed = (0.2 + Math.random() * 0.3);
    }

    setSpeed(multiplier) {
        this.speedMultiplier = multiplier;
    }
}


class ChronoTheme {
    constructor() {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.coords = null; // Store { latitude, longitude }
        this.timezoneOverride = null; // Store offset if manually selected
        this.autoUpdateInterval = null;
        this.settingsOpen = false;

        // Initialize 'doy' and 'time' closest to now if first run
        if (!localStorage.getItem(STORAGE_KEY)) {
            this.syncToLive();
        }

        this.animator = new BlobAnimator();
    }

    async init() {
        this.loadPreferences();

        // If not manual, perform an initial sync to live time
        if (!this.preferences.manual) {
            // Attempt to get location for better solar accuracy
            this.syncToLive();
        }

        this.updateLocationStatusUI(); // Initial check
        this.applyTheme();

        // Start animator
        this.animator.init();

        this.startAutoUpdate();
        this.bindEvents();
    }

    async initLocation() {
        try {
            // We only need coarse location, but browser permission is boolean
            // This will prompt the user
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 5000,
                    maximumAge: 600000 // 10 minutes cache
                });
            });
            this.coords = pos.coords;
            console.log('ChronoTheme: Location acquired', this.coords);

            // If we successfully get live location, ensure dropdown is set to 'current'
            const select = document.getElementById('chrono-location-select');
            if (select) select.value = 'current';

        } catch (e) {
            console.warn('ChronoTheme: Location access denied or failed, using defaults.', e);
        }
        this.updateLocationStatusUI();

        // Retrigger sync to apply new coords
        if (!this.preferences.manual) {
            this.syncToLive();
            this.applyTheme();
            this.updateSettingsUI();
        }
    }

    /**
     * Sync internal state to current live date/time
     */
    syncToLive() {
        // Use current time, or shift based on timezoneOverride if set
        const nowUTC = new Date();
        let targetTime = nowUTC;

        if (this.timezoneOverride !== null && this.timezoneOverride !== undefined) {
            // Create a date object shifted to the target timezone
            // Get UTC millis
            const utc = nowUTC.getTime() + (nowUTC.getTimezoneOffset() * 60000);
            // Add offset (hours -> millis)
            targetTime = new Date(utc + (3600000 * this.timezoneOverride));
        }

        const now = targetTime;
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;

        this.preferences.doy = Math.floor(diff / oneDay);
        this.preferences.time = (now.getHours() * 60) + now.getMinutes();

        // Update derived values (Lightness, Hue + Shift)
        this.updateDerivedValues();

        this.savePreferences();
    }

    /**
     * Recalculate derived preferences based on current DOY/Time
     * Handles Hue (Seasonal + Solar Shift) and Lightness
     */
    updateDerivedValues() {
        // 1. Seasonal Base Hue
        let baseHue = this.getHueFromDOY(this.preferences.doy);

        // 2. Solar Hue Shift (Golden Hour / Blue Hour)
        const elevation = this.calculateSolarElevation(this.preferences.doy, this.preferences.time);
        const hueShift = this.calculateSolarHueShift(elevation);

        // Apply shift
        this.preferences.hueBase = (baseHue + hueShift + 360) % 360;

        // 3. Lightness
        this.preferences.lightness = this.calculateLightnessFromTime(
            this.preferences.time,
            this.preferences.doy
        );
    }

    /**
     * Calculate accurate solar noon in minutes from midnight using SunCalc
     */
    calculateSolarNoon(doy) {
        // Default to Noon if no coords
        if (!this.coords) return 720;

        const { latitude, longitude } = this.coords;
        // Create Date from DOY
        const date = new Date(new Date().getFullYear(), 0, 1);
        date.setDate(1 + parseInt(doy)); // Add days

        // Get solar times
        const times = SunCalc.getTimes(date, latitude, longitude);
        const noonDate = times.solarNoon;

        // Convert Noon Date object to minutes from midnight (local)
        // Note: solarNoon Date includes the correct offset for the location provided? 
        // SunCalc returns Date objects in local system time usually if not specified? 
        // Actually SunCalc returns Date objects.JS Dates have timezone info implicitly when accessed via getHours/Minutes

        return (noonDate.getHours() * 60) + noonDate.getMinutes();
    }

    /**
     * Calculate Solar Elevation Angle using SunCalc
     * @param {number} doy Day of Year
     * @param {number} timeMinutes Minutes from midnight (local)
     * @returns {number} Elevation in degrees
     */
    calculateSolarElevation(doy, timeMinutes) {
        // Default to Lat 40 (approx NY/Madrid) if no coords
        const latitude = this.coords ? this.coords.latitude : 40;
        const longitude = this.coords ? this.coords.longitude : -74;

        // Create Date object for this exact time
        const date = new Date(new Date().getFullYear(), 0, 1);
        date.setDate(1 + parseInt(doy));

        // Set time
        const hours = Math.floor(timeMinutes / 60);
        const minutes = Math.floor(timeMinutes % 60);
        date.setHours(hours, minutes, 0, 0);

        // Get Position
        const pos = SunCalc.getPosition(date, latitude, longitude);

        // SunCalc returns altitude in radians. Convert to degrees.
        return pos.altitude * (180 / Math.PI);
    }

    calculateLightnessFromTime(minutes, doy = 0) {
        const elevation = this.calculateSolarElevation(doy, minutes);

        const minL = 0.05;      // Deep night
        const twilightL = 0.40; // Civil twilight (Boosted for visibility)
        const maxL = 0.98;      // Peak summer noon

        const astroEnd = -18;   // Astronomical twilight ends
        const civilStart = -6;  // Civil twilight starts (reading light)

        // 1. Night Phase
        if (elevation < astroEnd) return minL;

        // 2. Twilight Phase (Astro -> Civil)
        // Use curve to boost brightness earlier in twilight
        let ambient = minL;
        if (elevation >= astroEnd) {
            const twilightRange = civilStart - astroEnd; // 12
            const current = Math.min(elevation, civilStart) - astroEnd; // Clamp at civilStart
            const progress = Math.max(0, current / twilightRange);

            // Non-linear boost (Sqrt) to make early twilight brighter
            const boost = Math.sqrt(progress);
            ambient = minL + (boost * (twilightL - minL));
        }

        // 3. Daylight Phase (Direct Sun)
        // Add brightness on top of ambient based on Sun Height
        let direct = 0;
        if (elevation > civilStart) {
            // Smooth transition from civil start
            const maxDirect = maxL - twilightL;

            // If between -6 and 0, we ramp up differently? 
            // Actually, if elevation > 0.

            if (elevation > 0) {
                const intensity = Math.sin(elevation * (Math.PI / 180));
                direct = maxDirect * Math.max(0, intensity);
            } else {
                // Between -6 and 0 (Civil Twilight to Sunrise)
                // Ramp from twilightL to twilightL (+ small bump?)
                // Let's keep it simple: Ambient handles up to -6. 
                // We might want a smooth bridge from -6 to 0.
                // Currently ambient caps at -6. 
                // Let's add a small linear ramp for -6 to 0 if needed, 
                // but typically direct sun starts at 0.
            }
        }

        return Math.min(1.0, ambient + direct);
    }

    /**
     * Calculate Hue Shift based on Solar Elevation
     * Simulates Golden Hour (Warmth) and Blue Hour (Coolness)
     * @param {number} elevation 
     * @returns {number} Hue shift offset
     */
    calculateSolarHueShift(elevation) {
        let shift = 0;

        if (elevation >= -6 && elevation <= 6) {
            // Golden Hour Peak at 0
            // Range total 12 degrees.
            // Max shift at 0 deg elevation.
            const dist = Math.abs(elevation - 0);
            const strength = 1 - (dist / 6); // 1 at 0, 0 at +/-6
            shift = -30 * strength; // Shift towards warm
        } else if (elevation >= -18 && elevation < -6) {
            // Blue Hour Peak at -12
            // Range total 12 degrees.
            // Max shift at -12 deg elevation.
            const dist = Math.abs(elevation - (-12));
            const strength = 1 - (dist / 6); // 1 at -12, 0 at -18 and -6
            shift = 20 * strength; // Shift towards cool
        }

        return shift === 0 ? 0 : shift;
    }

    getHueFromDOY(doy) {
        // Find existing range
        // Points must be sorted by doy.

        // 1. Find the segment this DOY falls into
        // Since we wrap around 365 -> 0, let's treat it as a loop.

        let p1, p2;

        // Check if we are past the last point (Winter) or before the first point (Spring)
        // Winter starts 335. Spring starts 60.
        // If doy >= 335, we are in Winter->Spring segment (but wrap around).
        // If doy < 60, we are also in Winter->Spring segment.

        const lastPoint = SEASON_POINTS[SEASON_POINTS.length - 1];
        const firstPoint = SEASON_POINTS[0];

        if (doy >= lastPoint.doy || doy < firstPoint.doy) {
            p1 = lastPoint;
            p2 = firstPoint;
        } else {
            // Standard search
            for (let i = 0; i < SEASON_POINTS.length - 1; i++) {
                if (doy >= SEASON_POINTS[i].doy && doy < SEASON_POINTS[i + 1].doy) {
                    p1 = SEASON_POINTS[i];
                    p2 = SEASON_POINTS[i + 1];
                    break;
                }
            }
        }

        if (!p1 || !p2) return 260; // Fallback

        // Disable warning for p1 p2 undefined

        // Calculate progress
        let startDoy = p1.doy;
        let endDoy = p2.doy;
        let currentDoy = doy;

        // Handle wrapping for calculation
        // If endDoy < startDoy (e.g. 60 < 335), it means we crossed the year boundary.
        // We need to normalize distances.
        if (endDoy < startDoy) {
            endDoy += 365;
            if (currentDoy < startDoy) {
                currentDoy += 365;
            }
        }

        const span = endDoy - startDoy;
        const progress = (currentDoy - startDoy) / span;

        // Interpolate Hue
        // Shortest path interpolation? 
        // 260 -> 160. Diff is -100.
        // 30 -> 260. Diff is +230? Or -130 (via 0/360)?
        // 30 -> 260... 30 down to 0/360 down to 260 is a span of 130. 
        // 30 up to 260 is 230.
        // Let's assume linear between specified points for now. The points are placed to avoid large jumps?

        // p1.hue to p2.hue
        // 260 -> 160 (Winter to Spring). -100.
        // 160 -> 40 (Spring to Summer). -120.
        // 40 -> 30 (Summer to Autumn). -10.
        // 30 -> 260 (Autumn to Winter). +230? 
        // Actually 30 -> ... -> 0/360 -> ... -> 260. 
        // 30 -> 0 is -30. 360 -> 260 is -100. Total -130 distance.
        // So we should wrap interpolation too if distance > 180.

        let h1 = p1.hue;
        let h2 = p2.hue;

        let diff = h2 - h1;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        let hue = h1 + (diff * progress);

        // Normalize 0-360
        if (hue < 0) hue += 360;
        if (hue > 360) hue -= 360;

        return Math.round(hue);
    }

    formatDateFromDOY(doy) {
        const date = new Date(new Date().getFullYear(), 0, 1); // Start Jan 1 curr year
        date.setDate(1 + parseInt(doy));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    loadPreferences() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.preferences = { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
            }
        } catch (e) {
            console.warn('ChronoTheme: Could not load preferences', e);
        }
    }

    savePreferences() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    }

    setPreference(key, value) {
        this.preferences[key] = value;

        if (key === 'manual' && value === false) {
            this.syncToLive(); // Snap back to reality
        }

        // Smart interactions for Audio/Manual
        // If manually changing Time OR Day, update derived values (Hue, Lightness)
        if (key === 'time' || key === 'doy') {
            this.updateDerivedValues();
        }

        this.savePreferences();
        this.applyTheme();
        this.updateSettingsUI();
    }

    resetToDefaults() {
        this.preferences = { ...DEFAULT_PREFERENCES };
        // If we have location, keep it? Or re-init. 
        // Re-syncing is safer
        this.syncToLive();
        this.applyTheme();
        this.updateSettingsUI();
    }

    applyTheme() {
        const root = document.documentElement;
        const p = this.preferences;

        // Color Grading
        root.style.setProperty('--chrono-h-base', p.hueBase);
        root.style.setProperty('--chrono-h-offset-sec', p.hueSecOffset);
        root.style.setProperty('--chrono-h-offset-ter', p.hueTerOffset);
        root.style.setProperty('--chrono-lightness', p.lightness);
        root.style.setProperty('--chrono-chroma', p.chroma);

        // Atmosphere
        root.style.setProperty('--chrono-blur', `${p.blur}px`);
        root.style.setProperty('--chrono-noise', p.noise);
        root.style.setProperty('--chrono-saturation', `${p.saturation}%`);

        // Kinetics
        root.style.setProperty('--chrono-flow-speed', p.speed);
        root.style.setProperty('--chrono-blob-scale', p.scale);

        if (this.animator) {
            this.animator.setSpeed(p.speed);
        }

        // Derived Mode (Light/Dark)
        // Continuous switch point at 50% lightness
        const mode = p.lightness > 0.5 ? 'light' : 'dark';
        root.setAttribute('data-theme', mode);

        sessionStorage.setItem('theme', mode);
    }

    startAutoUpdate() {
        if (this.autoUpdateInterval) clearInterval(this.autoUpdateInterval);
        this.autoUpdateInterval = setInterval(() => {
            if (!this.preferences.manual) {
                this.syncToLive();
                this.applyTheme();
                this.updateSettingsUI(); // Keep sliders moving
            }
        }, 60000); // 1 min sync
    }

    /* --- UI BINDING --- */

    toggleSettings() {
        this.settingsOpen = !this.settingsOpen;
        const panel = document.getElementById('chrono-settings');
        const overlay = document.getElementById('chrono-settings-overlay');

        if (panel) panel.setAttribute('aria-hidden', !this.settingsOpen);
        if (overlay) overlay.setAttribute('aria-hidden', !this.settingsOpen);

        if (this.settingsOpen) this.updateSettingsUI();
    }

    closeSettings() {
        this.settingsOpen = false;
        document.getElementById('chrono-settings')?.setAttribute('aria-hidden', 'true');
        document.getElementById('chrono-settings-overlay')?.setAttribute('aria-hidden', 'true');
    }

    bindEvents() {
        // Toggle Buttons
        document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleSettings());
        document.getElementById('chrono-settings-close')?.addEventListener('click', () => this.closeSettings());
        document.getElementById('chrono-settings-overlay')?.addEventListener('click', () => this.closeSettings());

        // Location Request
        document.getElementById('chrono-request-location')?.addEventListener('click', () => {
            this.initLocation();
        });

        // Location Dropdown
        const locSelect = document.getElementById('chrono-location-select');
        if (locSelect) {
            locSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                if (val === 'current') {
                    this.timezoneOverride = null;
                    this.setPreference('manual', false);
                    this.initLocation();
                } else {
                    // Parse 'lat,lon,offset'
                    const [lat, lon, offset] = val.split(',').map(parseFloat);
                    if (!isNaN(lat) && !isNaN(lon)) {
                        this.coords = { latitude: lat, longitude: lon };
                        this.timezoneOverride = !isNaN(offset) ? offset : null;

                        console.log('ChronoTheme: Manual location set', this.coords, 'TZ:', this.timezoneOverride);

                        // Force Auto Mode when selecting a city (preview mode)
                        this.setPreference('manual', false);

                        // Sync immediately to that location's time
                        this.syncToLive();
                        this.applyTheme();
                        this.updateSettingsUI();
                        this.updateLocationStatusUI();
                    }
                }
            });
        }

        // Reset
        document.getElementById('chrono-reset')?.addEventListener('click', () => this.resetToDefaults());

        // Helper for binding inputs
        const bind = (id, key, type = 'float') => {
            const el = document.getElementById(id);
            if (!el) return;

            el.addEventListener('input', (e) => {
                let val = e.target.value;
                if (type === 'int') val = parseInt(val);
                if (type === 'float') val = parseFloat(val);
                if (type === 'bool') val = e.target.checked;

                this.setPreference(key, val);
            });
        };

        // Simulation
        bind('chrono-manual', 'manual', 'bool');
        bind('chrono-doy', 'doy', 'int');
        bind('chrono-time', 'time', 'int');

        // Colors
        bind('chrono-hue-base', 'hueBase', 'int');
        bind('chrono-hue-sec', 'hueSecOffset', 'int');
        bind('chrono-hue-ter', 'hueTerOffset', 'int');
        bind('chrono-lightness', 'lightness', 'float');
        bind('chrono-chroma', 'chroma', 'float');

        // Atmosphere
        bind('chrono-blur', 'blur', 'int');
        bind('chrono-noise', 'noise', 'float');
        bind('chrono-saturation', 'saturation', 'int');

        // Kinetics
        bind('chrono-speed', 'speed', 'float');
        bind('chrono-scale', 'scale', 'float');
    }

    updateSettingsUI() {
        // Also update location UI just in case
        this.updateLocationStatusUI();

        const p = this.preferences;

        const setVal = (id, val, textFn) => {
            const el = document.getElementById(id);
            const display = document.getElementById(`${id}-value`);
            if (el) {
                if (el.type === 'checkbox') el.checked = val;
                else el.value = val;
            }
            if (display) display.textContent = textFn ? textFn(val) : val;
        };

        // Simulation
        setVal('chrono-manual', p.manual);
        setVal('chrono-doy', p.doy, (v) => this.formatDateFromDOY(v));
        setVal('chrono-time', p.time, (v) => {
            const h = Math.floor(v / 60).toString().padStart(2, '0');
            const m = (v % 60).toString().padStart(2, '0');
            return `${h}:${m}`;
        });

        // Colors
        setVal('chrono-hue-base', p.hueBase);
        setVal('chrono-hue-sec', p.hueSecOffset);
        setVal('chrono-hue-ter', p.hueTerOffset);
        setVal('chrono-lightness', p.lightness, v => v.toFixed(2));
        setVal('chrono-chroma', p.chroma, v => v.toFixed(2));

        // Atmosphere
        setVal('chrono-blur', p.blur, v => `${v}px`);
        setVal('chrono-noise', p.noise, v => `${Math.round(v * 100)}%`);
        setVal('chrono-saturation', p.saturation, v => `${v}%`);

        // Kinetics
        setVal('chrono-speed', p.speed, v => `${v}x`);
        setVal('chrono-scale', p.scale, v => `${v}x`);

        // Update Manual Lock/Unlock visuals
        const autoInputs = ['chrono-doy', 'chrono-time'];
        autoInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                // Disabled if NOT manual (Auto mode controls these)
                el.disabled = !p.manual;
                el.style.opacity = !p.manual ? '0.5' : '1';
                el.style.cursor = !p.manual ? 'not-allowed' : 'pointer';
            }
        });
    }

    updateLocationStatusUI() {
        const el = document.getElementById('chrono-location-status');
        if (!el) return;

        const icon = el.querySelector('.status-icon');
        const text = el.querySelector('.status-text');
        const btn = document.getElementById('chrono-request-location');
        const select = document.getElementById('chrono-location-select');

        // Logic:
        // If coords exist:
        //    Is it "Current" (geo) or "Manual" (dropdown)? 
        //    Hard to distinguish properly without storing "locationMode" preference.
        //    For now, assume if select value is NOT current, we are in override.

        // But select.value might be stale on reload.
        // We aren't persisting the select value. 
        // For V1, let's just show "Location Active" if we have coords.

        if (this.coords) {
            el.classList.add('chrono-status-active');
            el.classList.remove('chrono-status-inactive');
            if (icon) icon.textContent = '✓';

            // Try to infer name from select if possible
            let label = 'Location Active';
            if (select && select.value !== 'current') {
                const opt = select.options[select.selectedIndex];
                if (opt) label = opt.text;
            } else if (select && select.value === 'current') {
                label = 'GPS Location';
            }

            if (text) text.textContent = label;
            if (btn) btn.style.display = 'none';
        } else {
            el.classList.add('chrono-status-inactive');
            el.classList.remove('chrono-status-active');
            if (icon) icon.textContent = '✗';
            if (text) text.textContent = 'Using Default (40°N)';
            if (btn) btn.style.display = 'block';

            // Ensure select shows current if we failed/have nothing
            if (select) select.value = 'current';
        }
    }
}

// Export singleton
const chronoTheme = new ChronoTheme();
export default chronoTheme;
