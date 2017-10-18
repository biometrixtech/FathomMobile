/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:21:42 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-12 11:22:02
 */

/**
 * Test to check if a reducer is working as expected
 */
/* global it expect jest */
import 'react-native';

import userReducer, { initialState } from '@redux/user/reducer';
import * as userActions from '@redux/user/actions';

it('Updates the state of the user on login', () => {
    expect(userReducer(initialState, userActions.login())).toEqual({
        ...initialState,
    });
});

it('Updates the state of the user on logout', () => {
    expect(userReducer(initialState, userActions.logout())).toEqual({
        ...initialState,
    });
});

it('Updates the state of the user on retrieval', () => {
    expect(userReducer(initialState, userActions.getMe())).toEqual({
        ...initialState,
    });
});

it('Updates the state of the user on update', () => {
    expect(userReducer(initialState, userActions.updateMe())).toEqual({
        ...initialState,
    });
});
