/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:13:02 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-12 11:26:02
 */

/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import ListItem from '@ui/ListItem';

it('ListItem renders correctly', () => {
    const tree = renderer.create(
        <ListItem
            title={'Hello world'}
            subTitle={'Sub title'}
            roundAvatar
            avatar={require('@images/image.png')}
        />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
