Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactNativeElements = require('react-native-elements');

var _reactNativeSwipeable = require('react-native-swipeable');

var _reactNativeSwipeable2 = babelHelpers.interopRequireDefault(_reactNativeSwipeable);

var _reactNativeModalbox = require('react-native-modalbox');

var _reactNativeModalbox2 = babelHelpers.interopRequireDefault(_reactNativeModalbox);

var _theme = require('@theme/');

var _reactNativeRouterFlux = require('react-native-router-flux');

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
    },
    listItemStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    }
});

var RegimensView = function (_Component) {
    babelHelpers.inherits(RegimensView, _Component);

    function RegimensView(props) {
        babelHelpers.classCallCheck(this, RegimensView);

        var _this = babelHelpers.possibleConstructorReturn(this, (RegimensView.__proto__ || Object.getPrototypeOf(RegimensView)).call(this, props));

        _this.addRegimen = function () {
            _this.state.regimen.id = _this.state.regimens.length + 1;
            _this.props.addRegimen(_this.state.regimen);
            _this.setState({ regimens: _this.state.regimens.concat([_this.state.regimen]), regimen: { name: '', trainingGroupIds: [] } });
            _reactNativeRouterFlux.Actions.refresh({ isModalVisible: false });
        };

        _this.editRegimen = function () {
            var index = _this.state.regimens.findIndex(function (regimen) {
                return regimen.id === _this.state.regimen.id;
            });
            if (index > -1) {
                _this.state.regimens[index] = _this.state.regimen;
                _this.props.editRegimen(_this.state.regimen);
                _this.setState({ regimens: _this.state.regimens, regimen: { name: '', trainingGroupIds: [] } });
            }
            _reactNativeRouterFlux.Actions.refresh({ isModalVisible: false });
        };

        _this.removeRegimen = function (id) {
            _this.props.removeRegimen(id);
            _this.setState({ regimens: _this.state.regimens.filter(function (regimen) {
                    return regimen.id !== id;
                }) });
        };

        _this.toggleTrainingGroup = function (id) {
            var index = _this.state.regimen.trainingGroupIds.findIndex(function (groupId) {
                return groupId === id;
            });
            if (index > -1) {
                _this.state.regimen.trainingGroupIds.splice(index, 1);
            } else {
                _this.state.regimen.trainingGroupIds.push(id);
            }
            _this.setState({ regimen: _this.state.regimen });
        };

        _this.leftButton = function (data) {
            return _react2.default.createElement(
                _reactNative.View,
                { style: [{ alignItems: 'flex-end', paddingRight: 25 }, _theme.AppStyles.editButton] },
                _react2.default.createElement(_reactNativeElements.Icon, { name: 'pencil', onPress: function onPress() {
                        _this.setState({ regimen: data });_reactNativeRouterFlux.Actions.refresh({ isModalVisible: true });
                    }, type: 'material-community', color: '#FFFFFF' })
            );
        };

        _this.rightButton = function (id) {
            return _react2.default.createElement(
                _reactNative.View,
                { style: [{ alignItems: 'flex-start', paddingLeft: 25 }, _theme.AppStyles.deleteButton] },
                _react2.default.createElement(_reactNativeElements.Icon, { name: 'delete', onPress: function onPress() {
                        _this.removeRegimen(id);
                    }, type: 'material-community', color: '#FFFFFF' })
            );
        };

        _this.render = function () {
            return _react2.default.createElement(
                _reactNative.View,
                { style: [_theme.AppStyles.container] },
                _react2.default.createElement(
                    _reactNative.ScrollView,
                    null,
                    _this.state.regimens.map(function (regimen) {
                        return _react2.default.createElement(
                            _reactNativeSwipeable2.default,
                            { key: regimen.id, leftButtons: [_this.leftButton(regimen)], rightButtons: [_this.rightButton(regimen.id)] },
                            _react2.default.createElement(_ui.ListItem, { hideChevron: true, title: regimen.name, titleContainerStyle: [styles.listItemStyle] })
                        );
                    })
                ),
                _react2.default.createElement(
                    _reactNativeModalbox2.default,
                    { style: [_theme.AppStyles.containerCentered, _this.state.modalStyle, { backgroundColor: _theme.AppColors.transparent }], isOpen: _this.props.isModalVisible, backButtonClose: true, swipeToClose: false, onClosed: function onClosed() {
                            _this.setState({ regimen: { name: '', trainingGroupIds: [] } });_reactNativeRouterFlux.Actions.refresh({ isModalVisible: false });
                        } },
                    _react2.default.createElement(
                        _reactNative.View,
                        { onLayout: function onLayout(ev) {
                                _this.resizeModal(ev);
                            } },
                        _react2.default.createElement(
                            _reactNative.ScrollView,
                            null,
                            _react2.default.createElement(
                                _ui.Card,
                                { title: (_this.state.regimen.id ? 'Edit' : 'Add') + ' Regimen' },
                                _react2.default.createElement(
                                    _ui.FormLabel,
                                    { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }] },
                                    'Name'
                                ),
                                _react2.default.createElement(_ui.FormInput, { containerStyle: { borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: _theme.AppColors.border }, inputContainer: { backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }, value: _this.state.regimen.name, onChangeText: function onChangeText(name) {
                                        return _this.setState({ regimen: { name: name, trainingGroupIds: _this.state.regimen.trainingGroupIds } });
                                    } }),
                                _react2.default.createElement(_ui.Spacer, { size: 10 }),
                                _react2.default.createElement(
                                    _ui.FormLabel,
                                    { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }] },
                                    'Training Groups'
                                ),
                                _this.state.trainingGroups.map(function (group) {
                                    return _react2.default.createElement(_reactNativeElements.CheckBox, { title: group.title, onPress: function onPress() {
                                            _this.toggleTrainingGroup(group.id);
                                        }, checked: _this.state.regimen.trainingGroupIds ? _this.state.regimen.trainingGroupIds.some(function (id) {
                                            return id === group.id;
                                        }) : false });
                                }),
                                _react2.default.createElement(_ui.Spacer, { size: 10 }),
                                _react2.default.createElement(_ui.Button, {
                                    title: 'Save',
                                    onPress: function onPress() {
                                        if (_this.state.regimen.id) {
                                            _this.editRegimen();
                                        } else {
                                            _this.addRegimen();
                                        }
                                    }
                                })
                            )
                        )
                    )
                )
            );
        };

        _this.state = {
            modalStyle: {},
            regimen: { name: '', trainingGroupIds: [] },
            regimens: _this.props.regimens,
            trainingGroups: _this.props.trainingGroups
        };
        return _this;
    }

    babelHelpers.createClass(RegimensView, [{
        key: 'resizeModal',
        value: function resizeModal(ev) {
            this.setState({ modalStyle: { height: _theme.AppStyles.windowSize.height - 80 > ev.nativeEvent.layout.height ? ev.nativeEvent.layout.height : _theme.AppStyles.windowSize.height - 80, width: ev.nativeEvent.layout.width } });
        }
    }]);
    return RegimensView;
}(_react.Component);

RegimensView.componentName = 'RegimensView';
RegimensView.propTypes = {
    regimens: _react.PropTypes.array,
    trainingGroups: _react.PropTypes.array,
    isModalVisible: _react.PropTypes.bool,
    addRegimen: _react.PropTypes.func.isRequired,
    editRegimen: _react.PropTypes.func.isRequired,
    removeRegimen: _react.PropTypes.func.isRequired
};
RegimensView.defaultProps = {
    regimens: [],
    trainingGroups: [],
    isModalVisible: false
};
exports.default = RegimensView;