import Store from '../user';
import Fixture from './fixtures/user.fixture';

/* global it expect jest */

it('User default store exists', () => {
    let numberOfConstants = 0;

    Object.keys(Store).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All User default store values exist as expected', () => {
    expect(Store).toMatchObject(Fixture);
});
