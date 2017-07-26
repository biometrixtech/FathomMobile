/**
 * Capture Session Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { Platform } from 'react-native';
import { Icon, Tab, Tabs, CheckBox } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';
import ModalDropdown from 'react-native-modal-dropdown';
import Modal from 'react-native-modalbox';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppSizes, AppStyles, AppColors, AppFonts } from '@theme/';

// Components
import { Button, ListItem, Spacer, Text, Card, FormLabel, FormInput } from '@ui/';
import { Placeholder } from '@general/';
import { Roles, BLEConfig } from '@constants/';

const bleStates = {
    CAPTURING: [ BLEConfig.state.APP_PRACTICE ],
    READY:     [ BLEConfig.state.APP_READY ],
    NOT_READY: [ BLEConfig.state.APP_PRACTICE, BLEConfig.state.APP_READY ] // anything but these
}

const font20 = AppFonts.scaleFont(20);

/* Component ==================================================================== */
class GroupCaptureSessionView extends Component {
    static componentName = 'GroupCaptureSessionView';

    static propTypes = {
        user:               PropTypes.object,
        isModalVisible:     PropTypes.bool,
        patchTrainingGroup: PropTypes.func.isRequired,
        removeUser:         PropTypes.func.isRequired,
        startSession:       PropTypes.func.isRequired,
        stopSession:        PropTypes.func.isRequired
    }

    static defaultProps = {
        user:           {},
        isModalVisible: false
    }

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0,
            height:        0,
            active:        false,
            trainingGroup: props.user.selectedTrainingGroup,
            modalStyle:    {}
        };
    }

    startSession = (userIds) => {
        return Promise.all(this.props.user.accessories.filter(accessory => userIds.some(userId => userId === accessory.last_user_id)).map(accessory => this.props.startSession(accessory.id)));
    };

    stopSession = (userIds) => {
        return Promise.all(this.props.user.accessories.filter(accessory => userIds.some(userId => userId === accessory.last_user_id)).map(accessory => this.props.stopSession(accessory.id)));
    };

    leftButton = (id) => (
        <View style={[{ alignItems: 'flex-end', paddingRight: 25 }, AppStyles.deleteButton]}>
            <Icon name="delete" onPress={() => this.props.removeUser(this.props.user.selectedTrainingGroup.id, id)} type="material-community" color="#FFFFFF" />
        </View>
    );

    rightButtons = (id) => {
        let buttons = [];
        let accessory = this.props.user.accessories.find(access => access.last_user_id === id);
        if (accessory && accessory.memory_level && accessory.memory_level > 0.85) {
            buttons.push(
                <View style={[{ alignItems: 'flex-start', paddingLeft: 8, borderColor: '#FFFFFF', borderWidth: 1 }, AppStyles.deleteButton]}>
                    <Icon name={'sim-alert'} type={'material-community'} color={'#FFFFFF'} />
                </View>
            );
        }
        if (accessory && accessory.battery_level && accessory.battery_level < 0.15) {
            buttons.push(
                <View style={[{ alignItems: 'flex-start', paddingLeft: 7, borderColor: '#FFFFFF', borderWidth: 1 }, AppStyles.deleteButton]}>
                    <Icon name={'battery-alert'} type={'material-community'} color={'#FFFFFF'} />
                </View>
            );
        }
        buttons.push(
            <View style={[{ alignItems: 'flex-start', paddingLeft: 12, borderColor: '#FFFFFF', borderWidth: 1 }, AppStyles.editButton]}>
                <Icon name={this.state.active ? 'stop' : 'play'} type={'font-awesome'} color={'#FFFFFF'} onPress={() => (this.state.active ? this.stopSession([id]) : this.startSession([id])).then(() => this.setState({ active: !this.state.active }))} />
            </View>
        );
        return buttons;
    };

    resizeModal = (ev) => {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    adminView = () => (
        <Placeholder />
    );

    athleteView = () => (
        <Placeholder />
    );

    biometrixAdminView = () => (
        <View style={[AppStyles.container]}>
            <View>
                <ListItem onLayout={(ev) => this.setState({ height: ev.nativeEvent.layout.height })} 
                    containerStyle={{ borderBottomWidth: 0 }}
                    titleContainerStyle={{ alignSelf: 'center', marginLeft: this.state.active ? 52 : 0 }}
                    title={this.props.user.teams[this.props.user.teamIndex].name}
                    subtitleContainerStyle={{ alignSelf: 'center', marginLeft: this.state.active ? 51 : 0 }}
                    subtitle={this.props.user.selectedTrainingGroup.name}
                    fontFamily={AppStyles.baseText.fontFamily}
                    leftIcon={{ name: this.state.active ? null : 'chevron-left', color: AppColors.brand.blue, type: 'material-community' }}
                    leftIconOnPress={() => Actions.pop()}
                    rightIcon={{ name: 'pencil-circle', color: AppColors.brand.yellow, type: 'material-community'}}
                    onPressRightIcon={() => Actions.refresh({ isModalVisible: true })}
                />
                <Spacer size={this.state.height}/>
                <Tabs sceneStyle={{ backgroundColor: AppColors.brand.light, height: AppSizes.screen.height - AppSizes.navbarHeight - (2*this.state.height) + (Platform.OS === 'ios' ? 35 : 15) }}
                    tabBarStyle={{ backgroundColor: '#FFFFFF', borderBottomWidth: 2, borderColor: AppColors.shadowColor }}
                    tabBarShadowStyle={{ height: 0 }}
                >
                    <Tab titleStyle={{ paddingBottom: 10, marginTop: 10, ...AppStyles.baseText, color: AppColors.lightGrey  }}
                        selectedTitleStyle={{ borderBottomWidth: 2, borderColor: AppColors.brand.yellow, color: AppColors.brand.blue }}
                        title={'CAPTURING'}
                        renderBadge={() => (
                            <Text style={{ color: this.state.selectedIndex === 0 ? AppColors.brand.blue : AppColors.lightGrey}}>
                                {this.props.user.selectedTrainingGroup.users.filter(user => this.props.user.accessories.some(accessory => accessory.last_user_id === user.id && bleStates.CAPTURING.some(state => state === accessory.state))).length}
                            </Text>
                        )}
                        allowFontScaling
                        selected={this.state.selectedIndex === 0}
                        onPress={() => this.setState({ selectedIndex: 0 })}
                    >
                        <View style={{ flex: 1, paddingTop: 2 }}>
                            <ScrollView>
                                {
                                    this.props.user.selectedTrainingGroup.users.filter(user => this.props.user.accessories.some(accessory => accessory.last_user_id === user.id && bleStates.CAPTURING.some(state => state === accessory.state))).map(user => (
                                        <Swipeable key={user.id} leftButtons={[this.leftButton(user.id)]} rightButtons={this.rightButtons(user.id)} rightButtonWidth={40} style={{padding: 2}}>
                                            <ListItem avatar={{uri: user.avatar_url }} title={`${user.first_name} ${user.last_name}`} hideChevron/>
                                        </Swipeable>
                                    ))
                                }
                            </ScrollView>
                            <Button
                                containerViewStyle={{ bottom: 0 , height: 30, width: AppSizes.screen.width, alignSelf: 'center', paddingTop: 2 }}
                                buttonStyle={{ borderRadius: 0 }}
                                backgroundColor={AppColors.brand.yellow}
                                onPress={() => {
                                    let ids = this.props.user.selectedTrainingGroup.users.map(user => user.id);
                                    return (this.state.action ? this.stopSession(ids) : this.startSession(ids)).then(() => this.setState({ active: !this.state.active }));
                                }}
                                color={'#FFFFFF'}
                                raised={false}
                                title={`${this.state.active ? 'STOP' : 'START'} GROUP SESSION`}
                                icon={{ name: this.state.active ? 'stop' : 'play', type: 'font-awesome', color: '#FFFFFF' }}
                            />
                        </View>
                    </Tab>
                    <Tab titleStyle={{ paddingBottom: 10, marginTop: 10, ...AppStyles.baseText, color: AppColors.lightGrey  }}
                        selectedTitleStyle={{ borderBottomWidth: 2, borderColor: AppColors.brand.yellow, color: AppColors.brand.blue }}
                        title={'READY'}
                        renderBadge={() => (
                            <Text style={{ color: this.state.selectedIndex === 1 ? AppColors.brand.blue : AppColors.lightGrey}}>
                                {this.props.user.selectedTrainingGroup.users.filter(user => this.props.user.accessories.some(accessory => accessory.last_user_id === user.id && bleStates.READY.some(state => state === accessory.state))).length}
                            </Text>
                        )}
                        allowFontScaling
                        selected={this.state.selectedIndex === 1}
                        onPress={() => this.setState({ selectedIndex: 1 })}
                    >
                        <View style={{ flex: 1, paddingTop: 2 }}>
                            <ScrollView>
                                {
                                    this.props.user.selectedTrainingGroup.users.filter(user => this.props.user.accessories.some(accessory => accessory.last_user_id === user.id && bleStates.READY.some(state => state === accessory.state))).map(user => (
                                        <Swipeable key={user.id} leftButtons={[this.leftButton(user.id)]} rightButtons={this.rightButtons(user.id)} rightButtonWidth={40} style={{padding: 2}}>
                                            <ListItem avatar={{uri: user.avatar_url }} title={`${user.first_name} ${user.last_name}`} hideChevron/>
                                        </Swipeable>
                                    ))
                                }
                            </ScrollView>
                            <Button
                                containerViewStyle={{ bottom: 0 , height: 30, width: AppSizes.screen.width, alignSelf: 'center', paddingTop: 2 }}
                                buttonStyle={{ borderRadius: 0 }}
                                backgroundColor={AppColors.brand.yellow}
                                onPress={() => {
                                    let ids = this.props.user.selectedTrainingGroup.users.map(user => user.id);
                                    return (this.state.action ? this.stopSession(ids) : this.startSession(ids)).then(() => this.setState({ active: !this.state.active }));
                                }}
                                color={'#FFFFFF'}
                                raised={false}
                                title={`${this.state.active ? 'STOP' : 'START'} GROUP SESSION`}
                                icon={{ name: this.state.active ? 'stop' : 'play', type: 'font-awesome', color: '#FFFFFF' }}
                            />
                        </View>
                    </Tab>
                    <Tab titleStyle={{ paddingBottom: 10, marginTop: 10, ...AppStyles.baseText, color: AppColors.lightGrey  }}
                        selectedTitleStyle={{ borderBottomWidth: 2, borderColor: AppColors.brand.yellow, color: AppColors.brand.blue }}
                        title={'NOT READY'}
                        renderBadge={() => (
                            <Text style={{ color: this.state.selectedIndex === 2 ? AppColors.brand.blue : AppColors.lightGrey}}>
                                {this.props.user.selectedTrainingGroup.users.filter(user => this.props.user.accessories.some(accessory => accessory.last_user_id === user.id && bleStates.NOT_READY.every(state => state !== accessory.state))).length}
                            </Text>
                        )}
                        allowFontScaling
                        selected={this.state.selectedIndex === 2}
                        onPress={() => this.setState({ selectedIndex: 2 })}
                    >
                        <View style={{ flex: 1, paddingTop: 2 }}>
                            <ScrollView>
                                {
                                    this.props.user.selectedTrainingGroup.users.filter(user => this.props.user.accessories.some(accessory => accessory.last_user_id === user.id && bleStates.NOT_READY.every(state => state !== accessory.state))).map(user => (
                                        <Swipeable key={user.id} leftButtons={[this.leftButton(user.id)]} rightButtons={this.rightButtons(user.id)} rightButtonWidth={40} style={{padding: 2}}>
                                            <ListItem avatar={{uri: user.avatar_url }} title={`${user.first_name} ${user.last_name}`} hideChevron/>
                                        </Swipeable>
                                    ))
                                }
                            </ScrollView>
                            <Button
                                containerViewStyle={{ bottom: 0 , height: 30, width: AppSizes.screen.width, alignSelf: 'center', paddingTop: 2 }}
                                buttonStyle={{ borderRadius: 0 }}
                                backgroundColor={AppColors.brand.yellow}
                                onPress={() => {
                                    let ids = this.props.user.selectedTrainingGroup.users.map(user => user.id);
                                    return (this.state.action ? this.stopSession(ids) : this.startSession(ids)).then(() => this.setState({ active: !this.state.active }));
                                }}
                                color={'#FFFFFF'}
                                raised={false}
                                title={`${this.state.active ? 'STOP' : 'START'} GROUP SESSION`}
                                icon={{ name: this.state.active ? 'stop' : 'play', type: 'font-awesome', color: '#FFFFFF' }}
                            />
                        </View>
                    </Tab>
                </Tabs>
            </View>
            <Modal position={'center'}
                style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                isOpen={this.props.isModalVisible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => Actions.refresh({ isModalVisible: false })}
                onOpened={() => this.setState({ trainingGroup: this.props.user.selectedTrainingGroup })}
            >
                <View onLayout={(ev) => { this.resizeModal(ev); }}>
                    <Card title={'Edit Training Group'}>

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]}>Name</FormLabel>
                        <FormInput containerStyle={{ borderWidth: 1, borderColor: AppColors.border }}
                            inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }}
                            value={this.state.trainingGroup.name}
                            onChangeText={name => this.setState({
                                trainingGroup: {
                                    ...this.state.trainingGroup,
                                    name
                                }})}
                        />

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]}>Athetes</FormLabel>
                        <Spacer size={5} />
                        <ScrollView style={{ borderWidth: 1, borderColor: AppColors.border, height: AppSizes.screen.heightOneThird }}>
                            {
                                this.props.user.teams[this.props.user.teamIndex].users_with_training_groups.map(user => {
                                    return (
                                        <CheckBox
                                            key={user.id}
                                            title={`${user.first_name} ${user.last_name}`}
                                            checked={this.state.trainingGroup.user_ids[user.id]}
                                            onPress={() => {
                                                this.state.trainingGroup.user_ids[user.id] = !this.state.trainingGroup.user_ids[user.id];
                                                return this.setState({
                                                    trainingGroup: {
                                                        ...this.state.trainingGroup
                                                    }
                                                });
                                            }}
                                        />
                                    );
                                })
                            }
                        </ScrollView>

                        <Spacer />

                        <Button
                            title={'Save'}
                            onPress={() => this.props.patchTrainingGroup(this.state.trainingGroup).then(() => Actions.refresh({ isModalVisible: false }))}
                        />
                    </Card>
                </View>
            </Modal>
        </View>
    );

    managerView = () => (
        <Placeholder />
    );

    researcherView = () => (
        <Placeholder />
    );

    render = () => {
        switch(this.props.user.role) {
        case Roles.admin:
            return this.adminView();
        case Roles.athlete:
            return this.athleteView();
        case Roles.biometrixAdmin:
            return this.biometrixAdminView();
        case Roles.superAdmin:
            return this.biometrixAdminView();
        case Roles.manager:
            return this.biometrixAdminView();
        case Roles.researcher:
            return this.researcherView();
        default:
            return <Placeholder />;
        }
    }
}

/* Export Component ==================================================================== */
export default GroupCaptureSessionView;
