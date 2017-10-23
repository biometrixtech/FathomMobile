/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:13:48 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-12 11:26:06
 */

/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import { List, ListItem } from '@ui';

it('List renders correctly', () => {
    const tree = renderer.create(
        <List>
            <ListItem title={'Hello'} />
            <ListItem title={'Second'} />
        </List>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
