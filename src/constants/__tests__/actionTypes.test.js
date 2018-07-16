import Constants from '../actionTypes';
import Fixture from './fixtures/actionTypes.fixture';

/* global it expect jest */

it('Action types exist', () => {
    let numberOfConstants = 0;

    Object.keys(Constants).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All action types expected exist', () => {
    expect(Constants).toMatchObject(Fixture);
});
