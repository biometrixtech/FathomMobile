import Store from '../ble';
import Fixture from './fixtures/ble.fixture';

/* global it expect jest */

it('Bluetooth default store exists', () => {
    let numberOfConstants = 0;

    Object.keys(Store).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All Bluetooth default store values exist as expected', () => {
    expect(Store).toMatchObject(Fixture);
});
