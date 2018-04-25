/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:22:57 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-12 00:05:20
 */

/**
 * Test to check if a reducer is working as expected
 */
/* global it expect jest */
import 'react-native';

import routerReducer, { initialState } from '../../router/reducer';
import { ActionConst } from 'react-native-router-flux';

it('Updates the state of the router', () => {
    expect(routerReducer(initialState, ActionConst)).toEqual({
        ...initialState,
        scene: {},
    });
});
