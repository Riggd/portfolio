/**
 * ChronoTheme - Seasonal/Temporal Theming Engine
 * V5.0 Cinematic Edition
 */

const STORAGE_KEY = 'chronotheme-preferences';

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

class ChronoTheme {
    constructor() {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.coords = null; // Store { latitude, longitude }
        this.autoUpdateInterval = null;
        this.settingsOpen = false;

        // Initialize 'doy' and 'time' closest to now if first run
        if (!localStorage.getItem(STORAGE_KEY)) {
            this.syncToLive();
        }
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
        } catch (e) {
            console.warn('ChronoTheme: Location access denied or failed, using defaults.', e);
        }
        this.updateLocationStatusUI();
    }

    /**
     * Sync internal state to current live date/time
     */
    syncToLive() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;

        this.preferences.doy = Math.floor(diff / oneDay);
        this.preferences.time = (now.getHours() * 60) + now.getMinutes();

        // Also update derived seasonal base if in auto
        this.preferences.hueBase = this.getHueFromDOY(this.preferences.doy);

        // Auto-adjust lightness based on time and solar cycle
        this.preferences.lightness = this.calculateLightnessFromTime(
            this.preferences.time,
            this.preferences.doy
        );

        this.savePreferences();
    }

    /**
     * Calculate approx solar noon in minutes from midnight for current location
     * Default to 720 (12:00 PM) if no location.
     */
    calculateSolarNoon(doy) {
        // Default to Noon if no coords
        if (!this.coords) return 720;

        const { longitude } = this.coords;
        const now = new Date();

        // 1. Calculate Equation of Time (EoT) in minutes
        // B = (360 / 365) * (product of days since approx Jan 1)
        // More precise: (doy - 81) is days since Vernal Equinox ish? 
        // Standard formula: B = 360/365 * (doy - 81)
        const B = (360 / 365) * (doy - 81) * (Math.PI / 180);
        const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

        // 2. Solar Noon (Local Time) calculation
        // Solar Noon (UTC) = 12:00 - (Longitude / 15 degrees_per_hour) - (EoT / 60)
        // Then convert UTC Solar Noon to Local Solar Noon by adding Timezone Offset

        // Let's do it purely in minutes relative to local midnight for simplicity, 
        // acknowledging timezone edges might be slightly off but "good enough" for background gradient.

        // Difference between local meridian and actual longitude
        // Local Meridian = TimezoneOffset (in hours) * 15 degrees
        // E.g. EST (UTC-5) -> -5 * 15 = -75 degrees

        const timezoneOffsetHours = -now.getTimezoneOffset() / 60; // minutes -> hours. EST is 300min -> 5h behind UTC? wait.
        // getTimezoneOffset returns positive minutes for zones BEHIND UTC. e.g. NY is 300. 
        // So NY is UTC-5. 

        const localMeridian = (-now.getTimezoneOffset() / 60) * 15;
        // e.g. UTC-5 = -5 * 15 = -75 deg.

        // Difference in degrees
        const correctionDeg = longitude - localMeridian;
        // 4 minutes per degree
        const correctionMinutes = 4 * correctionDeg;

        // Solar Noon Local = 12:00 - correction - EoT
        // wait, if I am EAST of meridian, noon comes EARLIER. 
        // if longitude (-74 NY) is > meridian (-75), I am EAST. 
        // Difference is +1 deg. Noon is 4 mins EARLIER. 
        // Formula: 720 - (4 * (longitude - meridian)) - eot

        // Let's try: 
        // NY Longitude -74. 
        // Meridian -75.
        // Diff = +1. 
        // 4 * 1 = 4 mins. 
        // 720 - 4 = 716. (11:56 AM). Correct, sun is overhead earlier.

        return 720 - correctionMinutes - eot;
    }

    /**
     * Calculate Solar Elevation Angle
     * @param {number} doy Day of Year
     * @param {number} timeMinutes Minutes from midnight (local)
     * @returns {number} Elevation in degrees
     */
    calculateSolarElevation(doy, timeMinutes) {
        // Default to Lat 40 (approx NY/Madrid) if no coords
        const latitude = this.coords ? this.coords.latitude : 40;
        const latRad = latitude * (Math.PI / 180);

        // Solar Declination (approx)
        // 23.45 * sin(360/365 * (doy - 81))
        const dec = 23.45 * Math.sin((360 / 365) * (doy - 81) * (Math.PI / 180));
        const decRad = dec * (Math.PI / 180);

        // Solar Noon approx (720 min)
        // ideally we'd use calculateSolarNoon(doy) here for precision
        // but for lightness curve smoothness, fixed noon is usually fine unless we want strict accuracy.
        // Let's use the local solar noon calculation if we have it, or 720.
        const solarNoon = this.calculateSolarNoon(doy); // returns ~720 adjusted for longitude

        // Hour Angle (H)
        // 0 at solar noon. 15 degrees per hour = 0.25 degrees per minute.
        const minutesFromNoon = timeMinutes - solarNoon;
        const H_deg = minutesFromNoon * 0.25;
        const H_rad = H_deg * (Math.PI / 180);

        // Elevation Formula
        // sin(El) = sin(Lat)sin(Dec) + cos(Lat)cos(Dec)cos(H)
        const sinEl = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(H_rad);

        return Math.asin(sinEl) * (180 / Math.PI);
    }

    calculateLightnessFromTime(minutes, doy = 0) {
        const elevation = this.calculateSolarElevation(doy, minutes);

        const minL = 0.05;      // Deep night
        const twilightL = 0.25; // Civil twilight / Pre-sunrise
        const maxL = 0.98;      // Peak summer noon

        const astroEnd = -18;   // Astronomical twilight ends
        const civilStart = -6;  // Civil twilight starts (reading light)

        // 1. Night Phase
        if (elevation < astroEnd) return minL;

        // 2. Twilight Phase (Astro -> Civil)
        // Linearly ramp base ambient light level
        let ambient = minL;
        if (elevation >= astroEnd) {
            // How far through twilight? 
            // -18 -> -6 (Range 12 degrees)
            // If elevation is > -6, we are fully in civil/day, so ambient is max twilightL
            // If elevation is -12, we are in middle.

            const twilightRange = civilStart - astroEnd; // 12
            const current = Math.min(elevation, civilStart) - astroEnd; // Clamp at civilStart
            const progress = Math.max(0, current / twilightRange);

            ambient = minL + (progress * (twilightL - minL));
        }

        // 3. Daylight Phase (Direct Sun)
        // Add brightness on top of ambient based on Sun Height
        let direct = 0;
        if (elevation > 0) {
            const maxDirect = maxL - twilightL;
            // Use Sine of Elevation for Intensity (Lambert's Law approx)
            // This naturally dims winter noons (lower peak elevation)
            const intensity = Math.sin(elevation * (Math.PI / 180));
            direct = maxDirect * Math.max(0, intensity);
        }

        return ambient + direct;
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
        if (key === 'doy' && !this.preferences.manual) {
            // If dragging DOY while auto, update the Base Hue automatically
            this.preferences.hueBase = this.getHueFromDOY(value);
        }

        // If manually changing Time OR Day, update Lightness calculation
        // (Even in manual mode, we simulate the physics of light)
        if (key === 'time' || key === 'doy') {
            this.preferences.lightness = this.calculateLightnessFromTime(
                this.preferences.time, // Always use current preference time
                this.preferences.doy   // Always use current preference doy
            );
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

        // Update Manual Lock/Unlock visuals if preferred 
        // (Optional: disable Auto-only sliders when not manual)
        const autoInputs = ['chrono-doy', 'chrono-time'];
        autoInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el && !p.manual) {
                // el.disabled = true; // or generic visual treatment
            } else if (el) {
                el.disabled = false;
            }
        });
    }

    updateLocationStatusUI() {
        const el = document.getElementById('chrono-location-status');
        if (!el) return;

        const icon = el.querySelector('.status-icon');
        const text = el.querySelector('.status-text');
        const btn = document.getElementById('chrono-request-location');

        if (this.coords) {
            el.classList.add('chrono-status-active');
            el.classList.remove('chrono-status-inactive');
            if (icon) icon.textContent = '✓';
            if (text) text.textContent = 'Location Active';
            if (btn) btn.style.display = 'none';
        } else {
            el.classList.add('chrono-status-inactive');
            el.classList.remove('chrono-status-active');
            if (icon) icon.textContent = '✗';
            if (text) text.textContent = 'Using Default (40°N)';
            if (btn) btn.style.display = 'block';
        }
    }
}

// Export singleton
const chronoTheme = new ChronoTheme();
export default chronoTheme;
