Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-elements/src/list/List.js';

var _propTypes = require('prop-types');

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _colors = require('../config/colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var List = function List(props) {
  var children = props.children,
      containerStyle = props.containerStyle,
      attributes = babelHelpers.objectWithoutProperties(props, ['children', 'containerStyle']);

  return _react2.default.createElement(
    _reactNative.View,
    babelHelpers.extends({
      style: [styles.listContainer, containerStyle && containerStyle]
    }, attributes, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 9
      }
    }),
    children
  );
};

List.propTypes = {
  children: _propTypes2.default.any,
  containerStyle: _reactNative.View.propTypes.style
};

var styles = _reactNative.StyleSheet.create({
  listContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: _colors2.default.greyOutline,
    backgroundColor: _colors2.default.white
  }
});

exports.default = List;