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

var GroupsView = function (_Component) {
    babelHelpers.inherits(GroupsView, _Component);

    function GroupsView(props) {
        babelHelpers.classCallCheck(this, GroupsView);

        var _this = babelHelpers.possibleConstructorReturn(this, (GroupsView.__proto__ || Object.getPrototypeOf(GroupsView)).call(this, props));

        _this.addGroup = function () {
            _this.state.trainingGroup.id = _this.state.trainingGroups.length + 1;
            _this.state.trainingGroup.trainingActive = false;
            _this.state.trainingGroup.athletes = [];
            _this.props.addGroup(_this.state.trainingGroup);
            _this.setState({ trainingGroups: _this.state.trainingGroups.concat([_this.state.trainingGroup]), trainingGroup: { title: '', description: '' } });
            _reactNativeRouterFlux.Actions.refresh({ isModalVisible: false });
        };

        _this.editGroup = function () {
            var index = _this.state.trainingGroups.findIndex(function (trainingGroup) {
                return trainingGroup.id === _this.state.trainingGroup.id;
            });
            if (index > -1) {
                _this.state.trainingGroups[index] = _this.state.trainingGroup;
                _this.props.editGroup(_this.state.trainingGroup);
                _this.setState({ trainingGroups: _this.state.trainingGroups, trainingGroup: { title: '', description: '' } });
            }
            _reactNativeRouterFlux.Actions.refresh({ isModalVisible: false });
        };

        _this.removeGroup = function (id) {
            _this.props.removeGroup(id);
            _this.setState({ trainingGroups: _this.state.trainingGroups.filter(function (group) {
                    return group.id !== id;
                }) });
        };

        _this.leftButton = function (data) {
            return _react2.default.createElement(
                _reactNative.View,
                { style: [{ alignItems: 'flex-end', paddingRight: 25 }, _theme.AppStyles.editButton] },
                _react2.default.createElement(_reactNativeElements.Icon, { name: 'pencil', onPress: function onPress() {
                        _this.setState({ trainingGroup: data });_reactNativeRouterFlux.Actions.refresh({ isModalVisible: true });
                    }, type: 'material-community', color: '#FFFFFF' })
            );
        };

        _this.rightButton = function (id) {
            return _react2.default.createElement(
                _reactNative.View,
                { style: [{ alignItems: 'flex-start', paddingLeft: 25 }, _theme.AppStyles.deleteButton] },
                _react2.default.createElement(_reactNativeElements.Icon, { name: 'delete', onPress: function onPress() {
                        _this.removeGroup(id);
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
                    _this.state.trainingGroups.map(function (group) {
                        return _react2.default.createElement(
                            _reactNativeSwipeable2.default,
                            { key: group.id, leftButtons: [_this.leftButton(group)], rightButtons: [_this.rightButton(group.id)] },
                            _react2.default.createElement(_ui.ListItem, { hideChevron: true, title: group.title, titleContainerStyle: [styles.listItemStyle] })
                        );
                    })
                ),
                _react2.default.createElement(
                    _reactNativeModalbox2.default,
                    { position: 'center', style: [_theme.AppStyles.containerCentered, _this.state.modalStyle, { backgroundColor: _theme.AppColors.transparent }], isOpen: _this.props.isModalVisible, backButtonClose: true, swipeToClose: false, onClosed: function onClosed() {
                            _this.setState({ trainingGroup: { title: '', description: '' } });_reactNativeRouterFlux.Actions.refresh({ isModalVisible: false });
                        } },
                    _react2.default.createElement(
                        _reactNative.View,
                        { onLayout: function onLayout(ev) {
                                _this.resizeModal(ev);
                            } },
                        _react2.default.createElement(
                            _ui.Card,
                            { title: (_this.state.trainingGroup.id ? 'Edit' : 'Add') + ' Training Group' },
                            _react2.default.createElement(
                                _ui.FormLabel,
                                { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }] },
                                'Name'
                            ),
                            _react2.default.createElement(_ui.FormInput, { containerStyle: { borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: _theme.AppColors.border }, inputContainer: { backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }, value: _this.state.trainingGroup.title, onChangeText: function onChangeText(title) {
                                    return _this.setState({ trainingGroup: _this.state.trainingGroup.title = title });
                                } }),
                            _react2.default.createElement(_ui.Spacer, { size: 10 }),
                            _react2.default.createElement(
                                _ui.FormLabel,
                                { labelStyle: [_theme.AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }] },
                                'Description'
                            ),
                            _react2.default.createElement(_ui.FormInput, { containerStyle: { borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: _theme.AppColors.border }, inputContainer: { backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }, value: _this.state.trainingGroup.description, onChangeText: function onChangeText(description) {
                                    return _this.setState({ trainingGroup: _this.state.trainingGroup.description = description });
                                } }),
                            _react2.default.createElement(_ui.Spacer, { size: 10 }),
                            _react2.default.createElement(_ui.Button, {
                                title: 'Save',
                                onPress: function onPress() {
                                    if (_this.state.trainingGroup.id) {
                                        _this.editGroup();
                                    } else {
                                        _this.addGroup();
                                    }
                                }
                            })
                        )
                    )
                )
            );
        };

        _this.state = {
            modalStyle: {},
            trainingGroup: { title: '', description: '' },
            trainingGroups: _this.props.trainingGroups
        };
        return _this;
    }

    babelHelpers.createClass(GroupsView, [{
        key: 'resizeModal',
        value: function resizeModal(ev) {
            this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
        }
    }]);
    return GroupsView;
}(_react.Component);

GroupsView.componentName = 'GroupsView';
GroupsView.propTypes = {
    trainingGroups: _react.PropTypes.array,
    isModalVisible: _react.PropTypes.bool,
    addGroup: _react.PropTypes.func.isRequired,
    editGroup: _react.PropTypes.func.isRequired,
    removeGroup: _react.PropTypes.func.isRequired
};
GroupsView.defaultProps = {
    trainingGroups: [],
    isModalVisible: false
};
exports.default = GroupsView;