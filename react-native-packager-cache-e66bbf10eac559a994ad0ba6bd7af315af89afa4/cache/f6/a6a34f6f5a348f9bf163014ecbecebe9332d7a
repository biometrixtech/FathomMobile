Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/components/ui/ListItem.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNativeElements = require('react-native-elements');

var _theme = require('@theme/');

var CustomListItem = function (_Component) {
    babelHelpers.inherits(CustomListItem, _Component);

    function CustomListItem() {
        var _ref;

        var _temp, _this, _ret;

        babelHelpers.classCallCheck(this, CustomListItem);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = CustomListItem.__proto__ || Object.getPrototypeOf(CustomListItem)).call.apply(_ref, [this].concat(args))), _this), _this.listItemProps = function () {
            var props = babelHelpers.extends({
                title: 'Coming Soon...',
                chevronColor: _theme.AppColors.textSecondary,
                underlayColor: _theme.AppColors.border
            }, _this.props, {
                containerStyle: [{
                    backgroundColor: _theme.AppColors.listItemBackground,
                    borderTopColor: _theme.AppColors.border,
                    borderBottomColor: _theme.AppColors.border
                }],
                titleStyle: [_theme.AppStyles.baseText],
                subtitleStyle: [_theme.AppStyles.subtext]
            });

            if (_this.props.containerStyle) {
                props.containerStyle.push(_this.props.containerStyle);
            }

            if (_this.props.titleStyle) {
                props.titleStyle.push(_this.props.titleStyle);
            }

            if (_this.props.subtitleStyle) {
                props.subtitleStyle.push(_this.props.subtitleStyle);
            }

            return props;
        }, _this.render = function () {
            return _react2.default.createElement(_reactNativeElements.ListItem, babelHelpers.extends({}, _this.listItemProps(), {
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 67
                }
            }));
        }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
    }

    return CustomListItem;
}(_react.Component);

CustomListItem.propTypes = {
    containerStyle: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.shape({})]),
    titleStyle: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.shape({})]),
    subtitleStyle: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.shape({})])
};
CustomListItem.defaultProps = {
    containerStyle: [],
    titleStyle: [],
    subtitleStyle: []
};
exports.default = CustomListItem;