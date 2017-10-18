/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:31:40 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:31:40 
 */

/**
 * Test to check if the container is created correctly
 */
/* global it expect jest */
import 'react-native';

import LaunchContainer from '@containers/Launch/LaunchContainer';

// Check if LaunchContainer is created correctly
it('LaunchContainer is created correctly', () => {
    expect(typeof LaunchContainer).toEqual('function');
});
