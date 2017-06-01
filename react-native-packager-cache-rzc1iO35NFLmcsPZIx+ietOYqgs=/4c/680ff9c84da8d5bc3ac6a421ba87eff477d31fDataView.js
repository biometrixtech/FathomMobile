Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/containers/management/data/DataView.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactNativeElements = require('react-native-elements');

var _Accordion = require('react-native-collapsible/Accordion');

var _Accordion2 = babelHelpers.interopRequireDefault(_Accordion);

var _theme = require('@theme/');

var _ui = require('@ui/');

var styles = _reactNative.StyleSheet.create({
  whiteText: {
    color: '#FFF'
  },
  start: {
    color: _theme.AppColors.brand.primary
  },
  stop: {
    color: _theme.AppColors.brand.red
  },
  badgeTextStyle: {
    fontWeight: 'bold'
  },
  cardView: {
    backgroundColor: '#31363D',
    alignItems: 'center'
  }
});

var DataView = function (_Component) {
  babelHelpers.inherits(DataView, _Component);

  function DataView() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, DataView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = DataView.__proto__ || Object.getPrototypeOf(DataView)).call.apply(_ref, [this].concat(args))), _this), _this.status = {
      ready: '#00FF00',
      error: '#FF0000',
      notReady: '#0000FF'
    }, _this.toggleGroupSession = function (trainingGroup) {}, _this.togglePlayerSession = function (athlete) {}, _this.renderHeader = function (section, index, isActive) {
      var title = section.title;
      var numberOfAthletes = section.athletes.length;
      return _react2.default.createElement(
        _reactNative.View,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 72
          }
        },
        _react2.default.createElement(_ui.ListItem, { title: title, containerStyle: { backgroundColor: section.color }, badge: { value: numberOfAthletes, badgeTextStyle: styles.badgeTextStyle }, __source: {
            fileName: _jsxFileName,
            lineNumber: 73
          }
        })
      );
    }, _this.renderContent = function (section, index, isActive) {
      return _react2.default.createElement(
        _reactNative.View,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 80
          }
        },
        _react2.default.createElement(
          _reactNative.View,
          { style: { flexDirection: 'row', justifyContent: 'center', width: _theme.AppSizes.screen.width, height: 40 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 81
            }
          },
          _react2.default.createElement(
            _reactNative.View,
            { style: [_theme.AppStyles.flex1, _theme.AppStyles.containerCentered], __source: {
                fileName: _jsxFileName,
                lineNumber: 82
              }
            },
            section.title !== 'Team' ? _react2.default.createElement(_reactNativeElements.Icon, { name: 'account-plus', type: 'material-community', __source: {
                fileName: _jsxFileName,
                lineNumber: 83
              }
            }) : null
          ),
          _react2.default.createElement(_ui.Button, { style: [_theme.AppStyles.flex2], raised: true, onPress: function onPress() {
              return _this.toggleGroupSession;
            }, icon: { name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' }, title: (section.trainingActive ? 'Stop' : 'Start') + ' Group Session', backgroundColor: section.trainingActive ? _theme.AppColors.brand.red : _theme.AppColors.brand.primary, __source: {
              fileName: _jsxFileName,
              lineNumber: 85
            }
          }),
          _react2.default.createElement(
            _reactNative.View,
            { style: [_theme.AppStyles.flex1, _theme.AppStyles.containerCentered], __source: {
                fileName: _jsxFileName,
                lineNumber: 86
              }
            },
            section.title !== 'Team' ? _react2.default.createElement(_reactNativeElements.Icon, { name: 'account-remove', type: 'material-community', __source: {
                fileName: _jsxFileName,
                lineNumber: 87
              }
            }) : null
          )
        ),
        _react2.default.createElement(
          _reactNative.View,
          { style: [styles.cardView], __source: {
              fileName: _jsxFileName,
              lineNumber: 90
            }
          },
          section.athletes.map(function (athlete) {
            return _react2.default.createElement(
              _reactNative.View,
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 94
                }
              },
              _react2.default.createElement(
                _ui.Card,
                { title: athlete.name, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 95
                  }
                },
                section.title === 'Team' ? _react2.default.createElement(
                  _reactNative.View,
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 99
                    }
                  },
                  _react2.default.createElement(_ui.Button, { style: [_theme.AppStyles.containerCentered], raised: true, onPress: function onPress() {
                      return _this.togglePlayerSession;
                    }, icon: { name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' }, title: (section.trainingActive ? 'Stop' : 'Start') + ' Athlete Session', backgroundColor: section.trainingActive ? _theme.AppColors.brand.red : _theme.AppColors.brand.primary, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 100
                    }
                  }),
                  _react2.default.createElement(_ui.Spacer, { size: 5, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 101
                    }
                  })
                ) : null,
                _react2.default.createElement(
                  _reactNative.View,
                  { style: [{ flexDirection: 'row', width: _theme.AppSizes.screen.width }, _theme.AppStyles.containerCentered], __source: {
                      fileName: _jsxFileName,
                      lineNumber: 105
                    }
                  },
                  _react2.default.createElement(
                    _ui.Text,
                    {
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 106
                      }
                    },
                    'Kit Status:'
                  )
                ),
                _react2.default.createElement(_ui.Spacer, { size: 5, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 110
                  }
                })
              ),
              _react2.default.createElement(_ui.Spacer, { size: 10, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 112
                }
              })
            );
          })
        )
      );
    }, _this.render = function () {
      return _react2.default.createElement(
        _reactNative.ScrollView,
        { style: [_theme.AppStyles.container], __source: {
            fileName: _jsxFileName,
            lineNumber: 123
          }
        },
        _react2.default.createElement(_Accordion2.default, {
          sections: _this.props.user.trainingGroups,
          renderHeader: _this.renderHeader,
          renderContent: _this.renderContent,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 124
          }
        })
      );
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  return DataView;
}(_react.Component);

DataView.componentName = 'DataView';
DataView.propTypes = {
  user: _react.PropTypes.object
};
DataView.defaultProps = {
  user: {}
};
exports.default = DataView;