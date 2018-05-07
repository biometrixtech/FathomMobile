import Constants from '../errors';
import Fixture from './fixtures/errors.fixture';

/* global it expect jest */

it('App Error messages exist', () => {
    let numberOfConstants = 0;

    Object.keys(Constants).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All App Error messages expected exist', () => {
    expect(Constants).toMatchObject(Fixture);
});
