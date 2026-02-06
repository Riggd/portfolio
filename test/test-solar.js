
// Verification script for Solar Calculations using SunCalc
import SunCalc from 'suncalc';

// User provided data for Indianapolis on Feb 5, 2026
// Rise: 7:48 am
// Set: 6:09 pm (18:09)
// Noon: 12:58 pm

const LOCATION = {
    name: 'Indianapolis, IN',
    latitude: 39.7684,
    longitude: -86.1581,
    tzOffset: -5 // EST
};

const INDY_DATE = new Date(2026, 1, 5); // Feb 5, 2026

console.log(`\n=== Verifying User Data: ${LOCATION.name} ===`);
console.log(`Date: ${INDY_DATE.toDateString()}`);

// SunCalc Times
const times = SunCalc.getTimes(INDY_DATE, LOCATION.latitude, LOCATION.longitude);

function format(date) {
    if (!date) return 'Invalid';
    // SunCalc returns dates in local time of the environment running it presumably?
    // Actually SunCalc returns a simple Date object with the UTC timestamp correct.
    // When validation, we need to check the hours/min relative to the timezone.

    // We can use toLocaleTimeString with timeZone
    return date.toLocaleTimeString('en-US', {
        timeZone: 'America/Indianapolis',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

console.log(`\nSunCalc Results (Indianapolis Time):`);
console.log(`Sunrise: ${format(times.sunrise)} (Expected: 07:48 AM)`);
console.log(`Sunset:  ${format(times.sunset)}  (Expected: 06:09 PM)`);
console.log(`Noon:    ${format(times.solarNoon)} (Expected: 12:58 PM)`);

console.log(`\n---------------------------------`);

// Elevation Check
// Lightness logic depends on Elevation.
// Noon Elevation Check
const noonPos = SunCalc.getPosition(times.solarNoon, LOCATION.latitude, LOCATION.longitude);
const noonEl = noonPos.altitude * (180 / Math.PI);
console.log(`Max Elevation: ${noonEl.toFixed(1)}° (Expected: ~34°)`);

// Check Lightness Logic with accurate elevation
function calculateLightness(elevation) {
    const minL = 0.05;
    const twilightL = 0.40;
    const maxL = 0.98;
    const astroEnd = -18;
    const civilStart = -6;

    if (elevation < astroEnd) return minL;

    let ambient = minL;
    if (elevation >= astroEnd) {
        const twilightRange = civilStart - astroEnd; // 12
        const current = Math.min(elevation, civilStart) - astroEnd;
        const progress = Math.max(0, current / twilightRange);
        const boost = Math.sqrt(progress);
        ambient = minL + (boost * (twilightL - minL));
    }

    let direct = 0;
    if (elevation > civilStart) {
        const maxDirect = maxL - twilightL;
        if (elevation > 0) {
            const intensity = Math.sin(elevation * (Math.PI / 180));
            direct = maxDirect * Math.max(0, intensity);
        }
    }
    return Math.min(1.0, ambient + direct);
}

console.log(`Lightness at Noon: ${calculateLightness(noonEl).toFixed(2)}`);
