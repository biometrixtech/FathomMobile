var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var ANIMATED_EASING_PREFIXES = ['easeInOut', 'easeOut', 'easeIn'];

var Collapsible = function (_Component) {
  babelHelpers.inherits(Collapsible, _Component);
  babelHelpers.createClass(Collapsible, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.collapsed !== this.props.collapsed) {
        this._toggleCollapsed(nextProps.collapsed);
      } else if (nextProps.collapsed && nextProps.collapsedHeight !== this.props.collapsedHeight) {
        this.state.height.setValue(nextProps.collapsedHeight);
      }
    }
  }]);

  function Collapsible(props) {
    babelHelpers.classCallCheck(this, Collapsible);

    var _this = babelHelpers.possibleConstructorReturn(this, (Collapsible.__proto__ || Object.getPrototypeOf(Collapsible)).call(this, props));

    _this.contentHandle = null;

    _this._handleRef = function (ref) {
      _this.contentHandle = ref;
    };

    _this._handleLayoutChange = function (event) {
      var contentHeight = event.nativeEvent.layout.height;
      if (_this.state.animating || _this.props.collapsed || _this.state.measuring || _this.state.contentHeight === contentHeight) {
        return;
      }
      _this.state.height.setValue(contentHeight);
      _this.setState({ contentHeight: contentHeight });
    };

    _this.state = {
      measuring: false,
      measured: false,
      height: new _reactNative.Animated.Value(props.collapsedHeight),
      contentHeight: 0,
      animating: false
    };
    return _this;
  }

  babelHelpers.createClass(Collapsible, [{
    key: '_measureContent',
    value: function _measureContent(callback) {
      var _this2 = this;

      this.setState({
        measuring: true
      }, function () {
        requestAnimationFrame(function () {
          if (!_this2.contentHandle) {
            _this2.setState({
              measuring: false
            }, function () {
              return callback(_this2.props.collapsedHeight);
            });
          } else {
            _this2.contentHandle.getNode().measure(function (x, y, width, height) {
              _this2.setState({
                measuring: false,
                measured: true,
                contentHeight: height
              }, function () {
                return callback(height);
              });
            });
          }
        });
      });
    }
  }, {
    key: '_toggleCollapsed',
    value: function _toggleCollapsed(collapsed) {
      var _this3 = this;

      if (collapsed) {
        this._transitionToHeight(this.props.collapsedHeight);
      } else if (!this.contentHandle) {
        if (this.state.measured) {
          this._transitionToHeight(this.state.contentHeight);
        }
        return;
      } else {
        this._measureContent(function (contentHeight) {
          _this3._transitionToHeight(contentHeight);
        });
      }
    }
  }, {
    key: '_transitionToHeight',
    value: function _transitionToHeight(height) {
      var _this4 = this;

      var duration = this.props.duration;

      var easing = this.props.easing;
      if (typeof easing === 'string') {
        var prefix = void 0;
        var found = false;
        for (var i = 0; i < ANIMATED_EASING_PREFIXES.length; i++) {
          prefix = ANIMATED_EASING_PREFIXES[i];
          if (easing.substr(0, prefix.length) === prefix) {
            easing = easing.substr(prefix.length, 1).toLowerCase() + easing.substr(prefix.length + 1);
            prefix = prefix.substr(4, 1).toLowerCase() + prefix.substr(5);
            easing = _reactNative.Easing[prefix](_reactNative.Easing[easing || 'ease']);
            found = true;
            break;
          }
        }
        if (!found) {
          easing = _reactNative.Easing[easing];
        }
        if (!easing) {
          throw new Error('Invalid easing type "' + this.props.easing + '"');
        }
      }

      if (this._animation) {
        this._animation.stop();
      }
      this.setState({ animating: true });
      this._animation = _reactNative.Animated.timing(this.state.height, {
        toValue: height,
        duration: duration,
        easing: easing
      }).start(function (event) {
        return _this4.setState({ animating: false });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var collapsed = this.props.collapsed;
      var _state = this.state,
          height = _state.height,
          contentHeight = _state.contentHeight,
          measuring = _state.measuring,
          measured = _state.measured;

      var hasKnownHeight = !measuring && (measured || collapsed);
      var style = hasKnownHeight && {
        overflow: 'hidden',
        height: height
      };
      var contentStyle = {};
      if (measuring) {
        contentStyle.position = 'absolute', contentStyle.opacity = 0;
      } else if (this.props.align === 'center') {
        contentStyle.transform = [{
          translateY: height.interpolate({
            inputRange: [0, contentHeight],
            outputRange: [contentHeight / -2, 0]
          })
        }];
      } else if (this.props.align === 'bottom') {
        contentStyle.transform = [{
          translateY: height.interpolate({
            inputRange: [0, contentHeight],
            outputRange: [-contentHeight, 0]
          })
        }];
      }
      return _react2.default.createElement(
        _reactNative.Animated.View,
        {
          style: style,
          pointerEvents: collapsed ? 'none' : 'auto'
        },
        _react2.default.createElement(
          _reactNative.Animated.View,
          {
            ref: this._handleRef,
            style: [this.props.style, contentStyle],
            onLayout: this.state.animating ? undefined : this._handleLayoutChange
          },
          this.props.children
        )
      );
    }
  }]);
  return Collapsible;
}(_react.Component);

Collapsible.propTypes = {
  align: _react.PropTypes.oneOf(['top', 'center', 'bottom']),
  collapsed: _react.PropTypes.bool,
  collapsedHeight: _react.PropTypes.number,
  duration: _react.PropTypes.number,
  easing: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  style: _reactNative.View.propTypes.style
};
Collapsible.defaultProps = {
  align: 'top',
  collapsed: true,
  collapsedHeight: 0,
  duration: 300,
  easing: 'easeOutCubic'
};


module.exports = Collapsible;