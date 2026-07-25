/*
Checks the math against numbers you can look up on a real
ductulator or in the ASHRAE equivalent-diameter table.
Run with: npm test
*/
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    availableStaticPressure,
    cfmAtSize,
    distributeCfm,
    equivalentDiameter,
    frictionPer100ft,
    frictionRate,
    gradeAspectRatio,
    gradeVelocity,
    nextRoundSize,
    reduceTrunk,
    requiredDiameter,
    requiredFreeArea,
    returnPlan,
    roundVelocity,
    systemCfm,
    widthForEquivalentDiameter,
} from './ductMath.js';

import { STARTER_SELECTIONS, totalEffectiveLength } from './fittings.js';

const close = (actual, expected, tolerance) =>
    assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);

/* Ductulator spot checks at the classic 0.10 in.wc / 100 ft. */
test('capacity at 0.10 friction matches a ductulator', () => {
    close(cfmAtSize(6, 0.1), 109, 4);
    close(cfmAtSize(8, 0.1), 227, 8);
    close(cfmAtSize(10, 0.1), 419, 12);
    close(cfmAtSize(12, 0.1), 679, 20);
});

test('requiredDiameter inverts frictionPer100ft', () => {
    const diameter = requiredDiameter(600, 0.09);
    close(frictionPer100ft(600, diameter), 0.09, 0.0001);
});

test('rougher material demands a bigger duct', () => {
    assert.ok(requiredDiameter(400, 0.08, 1.5) > requiredDiameter(400, 0.08, 1.0));
});

test('nextRoundSize never rounds down', () => {
    assert.equal(nextRoundSize(9.83), 10);
    assert.equal(nextRoundSize(10), 10);
    assert.equal(nextRoundSize(10.01), 12);
});

/* ASHRAE equivalent round duct table: 12x12 -> 13.1, 8x20 -> 13.5 */
test('equivalent diameter matches the published table', () => {
    close(equivalentDiameter(12, 12), 13.1, 0.1);
    close(equivalentDiameter(20, 8), 13.5, 0.1);
});

test('widthForEquivalentDiameter round-trips', () => {
    const de = equivalentDiameter(20, 8);
    close(widthForEquivalentDiameter(8, de), 20, 0.05);
});

test('velocity in a 10 inch pipe at 400 cfm is about 733 fpm', () => {
    close(roundVelocity(400, 10), 733, 2);
});

test('airflow presets', () => {
    assert.equal(systemCfm(2.5, 400), 1000);
    assert.equal(systemCfm(3, 350), 1050);
});

test('room airflow splits by area weighted by exposure and sums to the total', () => {
    const rooms = [
        { name: 'Living', area: 300, exposure: 1.35 },
        { name: 'Bed', area: 150, exposure: 1.15 },
        { name: 'Hall', area: 100, exposure: 1.0 },
    ];
    const result = distributeCfm(rooms, 1000);
    const sum = result.reduce((total, room) => total + room.cfm, 0);

    close(sum, 1000, 3);
    assert.ok(result[0].cfm > result[1].cfm, 'the big exposed room gets the most air');
});

test('pressure budget subtracts every component in the airstream', () => {
    const { spent, available } = availableStaticPressure(0.7, { coil: 0.25, filter: 0.15, registers: 0.03 });
    close(spent, 0.43, 1e-9);
    close(available, 0.27, 1e-9);
});

test('friction rate is pressure spread over effective length', () => {
    close(frictionRate(0.25, 250), 0.1, 1e-9);
    assert.equal(frictionRate(0.25, 0), 0);
});

test('the starter fitting kit lands on a normal friction rate', () => {
    const tel = totalEffectiveLength({ supplyRun: 40, returnRun: 25, selections: STARTER_SELECTIONS });
    const rate = frictionRate(0.27, tel.total);

    assert.equal(tel.fittings, 35 + 30 + 35 + 60 + 30 + 20);
    assert.ok(rate > 0.06 && rate < 0.18, `rate ${rate} should be in the workable band`);
});

test('velocity grading flags noise and lazy air', () => {
    assert.equal(gradeVelocity(1200, 'supplyTrunk').level, 'bad');
    assert.equal(gradeVelocity(800, 'supplyTrunk').level, 'good');
    assert.equal(gradeVelocity(300, 'supplyBranch').level, 'warn');
});

test('aspect ratio grading', () => {
    assert.equal(gradeAspectRatio(1.5).level, 'good');
    assert.equal(gradeAspectRatio(3).level, 'warn');
    assert.equal(gradeAspectRatio(5).level, 'bad');
});

test('return grille free area follows the 400 fpm rule of thumb', () => {
    /* 400 cfm at 400 fpm needs one square foot of net free area. */
    close(requiredFreeArea(400, 400), 144, 0.5);
});

test('return plan sizes for the whole blower, not one room', () => {
    const plan = returnPlan(1200, { faceVelocity: 400, grilleType: 'stamped', rate: 0.08 });
    assert.ok(plan.faceAreaSqFt > 4, 'a 1200 cfm return needs serious face area');
    assert.ok(plan.nominalDuct >= 16);
    assert.ok(plan.twoGrilles < plan.singleGrille);
});

test('trunk reduction subtracts each branch as it peels off', () => {
    const steps = reduceTrunk(1200, [{ cfm: 300 }, { cfm: 300 }, { cfm: 300 }], 0.08);

    assert.equal(steps[0].cfmAfter, 900);
    assert.equal(steps[2].cfmAfter, 300);
    assert.ok(steps[0].nominalRound > steps[2].nominalRound, 'the trunk gets smaller downstream');
});
