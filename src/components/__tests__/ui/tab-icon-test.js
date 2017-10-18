/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:14:04 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-12 11:26:10
 */

/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import TabIcon from '@ui/TabIcon';

it('TabIcon renders correctly', () => {
    const tree = renderer.create(
        <TabIcon icon={'help'} selected />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
