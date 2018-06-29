import Store from '../init';
import Fixture from './fixtures/init.fixture';

/* global it expect jest */

it('Init default store exists', () => {
    let numberOfConstants = 0;

    Object.keys(Store).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All Init default store values exist as expected', () => {
    expect(Store).toMatchObject(Fixture);
});
