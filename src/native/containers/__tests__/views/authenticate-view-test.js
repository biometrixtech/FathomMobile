/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:32:04 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:32:04 
 */

/**
 * Test to check if the component renders correctly
 */
/* global it expect jest */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import LoginView from '@containers/auth/LoginView';

it('LoginView renders correctly', () => {
    const tree = renderer.create(
        <LoginView />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
