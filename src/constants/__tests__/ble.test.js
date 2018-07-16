import Constants from '../ble';
import Fixture from './fixtures/ble.fixture';

/* global it expect jest */

it('BLE Commands exist', () => {
    let numberOfConstants = 0;

    Object.keys(Constants).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All BLE commands expected exist', () => {
    expect(Constants).toMatchObject(Fixture);
});
