import Constants from '../thresholds';
import Fixture from './fixtures/thresholds.fixture';

/* global it expect jest */

it('Stats Thresholds exist', () => {
    let numberOfConstants = 0;

    Object.keys(Constants).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All Stats Thresholds expected exist', () => {
    expect(Constants).toMatchObject(Fixture);
});
