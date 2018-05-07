import Store from '../init';
import Fixture from './fixtures/init.fixture';

/* global it expect jest */

it('Action types exist', () => {
    let numberOfConstants = 0;

    Object.keys(Store).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All action types expected exist', () => {
    expect(Store).toMatchObject(Fixture);
});
