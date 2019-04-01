/**
 * @format
 */

/* global it expect jest */
import 'react-native';
import Root from '../src';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// setup tests
it('renders correctly', () => {
    renderer.create(<Root />);
});
