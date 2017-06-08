Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/components/ui/Text.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _theme = require('@theme/');

var CustomText = function (_Component) {
    babelHelpers.inherits(CustomText, _Component);

    function CustomText() {
        var _ref;

        var _temp, _this, _ret;

        babelHelpers.classCallCheck(this, CustomText);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = CustomText.__proto__ || Object.getPrototypeOf(CustomText)).call.apply(_ref, [this].concat(args))), _this), _this.textProps = function () {
            var props = babelHelpers.extends({}, _this.props, {
                style: [_theme.AppStyles.baseText]
            });

            if (_this.props.p) {
                props.style = [_theme.AppStyles.p];
            }
            if (_this.props.h1) {
                props.style = [_theme.AppStyles.h1];
            }
            if (_this.props.h2) {
                props.style = [_theme.AppStyles.h2];
            }
            if (_this.props.h3) {
                props.style = [_theme.AppStyles.h3];
            }
            if (_this.props.h4) {
                props.style = [_theme.AppStyles.h4];
            }
            if (_this.props.h5) {
                props.style = [_theme.AppStyles.h5];
            }
            if (_this.props.onPress) {
                props.style.push(_theme.AppStyles.link);
            }

            if (_this.props.style) {
                props.style.push(_this.props.style);
            }

            return props;
        }, _this.render = function () {
            return _react2.default.createElement(
                _reactNative.Text,
                babelHelpers.extends({}, _this.textProps(), {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 64
                    }
                }),
                _this.props.children
            );
        }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
    }

    return CustomText;
}(_react.Component);

CustomText.propTypes = {
    h1: _react.PropTypes.bool,
    h2: _react.PropTypes.bool,
    h3: _react.PropTypes.bool,
    h4: _react.PropTypes.bool,
    h5: _react.PropTypes.bool,
    p: _react.PropTypes.bool,
    onPress: _react.PropTypes.func,
    style: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.shape({})]),
    children: _react.PropTypes.node
};
CustomText.defaultProps = {
    h1: false,
    h2: false,
    h3: false,
    h4: false,
    h5: false,
    p: false,
    onPress: null,
    style: null,
    children: null
};
exports.default = CustomText;