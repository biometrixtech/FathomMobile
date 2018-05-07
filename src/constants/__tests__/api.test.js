import Constants from '../api';
import Fixture from './fixtures/api.fixture';

/* global it expect jest */

it('APIs exist', () => {
    let numberOfConstants = 0;

    Object.keys(Constants).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All APIs expected exist', () => {
    expect(Constants).toMatchObject(Fixture);
});
