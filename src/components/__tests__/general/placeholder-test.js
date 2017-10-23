/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:10:25 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:10:25 
 */

/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Placeholder from '@components/general/Placeholder';

it('Placeholder renders correctly', () => {
    const tree = renderer.create(
        <Placeholder />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

it('Placeholder w/ Text renders correctly', () => {
    const tree = renderer.create(
        <Placeholder text={'Hello world!'} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
