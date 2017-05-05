var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _Collapsible = require('./Collapsible');

var _Collapsible2 = babelHelpers.interopRequireDefault(_Collapsible);

var COLLAPSIBLE_PROPS = Object.keys(_Collapsible2.default.propTypes);
var VIEW_PROPS = Object.keys(_reactNative.View.propTypes);

var Accordion = function (_Component) {
  babelHelpers.inherits(Accordion, _Component);

  function Accordion(props) {
    babelHelpers.classCallCheck(this, Accordion);

    var _this = babelHelpers.possibleConstructorReturn(this, (Accordion.__proto__ || Object.getPrototypeOf(Accordion)).call(this, props));

    _this.state = {
      activeSection: props.activeSection !== undefined ? props.activeSection : props.initiallyActiveSection
    };
    return _this;
  }

  babelHelpers.createClass(Accordion, [{
    key: '_toggleSection',
    value: function _toggleSection(section) {
      var activeSection = this.state.activeSection === section ? false : section;

      if (this.props.activeSection === undefined) {
        this.setState({ activeSection: activeSection });
      }
      if (this.props.onChange) {
        this.props.onChange(activeSection);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.activeSection !== undefined) {
        this.setState({
          activeSection: nextProps.activeSection
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var viewProps = {};
      var collapsibleProps = {};
      Object.keys(this.props).forEach(function (key) {
        if (COLLAPSIBLE_PROPS.indexOf(key) !== -1) {
          collapsibleProps[key] = _this2.props[key];
        } else if (VIEW_PROPS.indexOf(key) !== -1) {
          viewProps[key] = _this2.props[key];
        }
      });

      return _react2.default.createElement(
        _reactNative.View,
        viewProps,
        this.props.sections.map(function (section, key) {
          return _react2.default.createElement(
            _reactNative.View,
            { key: key },
            _react2.default.createElement(
              _reactNative.TouchableHighlight,
              { onPress: function onPress() {
                  return _this2._toggleSection(key);
                }, underlayColor: _this2.props.underlayColor },
              _this2.props.renderHeader(section, key, _this2.state.activeSection === key)
            ),
            _react2.default.createElement(
              _Collapsible2.default,
              babelHelpers.extends({ collapsed: _this2.state.activeSection !== key }, collapsibleProps),
              _this2.props.renderContent(section, key, _this2.state.activeSection === key)
            )
          );
        })
      );
    }
  }]);
  return Accordion;
}(_react.Component);

Accordion.propTypes = {
  sections: _react.PropTypes.array.isRequired,
  renderHeader: _react.PropTypes.func.isRequired,
  renderContent: _react.PropTypes.func.isRequired,
  onChange: _react.PropTypes.func,
  align: _react.PropTypes.oneOf(['top', 'center', 'bottom']),
  duration: _react.PropTypes.number,
  easing: _react.PropTypes.string,
  initiallyActiveSection: _react.PropTypes.number,
  activeSection: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.number]),
  underlayColor: _react.PropTypes.string
};
Accordion.defaultProps = {
  underlayColor: 'black'
};


module.exports = Accordion;