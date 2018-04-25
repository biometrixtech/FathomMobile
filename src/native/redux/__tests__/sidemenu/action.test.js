/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:22:38 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:22:38 
 */

/**
 * Test to check if an action is working as expected
 */
/* global it expect jest */
import 'react-native';

import * as sideMenuActions from '../../sidemenu/actions';

it('Creates a SIDEMENU_TOGGLE action', () => {
    expect(sideMenuActions.toggle()).toEqual({
        type: 'SIDEMENU_TOGGLE',
    });
});

it('Creates a SIDEMENU_OPEN action', () => {
    expect(sideMenuActions.open()).toEqual({
        type: 'SIDEMENU_OPEN',
    });
});

it('Creates a SIDEMENU_CLOSE action', () => {
    expect(sideMenuActions.close()).toEqual({
        type: 'SIDEMENU_CLOSE',
    });
});
