Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactNativeElements = require('react-native-elements');

var _Accordion = require('react-native-collapsible/Accordion');

var _Accordion2 = babelHelpers.interopRequireDefault(_Accordion);

var _reactNativeCollapsible = require('react-native-collapsible');

var _reactNativeCollapsible2 = babelHelpers.interopRequireDefault(_reactNativeCollapsible);

var _reactNativeIndicator = require('react-native-indicator');

var _reactNativeProgressBarClassic = require('react-native-progress-bar-classic');

var _reactNativeProgressBarClassic2 = babelHelpers.interopRequireDefault(_reactNativeProgressBarClassic);

var _reactNativeModalPicker = require('react-native-modal-picker');

var _reactNativeModalPicker2 = babelHelpers.interopRequireDefault(_reactNativeModalPicker);

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

var AthletesView = function (_Component) {
  babelHelpers.inherits(AthletesView, _Component);

  function AthletesView(props) {
    babelHelpers.classCallCheck(this, AthletesView);

    var _this = babelHelpers.possibleConstructorReturn(this, (AthletesView.__proto__ || Object.getPrototypeOf(AthletesView)).call(this, props));

    _this.status = {
      ready: '#00FF00',
      error: '#FF0000',
      notReady: '#0000FF'
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
      })
    });

    _this.renderHeader = function (section, index, isActive) {
      var title = section.title;
      var numberOfAthletes = section.athletes.length;
      return _react2.default.createElement(
        _reactNative.View,
        null,
        _react2.default.createElement(_ui.ListItem, { title: title, badge: { value: numberOfAthletes, badgeTextStyle: styles.badgeTextStyle } })
      );
    };

    _this.renderContent = function (section, sectionIndex, isActive) {
      return _react2.default.createElement(
        _reactNative.View,
        null,
        _react2.default.createElement(
          _reactNative.View,
          { style: { flexDirection: 'row', justifyContent: 'center', width: _theme.AppSizes.screen.width, height: 40 } },
          _react2.default.createElement(
            _reactNative.View,
            { style: [_theme.AppStyles.flex1, _theme.AppStyles.containerCentered] },
            section.title !== 'Team' ? _react2.default.createElement(_reactNativeElements.Icon, { name: 'account-plus', type: 'material-community', underlayColor: 'transparent', onPress: function onPress() {
                return _this.refs.addAthlete.open();
              } }) : null
          ),
          _react2.default.createElement(_ui.Button, { style: [_theme.AppStyles.flex2], raised: true, onPress: function onPress() {
              if (section.trainingActive) {
                _this.toggleGroupSession(section);
              } else {
                _this.setState({ sectionIndex: sectionIndex });_this.refs.startRegimen.open();
              }
            }, icon: { name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' }, title: (section.trainingActive ? 'Stop' : 'Start') + ' Group Session', backgroundColor: section.trainingActive ? _theme.AppColors.brand.red : _theme.AppColors.brand.primary }),
          _react2.default.createElement(
            _reactNative.View,
            { style: [_theme.AppStyles.flex1, _theme.AppStyles.containerCentered] },
            section.title !== 'Team' ? _react2.default.createElement(_reactNativeElements.Icon, { name: 'account-remove', type: 'material-community', underlayColor: 'transparent', onPress: function onPress() {
                _this.setState({ sectionIndex: sectionIndex });_this.refs.removeAthlete.open();
              } }) : null
          )
        ),
        _react2.default.createElement(
          _reactNative.View,
          { style: [styles.cardView] },
          section.athletes.map(function (athlete, athleteIndex) {
            return _react2.default.createElement(
              _reactNative.View,
              { key: athlete.id },
              _react2.default.createElement(
                _ui.Card,
                { title: athlete.name },
                section.title === 'Team' ? _react2.default.createElement(
                  _reactNative.View,
                  null,
                  _react2.default.createElement(_ui.Button, { style: [_theme.AppStyles.containerCentered], raised: true, onPress: function onPress() {
                      if (section.trainingActive) {
                        _this.toggleAthleteSession();
                      }_this.refs.modal.open();
                    }, icon: { name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' }, title: (section.trainingActive ? 'Stop' : 'Start') + ' Athlete Session', backgroundColor: section.trainingActive ? _theme.AppColors.brand.red : _theme.AppColors.brand.primary }),
                  _react2.default.createElement(_ui.Spacer, { size: 5 })
                ) : null,
                _react2.default.createElement(
                  _reactNative.TouchableOpacity,
                  { onPress: function onPress() {
                      _this.toggleCollapsed(sectionIndex, athleteIndex);
                    } },
                  _react2.default.createElement(
                    _reactNative.View,
                    { style: [{ flexDirection: 'row', width: _theme.AppSizes.screen.width }, _theme.AppStyles.containerCentered] },
                    _react2.default.createElement(
                      _ui.Text,
                      null,
                      'Kit Status:'
                    ),
                    _react2.default.createElement(_reactNativeIndicator.DoubleCircleLoader, { color: _this.status.ready })
                  )
                ),
                _react2.default.createElement(_ui.Spacer, { size: 5 }),
                _react2.default.createElement(
                  _reactNativeCollapsible2.default,
                  { collapsed: athlete.collapsed },
                  _react2.default.createElement(
                    _ui.Text,
                    null,
                    'Kit Memory:'
                  ),
                  _react2.default.createElement(_ui.Spacer, { size: 2 }),
                  _react2.default.createElement(_reactNativeProgressBarClassic2.default, { progress: 50, label: '1028/2048' }),
                  _react2.default.createElement(_ui.Spacer, { size: 5 }),
                  _react2.default.createElement(
                    _ui.Text,
                    null,
                    'Kit Battery:'
                  ),
                  _react2.default.createElement(_ui.Spacer, { size: 2 }),
                  _react2.default.createElement(_reactNativeProgressBarClassic2.default, { progress: 75 })
                )
              ),
              _react2.default.createElement(_ui.Spacer, { size: 10 })
            );
          })
        )
      );
    };

    _this.render = function () {
      return _react2.default.createElement(
        _reactNative.View,
        { style: [_theme.AppStyles.container] },
        _react2.default.createElement(
          _reactNative.ScrollView,
          null,
          _react2.default.createElement(_Accordion2.default, {
            sections: _this.props.trainingGroups,
            renderHeader: _this.renderHeader,
            renderContent: _this.renderContent
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
            }))
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
            }))
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
            }))
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