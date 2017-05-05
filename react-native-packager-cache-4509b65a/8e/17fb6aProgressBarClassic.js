'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Style = require('./Style.js');

var _Style2 = babelHelpers.interopRequireDefault(_Style);

var React = require('react');

var _require = require('react-native'),
    AppRegistry = _require.AppRegistry,
    StyleSheet = _require.StyleSheet,
    Text = _require.Text,
    View = _require.View,
    LayoutAnimation = _require.LayoutAnimation;

var ProgressBarClassic = function (_React$Component) {
  babelHelpers.inherits(ProgressBarClassic, _React$Component);

  function ProgressBarClassic() {
    babelHelpers.classCallCheck(this, ProgressBarClassic);

    var _this = babelHelpers.possibleConstructorReturn(this, (ProgressBarClassic.__proto__ || Object.getPrototypeOf(ProgressBarClassic)).call(this));

    _this.state = {
      progress: 0,
      init_animation: false
    };
    return _this;
  }

  babelHelpers.createClass(ProgressBarClassic, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      LayoutAnimation.spring();
      setTimeout(function () {
        _this2.setState({ progress: _this2.props.progress });
      }, 0);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ progress: nextProps.progress });
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      LayoutAnimation.spring();
    }
  }, {
    key: 'render',
    value: function render() {
      var value = false;
      var valueBalloon = false;
      var label = false;
      var marginTop = 0;

      switch (this.props.valueStyle) {
        case 'baloon':
          valueBalloon = React.createElement(
            View,
            { style: _Style2.default.flexBox },
            React.createElement(
              View,
              { style: [{ flex: this.state.progress }] },
              React.createElement(
                View,
                { style: _Style2.default.progressBar__balloon },
                React.createElement(View, { style: _Style2.default.progressBar__balloonArrow }),
                React.createElement(
                  Text,
                  { style: _Style2.default.progressBar__balloonVal },
                  this.state.progress,
                  '%'
                )
              )
            ),
            React.createElement(View, { style: [{ flex: 100 - this.state.progress }] })
          );
          marginTop = 30;

          break;
        case 'none':
          break;
        default:
          value = React.createElement(
            View,
            { style: _Style2.default.progressBar_mes },
            React.createElement(
              Text,
              { style: _Style2.default.progressBar__val },
              this.state.progress,
              '%'
            )
          );
          break;
      }

      if (this.props.valueStyle !== 'baloon' && this.props.label) {
        marginTop = 20;
        label = React.createElement(
          View,
          { style: _Style2.default.labelWrap },
          React.createElement(
            Text,
            { style: _Style2.default.label },
            this.props.label,
            ' ',
            this.props.value && ': ' + this.props.value
          )
        );
      }

      var chart = React.createElement(
        View,
        null,
        valueBalloon,
        label,
        React.createElement(
          View,
          { style: [_Style2.default.flexBox, _Style2.default.progressBar, { marginTop: marginTop }] },
          React.createElement(
            View,
            { style: [_Style2.default.progressBar_left, { flex: this.state.progress }] },
            value
          ),
          React.createElement(View, { style: [_Style2.default.progressBar_right, { flex: 100 - this.state.progress }] })
        )
      );
      return chart;
    }
  }]);
  return ProgressBarClassic;
}(React.Component);

exports.default = ProgressBarClassic;


ProgressBarClassic.defaultProps = {
  progress: 0
};