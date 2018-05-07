import Constants from '../colors';
import Fixture from './fixtures/colors.fixture';

/* global it expect jest */

it('App Colors exist', () => {
    let numberOfConstants = 0;

    Object.keys(Constants).forEach(constant => {
        numberOfConstants += 1;
        expect(constant).not.toBe(null);
    });

    expect(numberOfConstants).not.toBe(0);
});

it('All App Colors expected exist', () => {
    expect(Constants).toMatchObject(Fixture);
});
