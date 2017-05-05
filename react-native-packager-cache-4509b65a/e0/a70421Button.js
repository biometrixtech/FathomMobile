Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNativeElements = require('react-native-elements');

var _theme = require('@theme/');

var CustomButton = function (_Component) {
    babelHelpers.inherits(CustomButton, _Component);

    function CustomButton() {
        var _ref;

        var _temp, _this, _ret;

        babelHelpers.classCallCheck(this, CustomButton);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = CustomButton.__proto__ || Object.getPrototypeOf(CustomButton)).call.apply(_ref, [this].concat(args))), _this), _this.buttonProps = function () {
            var props = babelHelpers.extends({
                title: 'Coming Soon...',
                color: '#fff',
                fontWeight: 'bold',
                onPress: _this.props.onPress,
                fontFamily: _theme.AppFonts.base.family,
                fontSize: _theme.AppFonts.base.size,
                borderRadius: _theme.AppSizes.borderRadius,
                raised: true,
                buttonStyle: {
                    padding: 12,
                    marginLeft: 0,
                    marginRight: 0
                }
            }, _this.props, {
                backgroundColor: _this.props.backgroundColor || _theme.AppColors.brand.primary,
                small: false,
                large: false,
                icon: _this.props.icon && _this.props.icon.name ? babelHelpers.extends({
                    size: 14
                }, _this.props.icon) : null
            });

            if (_this.props.small) {
                props.fontSize = 12;
                props.buttonStyle.padding = 8;

                if (props.icon && props.icon.name) {
                    props.icon = babelHelpers.extends({
                        size: 14
                    }, props.icon);
                }
            }
            if (_this.props.large) {
                props.fontSize = 20;
                props.buttonStyle.padding = 15;

                if (props.icon && props.icon.name) {
                    props.icon = babelHelpers.extends({
                        size: 20
                    }, props.icon);
                }
            }

            if (_this.props.outlined) {
                props.raised = false;
                props.backgroundColor = _this.props.backgroundColor || 'transparent';
                props.color = _theme.AppColors.brand.primary;
                props.buttonStyle.borderWidth = 1;
                props.buttonStyle.borderColor = _theme.AppColors.brand.primary;

                if (props.icon && props.icon.name) {
                    props.icon = babelHelpers.extends({
                        color: _theme.AppColors.brand.primary
                    }, props.icon);
                }
            }

            return props;
        }, _this.render = function () {
            return _react2.default.createElement(_reactNativeElements.Button, _this.buttonProps());
        }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
    }

    return CustomButton;
}(_react.Component);

CustomButton.propTypes = {
    small: _react.PropTypes.bool,
    large: _react.PropTypes.bool,
    outlined: _react.PropTypes.bool,
    backgroundColor: _react.PropTypes.string,
    onPress: _react.PropTypes.func.isRequired,
    icon: _react.PropTypes.shape({
        name: _react.PropTypes.string
    })
};
CustomButton.defaultProps = {
    small: false,
    large: false,
    outlined: false,
    icon: {},
    backgroundColor: null
};
exports.default = CustomButton;