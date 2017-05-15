'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/node_modules/react-native-progress-bar-classic/lib/ProgressBarClassic.js';

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
            { style: _Style2.default.flexBox, __source: {
                fileName: _jsxFileName,
                lineNumber: 47
              }
            },
            React.createElement(
              View,
              { style: [{ flex: this.state.progress }], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 48
                }
              },
              React.createElement(
                View,
                { style: _Style2.default.progressBar__balloon, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 49
                  }
                },
                React.createElement(View, { style: _Style2.default.progressBar__balloonArrow, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 50
                  }
                }),
                React.createElement(
                  Text,
                  { style: _Style2.default.progressBar__balloonVal, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 51
                    }
                  },
                  this.state.progress,
                  '%'
                )
              )
            ),
            React.createElement(View, { style: [{ flex: 100 - this.state.progress }], __source: {
                fileName: _jsxFileName,
                lineNumber: 54
              }
            })
          );
          marginTop = 30;

          break;
        case 'none':
          break;
        default:
          value = React.createElement(
            View,
            { style: _Style2.default.progressBar_mes, __source: {
                fileName: _jsxFileName,
                lineNumber: 64
              }
            },
            React.createElement(
              Text,
              { style: _Style2.default.progressBar__val, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 65
                }
              },
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
          { style: _Style2.default.labelWrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 74
            }
          },
          React.createElement(
            Text,
            { style: _Style2.default.label, __source: {
                fileName: _jsxFileName,
                lineNumber: 75
              }
            },
            this.props.label,
            ' ',
            this.props.value && ': ' + this.props.value
          )
        );
      }

      var chart = React.createElement(
        View,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 81
          }
        },
        valueBalloon,
        label,
        React.createElement(
          View,
          { style: [_Style2.default.flexBox, _Style2.default.progressBar, { marginTop: marginTop }], __source: {
              fileName: _jsxFileName,
              lineNumber: 84
            }
          },
          React.createElement(
            View,
            { style: [_Style2.default.progressBar_left, { flex: this.state.progress }], __source: {
                fileName: _jsxFileName,
                lineNumber: 85
              }
            },
            value
          ),
          React.createElement(View, { style: [_Style2.default.progressBar_right, { flex: 100 - this.state.progress }], __source: {
              fileName: _jsxFileName,
              lineNumber: 88
            }
          })
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