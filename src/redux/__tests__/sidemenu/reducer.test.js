/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:22:11 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-12 11:22:31
 */

/**
 * Test to check if a reducer is working as expected
 */
/* global it expect jest */
import 'react-native';

import sideMenuReducer, { initialState } from '@redux/sidemenu/reducer';
import * as sideMenuActions from '@redux/sidemenu/actions';

it('Updates the state of the side menu to toggle', () => {
    expect(sideMenuReducer(initialState, sideMenuActions.toggle())).toEqual({
        ...initialState,
        isOpen: !initialState.isOpen,
    });
});

it('Updates the state of the side menu to open', () => {
    expect(sideMenuReducer(initialState, sideMenuActions.open())).toEqual({
        ...initialState,
        isOpen: true,
    });
});

it('Updates the state of the side menu to close', () => {
    expect(sideMenuReducer(initialState, sideMenuActions.close())).toEqual({
        ...initialState,
        isOpen: false,
    });
});
