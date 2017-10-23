/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:10:01 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:10:01 
 */

/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Loading from '@components/general/Loading';

it('Loading renders correctly', () => {
    const tree = renderer.create(
        <Loading />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

it('Loading w/ text renders correctly', () => {
    const tree = renderer.create(
        <Loading text={'Checking for Updates'} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
