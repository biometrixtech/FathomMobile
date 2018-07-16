import Constants from '../roles';
import Fixture from './fixtures/roles.fixture';

/* global it expect jest */

it('User Roles exist', () => {
    let numberOfConstants = 0;

    Object.keys(Constants).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All User Roles expected exist', () => {
    expect(Constants).toMatchObject(Fixture);
});
