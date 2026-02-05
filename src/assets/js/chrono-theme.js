/**
 * ChronoTheme - Seasonal/Temporal Theming Engine
 * Automatically adjusts color palette based on season and time of day
 * using OKLCH color space for perceptually uniform color manipulation.
 */

const STORAGE_KEY = 'chronotheme-preferences';

// Seasonal palette configuration
const SEASONS = {
    winter: {
        name: 'Winter',
        dayStart: 335,  // Dec 1
        dayEnd: 59,     // Feb 28
        hBase: 260,     // Blue-violet
        hAccent: 180,   // Teal
        chroma: 0.08,
        chromaAccent: 0.12
    },
    spring: {
        name: 'Spring',
        dayStart: 60,   // Mar 1
        dayEnd: 151,    // May 31
        hBase: 160,     // Teal-green
        hAccent: 40,    // Warm yellow
        chroma: 0.14,
        chromaAccent: 0.18
    },
    summer: {
        name: 'Summer',
        dayStart: 152,  // Jun 1
        dayEnd: 243,    // Aug 31
        hBase: 40,      // Golden-orange
        hAccent: 200,   // Sky blue
        chroma: 0.16,
        chromaAccent: 0.20
    },
    autumn: {
        name: 'Autumn',
        dayStart: 244,  // Sep 1
        dayEnd: 334,    // Nov 30
        hBase: 30,      // Amber-orange
        hAccent: 340,   // Deep red
        chroma: 0.13,
        chromaAccent: 0.16
    }
};

// Time of day configuration
const TIME_PERIODS = {
    night: { name: 'Night', modifier: 0.7 },
    dawn: { name: 'Dawn', modifier: 0.85 },
    day: { name: 'Day', modifier: 1.0 },
    dusk: { name: 'Dusk', modifier: 0.8 }
};

// Default preferences
const DEFAULT_PREFERENCES = {
    mode: 'auto',           // 'light', 'dark', 'auto'
    seasonMode: 'auto',     // 'auto' or specific season name
    timeMode: 'auto',       // 'auto' or specific time period name
    vibrancy: 1.0,          // 0.5 to 1.5
    gradientIntensity: 0.5  // 0 to 1 (controls mesh gradient opacity)
};

class ChronoTheme {
    constructor() {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.autoUpdateInterval = null;
        this.systemThemeQuery = null;
        this.settingsOpen = false;
    }

    /**
     * Initialize the theme engine
     */
    init() {
        this.loadPreferences();
        this.applyTheme();
        this.startAutoUpdate();
        this.watchSystemTheme();
        this.bindToggleEvents();
        this.bindSettingsEvents();
    }

    /**
     * Calculate current season based on day of year
     * @returns {string} Season name (winter, spring, summer, autumn)
     */
    calculateSeason() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        // Winter wraps around year end
        if (dayOfYear >= SEASONS.winter.dayStart || dayOfYear <= SEASONS.winter.dayEnd) {
            return 'winter';
        }
        if (dayOfYear >= SEASONS.spring.dayStart && dayOfYear <= SEASONS.spring.dayEnd) {
            return 'spring';
        }
        if (dayOfYear >= SEASONS.summer.dayStart && dayOfYear <= SEASONS.summer.dayEnd) {
            return 'summer';
        }
        if (dayOfYear >= SEASONS.autumn.dayStart && dayOfYear <= SEASONS.autumn.dayEnd) {
            return 'autumn';
        }

        return 'spring'; // Fallback
    }

    /**
     * Calculate current time period based on time of day
     * @returns {string} Time period name (night, dawn, day, dusk)
     */
    calculateTimeOfDay() {
        const now = new Date();
        const minutes = now.getHours() * 60 + now.getMinutes();

        // Time boundaries in minutes from midnight
        const DAWN_START = 5 * 60 + 30;    // 05:30
        const DAY_START = 7 * 60 + 30;      // 07:30
        const DUSK_START = 17 * 60 + 30;    // 17:30
        const NIGHT_START = 19 * 60 + 30;   // 19:30

        if (minutes >= NIGHT_START || minutes < DAWN_START) {
            return 'night';
        }
        if (minutes >= DAWN_START && minutes < DAY_START) {
            return 'dawn';
        }
        if (minutes >= DAY_START && minutes < DUSK_START) {
            return 'day';
        }
        if (minutes >= DUSK_START && minutes < NIGHT_START) {
            return 'dusk';
        }

        return 'day'; // Fallback
    }

    /**
     * Get the effective season (auto or manual)
     * @returns {string} Season name
     */
    getEffectiveSeason() {
        if (this.preferences.seasonMode === 'auto') {
            return this.calculateSeason();
        }
        return this.preferences.seasonMode;
    }

    /**
     * Get the effective time period (auto or manual)
     * @returns {string} Time period name
     */
    getEffectiveTimePeriod() {
        if (this.preferences.timeMode === 'auto') {
            return this.calculateTimeOfDay();
        }
        return this.preferences.timeMode;
    }

    /**
     * Get the effective color mode (light, dark, or system)
     * @returns {string} 'light' or 'dark'
     */
    getEffectiveMode() {
        if (this.preferences.mode === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return this.preferences.mode;
    }

    /**
     * Load preferences from localStorage
     */
    loadPreferences() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.preferences = { ...DEFAULT_PREFERENCES, ...parsed };
            }
        } catch (e) {
            console.warn('ChronoTheme: Could not load preferences', e);
            this.preferences = { ...DEFAULT_PREFERENCES };
        }
    }

    /**
     * Save preferences to localStorage
     */
    savePreferences() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (e) {
            console.warn('ChronoTheme: Could not save preferences', e);
        }
    }

    /**
     * Set a single preference value
     * @param {string} key - Preference key
     * @param {*} value - Preference value
     */
    setPreference(key, value) {
        if (key in DEFAULT_PREFERENCES) {
            this.preferences[key] = value;
            this.savePreferences();
            this.applyTheme();
            this.updateSettingsUI();
        }
    }

    /**
     * Reset all preferences to defaults
     */
    resetToDefaults() {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
        this.applyTheme();
        this.updateSettingsUI();
    }

    /**
     * Apply the current theme to the document
     */
    applyTheme() {
        const season = this.getEffectiveSeason();
        const timePeriod = this.getEffectiveTimePeriod();
        const mode = this.getEffectiveMode();
        const seasonConfig = SEASONS[season];
        const timeConfig = TIME_PERIODS[timePeriod];

        // Set data-theme attribute
        document.documentElement.setAttribute('data-theme', mode);

        // Set CSS custom properties for OKLCH
        const root = document.documentElement;
        root.style.setProperty('--chrono-h-base', seasonConfig.hBase);
        root.style.setProperty('--chrono-h-accent', seasonConfig.hAccent);
        root.style.setProperty('--chrono-c-base', seasonConfig.chroma);
        root.style.setProperty('--chrono-c-accent', seasonConfig.chromaAccent);
        root.style.setProperty('--chrono-vibrancy', this.preferences.vibrancy);
        root.style.setProperty('--chrono-time-modifier', timeConfig.modifier);
        root.style.setProperty('--chrono-gradient-intensity', this.preferences.gradientIntensity);

        // Store in sessionStorage for FOUC prevention
        sessionStorage.setItem('theme', mode);

        // Update info display if settings panel exists
        this.updateInfoDisplay();
    }

    /**
     * Start the auto-update interval for time-based changes
     */
    startAutoUpdate() {
        // Update every minute to catch time period changes
        if (this.autoUpdateInterval) {
            clearInterval(this.autoUpdateInterval);
        }
        this.autoUpdateInterval = setInterval(() => {
            if (this.preferences.timeMode === 'auto' || this.preferences.seasonMode === 'auto') {
                this.applyTheme();
            }
        }, 60000);
    }

    /**
     * Watch for system theme preference changes
     */
    watchSystemTheme() {
        this.systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemThemeQuery.addEventListener('change', () => {
            if (this.preferences.mode === 'auto') {
                this.applyTheme();
            }
        });
    }

    /**
     * Cycle through color modes (click behavior)
     */
    cycleMode() {
        const modes = ['light', 'dark', 'auto'];
        const currentIndex = modes.indexOf(this.preferences.mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        this.setPreference('mode', modes[nextIndex]);
    }

    /**
     * Toggle settings panel visibility
     */
    toggleSettings() {
        this.settingsOpen = !this.settingsOpen;
        const panel = document.getElementById('chrono-settings');
        const overlay = document.getElementById('chrono-settings-overlay');

        if (panel) {
            panel.setAttribute('aria-hidden', !this.settingsOpen);
            if (this.settingsOpen) {
                // Focus first interactive element
                const firstFocusable = panel.querySelector('button, input');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }
        }

        if (overlay) {
            overlay.setAttribute('aria-hidden', !this.settingsOpen);
        }
    }

    /**
     * Close settings panel
     */
    closeSettings() {
        this.settingsOpen = false;
        const panel = document.getElementById('chrono-settings');
        const overlay = document.getElementById('chrono-settings-overlay');

        if (panel) {
            panel.setAttribute('aria-hidden', 'true');
        }
        if (overlay) {
            overlay.setAttribute('aria-hidden', 'true');
        }

        // Return focus to toggle button
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.focus();
        }
    }

    /**
     * Bind theme toggle button events
     */
    bindToggleEvents() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', (e) => {
            if (e.shiftKey) {
                // Shift+click opens settings
                this.toggleSettings();
            } else {
                // Regular click cycles mode
                this.cycleMode();
            }
        });

        // Add hint that shift+click opens settings
        toggle.setAttribute('data-settings-hint', 'true');
        toggle.setAttribute('title', 'Click to cycle theme, Shift+Click for settings');
    }

    /**
     * Bind settings panel events
     */
    bindSettingsEvents() {
        // Close button
        const closeBtn = document.getElementById('chrono-settings-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSettings());
        }

        // Overlay click to close
        const overlay = document.getElementById('chrono-settings-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSettings());
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsOpen) {
                this.closeSettings();
            }
        });

        // Mode radio buttons
        document.querySelectorAll('input[name="chrono-mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setPreference('mode', e.target.value);
            });
        });

        // Season select dropdown
        const seasonSelect = document.getElementById('chrono-season-select');
        if (seasonSelect) {
            seasonSelect.addEventListener('change', (e) => {
                this.setPreference('seasonMode', e.target.value);
            });
        }

        // Time select dropdown
        const timeSelect = document.getElementById('chrono-time-select');
        if (timeSelect) {
            timeSelect.addEventListener('change', (e) => {
                this.setPreference('timeMode', e.target.value);
            });
        }

        // Vibrancy slider
        const vibrancySlider = document.getElementById('chrono-vibrancy');
        const vibrancyValue = document.getElementById('chrono-vibrancy-value');
        if (vibrancySlider) {
            vibrancySlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.setPreference('vibrancy', value);
                if (vibrancyValue) {
                    vibrancyValue.textContent = `${Math.round(value * 100)}%`;
                }
            });
        }

        // Gradient intensity slider
        const gradientSlider = document.getElementById('chrono-gradient');
        const gradientValue = document.getElementById('chrono-gradient-value');
        if (gradientSlider) {
            gradientSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.setPreference('gradientIntensity', value);
                if (gradientValue) {
                    gradientValue.textContent = `${Math.round(value * 100)}%`;
                }
            });
        }

        // Reset button
        const resetBtn = document.getElementById('chrono-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetToDefaults());
        }
    }

    /**
     * Update settings UI to reflect current preferences
     */
    updateSettingsUI() {
        // Mode
        const modeRadio = document.querySelector(`input[name="chrono-mode"][value="${this.preferences.mode}"]`);
        if (modeRadio) modeRadio.checked = true;

        // Season (select dropdown)
        const seasonSelect = document.getElementById('chrono-season-select');
        if (seasonSelect) seasonSelect.value = this.preferences.seasonMode;

        // Time (select dropdown)
        const timeSelect = document.getElementById('chrono-time-select');
        if (timeSelect) timeSelect.value = this.preferences.timeMode;

        // Vibrancy
        const vibrancySlider = document.getElementById('chrono-vibrancy');
        const vibrancyValue = document.getElementById('chrono-vibrancy-value');
        if (vibrancySlider) {
            vibrancySlider.value = this.preferences.vibrancy;
        }
        if (vibrancyValue) {
            vibrancyValue.textContent = `${Math.round(this.preferences.vibrancy * 100)}%`;
        }

        // Gradient intensity
        const gradientSlider = document.getElementById('chrono-gradient');
        const gradientValue = document.getElementById('chrono-gradient-value');
        if (gradientSlider) {
            gradientSlider.value = this.preferences.gradientIntensity;
        }
        if (gradientValue) {
            gradientValue.textContent = `${Math.round(this.preferences.gradientIntensity * 100)}%`;
        }

        this.updateInfoDisplay();
    }

    /**
     * Update the info display with current computed values
     */
    updateInfoDisplay() {
        const season = this.getEffectiveSeason();
        const timePeriod = this.getEffectiveTimePeriod();
        const mode = this.getEffectiveMode();

        const seasonEl = document.getElementById('chrono-info-season');
        const timeEl = document.getElementById('chrono-info-time');
        const modeEl = document.getElementById('chrono-info-mode');

        if (seasonEl) seasonEl.textContent = SEASONS[season].name;
        if (timeEl) timeEl.textContent = TIME_PERIODS[timePeriod].name;
        if (modeEl) modeEl.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    }

    /**
     * Get season info for external use
     * @returns {Object} Current season configuration
     */
    getSeasonInfo() {
        const season = this.getEffectiveSeason();
        return {
            key: season,
            ...SEASONS[season]
        };
    }

    /**
     * Get time period info for external use
     * @returns {Object} Current time period configuration
     */
    getTimePeriodInfo() {
        const period = this.getEffectiveTimePeriod();
        return {
            key: period,
            ...TIME_PERIODS[period]
        };
    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.autoUpdateInterval) {
            clearInterval(this.autoUpdateInterval);
        }
        if (this.systemThemeQuery) {
            this.systemThemeQuery.removeEventListener('change', this.applyTheme);
        }
    }
}

// Create and export singleton instance
const chronoTheme = new ChronoTheme();

export default chronoTheme;
export { ChronoTheme, SEASONS, TIME_PERIODS };
