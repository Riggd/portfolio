import assert from 'node:assert';
import SunCalc from 'suncalc';

// Mock Browser APIs before dynamic import
global.localStorage = { getItem: () => null, setItem: () => { } };
global.window = { innerWidth: 1000, innerHeight: 1000, addEventListener: () => { } };
global.document = {
    querySelectorAll: () => [],
    documentElement: {
        style: { setProperty: () => { } },
        setAttribute: () => { }
    },
    getElementById: () => null
};
global.performance = { now: () => 0 };
global.requestAnimationFrame = () => { };
global.sessionStorage = { setItem: () => { } };

const { default: chronoTheme } = await import('../src/assets/js/chrono-theme.js');

console.log('--- Running Solar Calculations Tests ---');

// Test calculateSolarHueShift for continuity (no jarring jumps)
function testHueShiftContinuity() {
    console.log('Testing calculateSolarHueShift continuity...');

    const elevations = [-18.1, -18, -17.9, -12, -6.1, -6, -5.9, -0.1, 0, 0.1, 5.9, 6, 6.1];

    for (let i = 0; i < elevations.length - 1; i++) {
        const e1 = elevations[i];
        const e2 = elevations[i + 1];
        const s1 = chronoTheme.calculateSolarHueShift(e1);
        const s2 = chronoTheme.calculateSolarHueShift(e2);

        // Assert no massive jumps within 0.1 degree steps if they are nearby points
        if (Math.abs(e2 - e1) <= 0.2) {
            const diff = Math.abs(s2 - s1);
            assert.ok(diff < 2.0, `Jarring jump detected between elevation ${e1} and ${e2}: shift went from ${s1} to ${s2}`);
        }
    }

    // Specific peak checks
    assert.strictEqual(chronoTheme.calculateSolarHueShift(-18), 0, 'Shift should be 0 at end of twilight');
    assert.strictEqual(chronoTheme.calculateSolarHueShift(-12), 20, 'Shift should peak at 20 during Blue Hour');
    assert.strictEqual(chronoTheme.calculateSolarHueShift(-6), 0, 'Shift should be 0 at transition between Blue and Golden Hour');
    assert.strictEqual(chronoTheme.calculateSolarHueShift(0), -30, 'Shift should peak at -30 during Golden Hour');
    assert.strictEqual(chronoTheme.calculateSolarHueShift(6), 0, 'Shift should be 0 at end of Golden Hour');

    console.log('calculateSolarHueShift tests passed. ✅');
}

// Test Lightness continuity
function testLightnessContinuity() {
    console.log('Testing calculateLightnessFromTime (Elevation mapping)...');

    let prevLightness = null;
    let maxJump = 0;

    for (let m = 0; m < 1440; m += 5) { // every 5 minutes
        const l = chronoTheme.calculateLightnessFromTime(m, 180); // mid year
        if (prevLightness !== null) {
            const diff = Math.abs(l - prevLightness);
            if (diff > maxJump) maxJump = diff;
        }
        prevLightness = l;
    }

    // 5 minutes should never cause a huge lightness jump (max 0.05 implies ~1% per minute max)
    assert.ok(maxJump < 0.05, `Max lightness jump for 5 min interval was too high: ${maxJump}`);

    console.log('calculateLightnessFromTime tests passed. ✅');
}

try {
    testHueShiftContinuity();
    testLightnessContinuity();
    console.log('\nAll tests passed successfully! 🚀');
} catch (e) {
    console.error('\n❌ Test Failed:', e.message);
    process.exit(1);
}
