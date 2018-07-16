import Constants from '../config';
import Fixture from './fixtures/config.fixture';

/* global it expect jest */

it('App Configs exist', () => {
    let numberOfConstants = 0;

    Object.keys(Constants).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All App Configs expected exist', () => {
    expect(Constants).toMatchObject(Fixture);
});
