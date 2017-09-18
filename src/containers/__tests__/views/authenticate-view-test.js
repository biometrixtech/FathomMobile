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
