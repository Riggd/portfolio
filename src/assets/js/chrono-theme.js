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
    autumn: { name: 'Autumn', dayStart: 244, dayEnd: 334, hBase: 30 }
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
        this.autoUpdateInterval = null;
        this.settingsOpen = false;

        // Initialize 'doy' and 'time' closest to now if first run
        if (!localStorage.getItem(STORAGE_KEY)) {
            this.syncToLive();
        }
    }

    init() {
        this.loadPreferences();

        // If not manual, perform an initial sync to live time
        if (!this.preferences.manual) {
            this.syncToLive();
        }

        this.applyTheme();
        this.startAutoUpdate();
        this.bindEvents();
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

        // Auto-adjust lightness based on time (Simple curve)
        // Night (0.02) -> Noon (0.15) -> Night (0.02)
        const timeVal = this.calculateTimeCurve(this.preferences.time);
        this.preferences.lightness = 0.02 + (timeVal * 0.13);

        this.savePreferences();
    }

    calculateTimeCurve(minutes) {
        const rads = (minutes / 1440) * Math.PI * 2;
        // Cosine curve: -1 at midnight, 1 at noon
        // Shift to 0..1: (cos(rads - PI) + 1) / 2
        /* Note: 0 mins = Midnight. Math.cos(0) = 1. We want -1. 
           So rads - PI.
        */
        return (Math.cos(rads - Math.PI) + 1) / 2;
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

        this.savePreferences();
        this.applyTheme();
        this.updateSettingsUI();
    }

    resetToDefaults() {
        this.preferences = { ...DEFAULT_PREFERENCES };
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
        // Currently V5 is "Cinematic Dark", light mode is optional override
        // logic could vary here if we want true light mode switch
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
