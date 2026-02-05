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
            await this.initLocation();
            this.syncToLive();
        }

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
    }

    /**
     * Sync internal state to current live date/time
     */
    syncToLive() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;

        this.preferences.doy = Math.floor(diff / oneDay);
        this.preferences.time = (now.getHours() * 60) + now.getMinutes();

        // Also update derived seasonal base if in auto
        const season = this.getSeasonFromDOY(this.preferences.doy);
        this.preferences.hueBase = season.hBase;

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

    calculateLightnessFromTime(minutes, doy = 0) {
        const peak = this.calculateSolarNoon(doy);

        // We want a curve that peaks (1.0) at `peak` and is lowest (0.0) at `peak +/- 720` (12 hours away)
        // Cosine wave: cos(x) peaks at 0.
        // We want cos(time - peak). 
        // Period is 1440 minutes.
        // Angle = ( (time - peak) / 1440 ) * 2 * PI

        const rads = ((minutes - peak) / 1440) * Math.PI * 2;

        // cos(0) = 1. cos(PI) = -1. 
        // Map [-1, 1] to [0, 1] -> (val + 1) / 2
        const rawCycle = (Math.cos(rads) + 1) / 2;

        // Additional shaping: Day should be broader? 
        // Simple power curve to widen the "night" or "day" if desired. 
        // rawCycle^0.5 makes it spend more time in light. rawCycle^2 makes it spikier light.
        // Let's keep it linear sine for now.

        const minL = 0.05; // Deep night
        const maxL = 0.95; // Bright noon

        return minL + (rawCycle * (maxL - minL));
    }

    getSeasonFromDOY(doy) {
        // Simple range check
        if (doy >= SEASONS.spring.dayStart && doy <= SEASONS.spring.dayEnd) return SEASONS.spring;
        if (doy >= SEASONS.summer.dayStart && doy <= SEASONS.summer.dayEnd) return SEASONS.summer;
        if (doy >= SEASONS.autumn.dayStart && doy <= SEASONS.autumn.dayEnd) return SEASONS.autumn;
        return SEASONS.winter;
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
            const season = this.getSeasonFromDOY(value);
            this.preferences.hueBase = season.hBase;
        }

        // If manually changing Time, update Lightness calculation
        // (Even in manual mode, we simulate the physics of light)
        if (key === 'time') {
            this.preferences.lightness = this.calculateLightnessFromTime(
                value,
                this.preferences.doy
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
        setVal('chrono-doy', p.doy);
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
}

// Export singleton
const chronoTheme = new ChronoTheme();
export default chronoTheme;
