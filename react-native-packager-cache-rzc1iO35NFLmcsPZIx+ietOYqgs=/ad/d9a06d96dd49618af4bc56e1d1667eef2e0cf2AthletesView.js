Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/Users/vdesai/Biometrix/FathomMobile/src/containers/management/athletes/AthletesView.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactNativeElements = require('react-native-elements');

var _Accordion = require('react-native-collapsible/Accordion');

var _Accordion2 = babelHelpers.interopRequireDefault(_Accordion);

var _reactNativeCollapsible = require('react-native-collapsible');

var _reactNativeCollapsible2 = babelHelpers.interopRequireDefault(_reactNativeCollapsible);

var _reactNativeProgressBarClassic = require('react-native-progress-bar-classic');

var _reactNativeProgressBarClassic2 = babelHelpers.interopRequireDefault(_reactNativeProgressBarClassic);

var _reactNativeModalPicker = require('react-native-modal-picker');

var _reactNativeModalPicker2 = babelHelpers.interopRequireDefault(_reactNativeModalPicker);

var _theme = require('@theme/');

var _ui = require('@ui/');

var styles = _reactNative.StyleSheet.create({
  whiteText: {
    color: '#FFFFFF'
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
  cardStyle: {
    borderWidth: 0,
    padding: 0
  },
  cardView: {
    alignItems: 'flex-start',
    paddingLeft: 5
  }
});

var AthletesView = function (_Component) {
  babelHelpers.inherits(AthletesView, _Component);

  function AthletesView(props) {
    babelHelpers.classCallCheck(this, AthletesView);

    var _this = babelHelpers.possibleConstructorReturn(this, (AthletesView.__proto__ || Object.getPrototypeOf(AthletesView)).call(this, props));

    _this.getTextColor = function (athlete) {
      if (athlete.training) {
        if (athlete.kitStatus === 'Inactive') {
          return _this.status.notReady;
        }
        return '#FFFFFF';
      }
      if (athlete.kitStatus === 'Inactive') {
        return _this.status.notReady;
      }
      return _theme.AppColors.brand.primary;
    };

    _this.getIndicatorColor = function (athlete) {
      if (athlete.training) {
        if (athlete.kitStatus === 'Active') {
          return _this.status.allGood;
        } else if (athlete.kitStatus === 'Error') {
          return _this.status.error;
        }
        return _this.status.notReady;
      }
      if (athlete.kitStatus === 'Active') {
        return _this.status.ready;
      }
      return null;
    };

    _this.getContainerColor = function (athlete) {
      if (athlete.training) {
        return _theme.AppColors.brand.primary;
      }
      return '#FFFFFF';
    };

    _this.status = {
      notReady: _theme.AppColors.brand.secondary,
      error: _theme.AppColors.red,
      ready: _theme.AppColors.brand.primary,
      allGood: '#00FF00'
    };

    _this.toggleGroupSession = function (group) {
      group.trainingActive = !group.trainingActive;
      var index = _this.state.trainingGroups.findIndex(function (trainingGroup) {
        return trainingGroup.id === group.id;
      });
      if (index > -1) {
        _this.state.trainingGroups[index] = group;
        _this.setState({ trainingGroups: _this.state.trainingGroups });
      }
    };

    _this.toggleAthleteSession = function (athlete) {};

    _this.addAthlete = function () {};

    _this.toggleCollapsed = function (section, index) {
      _this.state.trainingGroups[section].athletes[index].collapsed = !_this.state.trainingGroups[section].athletes[index].collapsed;
      _this.setState({ trainingGroups: _this.state.trainingGroups });
    };

    _this.renderModal = _react2.default.createElement(_reactNativeModalPicker2.default, {
      ref: 'modal',
      initValue: 'Pick a regimen to start',
      data: _this.props.regimens.map(function (regimen) {
        return {
          key: regimen.id,
          label: regimen.name
        };
      }),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 146
      }
    });

    _this.renderHeader = function (section, index, isActive) {
      var title = section.title;
      var numberOfAthletes = section.athletes.length;
      return _react2.default.createElement(
        _reactNative.View,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 161
          }
        },
        _react2.default.createElement(_ui.ListItem, { title: title, containerStyle: { backgroundColor: _theme.AppColors.lightGrey }, badge: { value: numberOfAthletes, badgeTextStyle: styles.badgeTextStyle }, __source: {
            fileName: _jsxFileName,
            lineNumber: 162
          }
        })
      );
    };

    _this.renderContent = function (section, sectionIndex, isActive) {
      return _react2.default.createElement(
        _reactNative.View,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 169
          }
        },
        _react2.default.createElement(_ui.Spacer, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 170
          }
        }),
        _react2.default.createElement(
          _reactNative.View,
          { style: { flexDirection: 'row', justifyContent: 'center', width: _theme.AppSizes.screen.width, height: 40 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 171
            }
          },
          _react2.default.createElement(
            _reactNative.View,
            { style: [_theme.AppStyles.flex1, _theme.AppStyles.containerCentered], __source: {
                fileName: _jsxFileName,
                lineNumber: 172
              }
            },
            section.title !== 'Team' ? _react2.default.createElement(_reactNativeElements.Icon, { name: 'account-plus', type: 'material-community', underlayColor: 'transparent', onPress: function onPress() {
                return _this.refs.addAthlete.open();
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 173
              }
            }) : null
          ),
          _react2.default.createElement(_ui.Button, {
            style: [_theme.AppStyles.flex2],
            raised: true,
            onPress: function onPress() {
              if (section.trainingActive) {
                _this.toggleGroupSession(section);
              } else {
                _this.setState({ sectionIndex: sectionIndex });_this.refs.startRegimen.open();
              }
            },
            title: (section.trainingActive ? 'Stop' : 'Start') + ' Group Session',
            backgroundColor: section.trainingActive ? styles.stop.color : styles.start.color,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 175
            }
          }),
          _react2.default.createElement(
            _reactNative.View,
            { style: [_theme.AppStyles.flex1, _theme.AppStyles.containerCentered], __source: {
                fileName: _jsxFileName,
                lineNumber: 182
              }
            },
            section.title !== 'Team' ? _react2.default.createElement(_reactNativeElements.Icon, { name: 'account-remove', type: 'material-community', underlayColor: 'transparent', onPress: function onPress() {
                _this.setState({ sectionIndex: sectionIndex });_this.refs.removeAthlete.open();
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 183
              }
            }) : null
          )
        ),
        _react2.default.createElement(
          _reactNative.View,
          { style: [styles.cardView], __source: {
              fileName: _jsxFileName,
              lineNumber: 186
            }
          },
          _react2.default.createElement(_ui.Spacer, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 187
            }
          }),
          _react2.default.createElement(
            _ui.Text,
            { style: { color: _theme.AppColors.brand.secondary, fontSize: 14 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 188
              }
            },
            'READY'
          ),
          section.athletes.reduce(function (array, athlete, athleteIndex) {
            if (athlete.training) {
              array.push(_react2.default.createElement(
                _reactNative.View,
                { key: athlete.id, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 193
                  }
                },
                _react2.default.createElement(
                  _reactNative.TouchableOpacity,
                  { onPress: function onPress() {
                      if (athlete.training || athlete.kitStatus === 'Active') {
                        _this.toggleCollapsed(sectionIndex, athleteIndex);
                      }
                    }, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 194
                    }
                  },
                  _react2.default.createElement(
                    _ui.Card,
                    { containerStyle: [styles.cardStyle, { backgroundColor: _theme.AppColors.lightGrey }], __source: {
                        fileName: _jsxFileName,
                        lineNumber: 195
                      }
                    },
                    _react2.default.createElement(
                      _reactNative.View,
                      { style: { borderRadius: 2, flexDirection: 'row', height: _theme.AppSizes.screen.heightTenth / 1.5 }, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 196
                        }
                      },
                      _react2.default.createElement(_reactNative.View, { style: { borderRadius: 2, backgroundColor: _this.getIndicatorColor(athlete), flex: 1 }, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 197
                        }
                      }),
                      _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 198
                        }
                      }),
                      _react2.default.createElement(
                        _reactNative.View,
                        { style: { flex: 14, justifyContent: 'center' }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 199
                          }
                        },
                        _react2.default.createElement(
                          _ui.Text,
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 200
                            }
                          },
                          athlete.name
                        )
                      ),
                      _react2.default.createElement(
                        _reactNative.View,
                        { style: { flex: 4, justifyContent: 'center' }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 202
                          }
                        },
                        _react2.default.createElement(
                          _ui.Text,
                          { style: { fontSize: 10 }, __source: {
                              fileName: _jsxFileName,
                              lineNumber: 203
                            }
                          },
                          'OFFLINE'
                        )
                      )
                    ),
                    _react2.default.createElement(
                      _reactNativeCollapsible2.default,
                      { collapsed: athlete.collapsed, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 206
                        }
                      },
                      _react2.default.createElement(_ui.Spacer, {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 207
                        }
                      }),
                      section.title === 'Team' ? _react2.default.createElement(_ui.Button, {
                        style: [_theme.AppStyles.containerCentered],
                        raised: true,
                        onPress: function onPress() {
                          if (section.trainingActive) {
                            _this.toggleAthleteSession();
                          }_this.refs.modal.open();
                        },
                        icon: { name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' },
                        title: (section.trainingActive ? 'Stop' : 'Start') + ' Athlete Session',
                        backgroundColor: section.trainingActive ? _theme.AppColors.brand.red : _theme.AppColors.brand.primary,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 211
                        }
                      }) : null,
                      _react2.default.createElement(_ui.Spacer, { size: 5, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 221
                        }
                      }),
                      _react2.default.createElement(
                        _ui.Text,
                        { style: { color: _this.getTextColor(athlete) }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 222
                          }
                        },
                        'Kit Memory:'
                      ),
                      _react2.default.createElement(_ui.Spacer, { size: 2, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 223
                        }
                      }),
                      _react2.default.createElement(_reactNativeProgressBarClassic2.default, { progress: 50, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 224
                        }
                      }),
                      _react2.default.createElement(_ui.Spacer, { size: 5, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 225
                        }
                      }),
                      _react2.default.createElement(
                        _ui.Text,
                        { style: { color: _this.getTextColor(athlete) }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 226
                          }
                        },
                        'Kit Battery:'
                      ),
                      _react2.default.createElement(_ui.Spacer, { size: 2, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 227
                        }
                      }),
                      _react2.default.createElement(_reactNativeProgressBarClassic2.default, { progress: 75, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 228
                        }
                      })
                    )
                  )
                )
              ));
            }

            return array;
          }, []),
          _react2.default.createElement(_ui.Spacer, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 239
            }
          }),
          _react2.default.createElement(
            _ui.Text,
            { style: { color: _theme.AppColors.brand.secondary, fontSize: 14 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 240
              }
            },
            'NOT READY'
          ),
          section.athletes.reduce(function (array, athlete, athleteIndex) {
            if (!athlete.training) {
              array.push(_react2.default.createElement(
                _reactNative.View,
                { key: athlete.id, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 245
                  }
                },
                _react2.default.createElement(
                  _reactNative.TouchableOpacity,
                  { onPress: function onPress() {
                      if (athlete.training || athlete.kitStatus === 'Active') {
                        _this.toggleCollapsed(sectionIndex, athleteIndex);
                      }
                    }, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 246
                    }
                  },
                  _react2.default.createElement(
                    _ui.Card,
                    { containerStyle: [styles.cardStyle, { backgroundColor: _theme.AppColors.lightGrey }], __source: {
                        fileName: _jsxFileName,
                        lineNumber: 247
                      }
                    },
                    _react2.default.createElement(
                      _reactNative.View,
                      { style: { borderRadius: 2, flexDirection: 'row', height: _theme.AppSizes.screen.heightTenth / 1.5 }, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 248
                        }
                      },
                      _react2.default.createElement(_reactNative.View, { style: { borderRadius: 2, backgroundColor: _this.getIndicatorColor(athlete), flex: 1 }, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 249
                        }
                      }),
                      _react2.default.createElement(_reactNative.View, { style: { flex: 1 }, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 250
                        }
                      }),
                      _react2.default.createElement(
                        _reactNative.View,
                        { style: { flex: 14, justifyContent: 'center' }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 251
                          }
                        },
                        _react2.default.createElement(
                          _ui.Text,
                          {
                            __source: {
                              fileName: _jsxFileName,
                              lineNumber: 252
                            }
                          },
                          athlete.name
                        )
                      ),
                      _react2.default.createElement(
                        _reactNative.View,
                        { style: { flex: 4, justifyContent: 'center' }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 254
                          }
                        },
                        _react2.default.createElement(
                          _ui.Text,
                          { style: { fontSize: 10 }, __source: {
                              fileName: _jsxFileName,
                              lineNumber: 255
                            }
                          },
                          'OFFLINE'
                        )
                      )
                    ),
                    _react2.default.createElement(
                      _reactNativeCollapsible2.default,
                      { collapsed: athlete.collapsed, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 258
                        }
                      },
                      _react2.default.createElement(_ui.Spacer, {
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 259
                        }
                      }),
                      section.title === 'Team' ? _react2.default.createElement(_ui.Button, {
                        style: [_theme.AppStyles.containerCentered],
                        raised: true,
                        onPress: function onPress() {
                          if (section.trainingActive) {
                            _this.toggleAthleteSession();
                          }_this.refs.modal.open();
                        },
                        icon: { name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' },
                        title: (section.trainingActive ? 'Stop' : 'Start') + ' Athlete Session',
                        backgroundColor: section.trainingActive ? _theme.AppColors.brand.red : _theme.AppColors.brand.primary,
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 263
                        }
                      }) : null,
                      _react2.default.createElement(_ui.Spacer, { size: 5, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 273
                        }
                      }),
                      _react2.default.createElement(
                        _ui.Text,
                        { style: { color: _this.getTextColor(athlete) }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 274
                          }
                        },
                        'Kit Memory:'
                      ),
                      _react2.default.createElement(_ui.Spacer, { size: 2, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 275
                        }
                      }),
                      _react2.default.createElement(_reactNativeProgressBarClassic2.default, { progress: 50, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 276
                        }
                      }),
                      _react2.default.createElement(_ui.Spacer, { size: 5, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 277
                        }
                      }),
                      _react2.default.createElement(
                        _ui.Text,
                        { style: { color: _this.getTextColor(athlete) }, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 278
                          }
                        },
                        'Kit Battery:'
                      ),
                      _react2.default.createElement(_ui.Spacer, { size: 2, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 279
                        }
                      }),
                      _react2.default.createElement(_reactNativeProgressBarClassic2.default, { progress: 75, __source: {
                          fileName: _jsxFileName,
                          lineNumber: 280
                        }
                      })
                    )
                  )
                )
              ));
            }

            return array;
          }, []),
          _react2.default.createElement(_ui.Spacer, { size: 15, __source: {
              fileName: _jsxFileName,
              lineNumber: 291
            }
          })
        )
      );
    };

    _this.render = function () {
      return _react2.default.createElement(
        _reactNative.View,
        { style: [_theme.AppStyles.container, { backgroundColor: 'white' }], __source: {
            fileName: _jsxFileName,
            lineNumber: 298
          }
        },
        _react2.default.createElement(
          _reactNative.ScrollView,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 299
            }
          },
          _react2.default.createElement(_Accordion2.default, {
            sections: _this.props.trainingGroups,
            renderHeader: _this.renderHeader,
            renderContent: _this.renderContent,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 300
            }
          }),
          _react2.default.createElement(_reactNativeModalPicker2.default, {
            ref: 'startRegimen',
            initValue: '',
            selectStyle: { borderWidth: 0 },
            selectTextStyle: { fontSize: 0 },
            data: [{ label: 'Select regimen to start', key: 0, section: true }].concat(_this.props.regimens.filter(function (regimen) {
              return regimen.trainingGroupIds.some(function (trainingGroupId) {
                return trainingGroupId === _this.state.trainingGroups[_this.state.sectionIndex].id;
              });
            }).map(function (regimen) {
              return {
                key: regimen.id,
                label: regimen.name
              };
            })),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 305
            }
          }),
          _react2.default.createElement(_reactNativeModalPicker2.default, {
            ref: 'addAthlete',
            initValue: '',
            selectStyle: { borderWidth: 0 },
            selectTextStyle: { fontSize: 0 },
            onChange: function onChange(athlete) {
              _this.props.addAthlete(athlete);
            },
            data: [{ label: 'Select player to add to group', key: 0, section: true }].concat(_this.state.trainingGroups[0].athletes.map(function (athlete) {
              return {
                key: athlete.id,
                label: athlete.name
              };
            })),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 316
            }
          }),
          _react2.default.createElement(_reactNativeModalPicker2.default, {
            ref: 'removeAthlete',
            initValue: '',
            selectStyle: { borderWidth: 0 },
            selectTextStyle: { fontSize: 0 },
            onChange: function onChange(athlete) {
              _this.props.removeAthlete(athlete);
            },
            data: [{ label: 'Select player to remove from group', key: 0, section: true }].concat(_this.state.trainingGroups[_this.state.sectionIndex].athletes.map(function (athlete) {
              return {
                key: athlete.id,
                label: athlete.name
              };
            })),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 327
            }
          })
        )
      );
    };

    _this.state = {
      trainingGroups: _this.props.trainingGroups,
      isModalVisible: _this.props.isModalVisible,
      sectionIndex: 0
    };
    return _this;
  }

  return AthletesView;
}(_react.Component);

AthletesView.componentName = 'AthletesView';
AthletesView.propTypes = {
  regimens: _react.PropTypes.array,
  trainingGroups: _react.PropTypes.array,
  isModalVisible: _react.PropTypes.bool,
  addAthlete: _react.PropTypes.func.isRequired,
  removeAthlete: _react.PropTypes.func.isRequired
};
AthletesView.defaultProps = {
  regimens: [],
  trainingGroups: [],
  isModalVisible: false
};
exports.default = AthletesView;