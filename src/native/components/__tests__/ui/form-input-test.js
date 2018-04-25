/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:12:37 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-12 11:25:55
 */

/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import FormInput from '@ui/FormInput';

it('FormInput renders correctly', () => {
    const tree = renderer.create(
        <FormInput value={'John Smith'} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
