Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _colors = require('../config/colors');

var _colors2 = babelHelpers.interopRequireDefault(_colors);

var styles = void 0;

var List = function List(_ref) {
  var children = _ref.children,
      containerStyle = _ref.containerStyle;
  return _react2.default.createElement(
    _reactNative.View,
    { style: [styles.listContainer, containerStyle && containerStyle] },
    children
  );
};

List.propTypes = {};

styles = _reactNative.StyleSheet.create({
  listContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: _colors2.default.greyOutline,
    backgroundColor: _colors2.default.white
  }
});

exports.default = List;