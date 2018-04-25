/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:35:00 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-24 23:04:39
 */

/**
 * Kit Management Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    ScrollView,
    BackHandler,
    NativeEventEmitter,
    KeyboardAvoidingView,
    NativeModules,
    ActivityIndicator,
    Platform
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Collapsible from 'react-native-collapsible';
import ModalDropdown from 'react-native-modal-dropdown';
import Modal from 'react-native-modalbox';
import Toast, {DURATION} from 'react-native-easy-toast';
import Egg from 'react-native-egg';

// Consts and Libs
import { AppStyles, AppSizes, AppFonts } from '../../theme/';
import { Roles, BLEConfig, AppColors } from '../../../constants/';

// Components
import { Spacer, Text, ListItem, Card, Button, FormInput, FormLabel } from '../custom/';
import { Placeholder } from '../general/';

const font18 = AppFonts.scaleFont(18);
const font14 = AppFonts.scaleFont(14);
const font10 = AppFonts.scaleFont(10);

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Wrapper = props => Platform.OS === 'ios' ?
    (
        <KeyboardAvoidingView behavior={'padding'}>
            {props.children}
        </KeyboardAvoidingView>
    ) :
    (
        <View>
            {props.children}
        </View>
    );

/* Component ==================================================================== */
class KitManagementView extends Component {
    static componentName = 'KitManagementView';

    static propTypes = {
        user:                 PropTypes.shape({}),
        bluetooth:            PropTypes.shape({}),
        scanWiFi:             PropTypes.func.isRequired,
        setWiFiSSID:          PropTypes.func.isRequired,
        setWiFiPassword:      PropTypes.func.isRequired,
        connectWiFi:          PropTypes.func.isRequired,
        readSSID:             PropTypes.func.isRequired,
        handleDisconnect:     PropTypes.func.isRequired,
        connectToAccessory:   PropTypes.func.isRequired,
        startConnect:         PropTypes.func.isRequired,
        stopConnect:          PropTypes.func.isRequired,
        disconnect:           PropTypes.func.isRequired,
        setIdentity:          PropTypes.func.isRequired,
        setAnonymousIdentity: PropTypes.func.isRequired,
        setEAPType:           PropTypes.func.isRequired,
        setGyroCalibration:   PropTypes.func.isRequired,
        resetAccessory:       PropTypes.func.isRequired,
    }

    static defaultProps = {
        user:      {},
        bluetooth: {},
    }

    constructor(props) {
        super(props);

        this.state = {
            modalStyle:          {},
            resetModalStyle:     {},
            other:               false,
            SSID:                null,
            newNetwork:          true,
            isCollapsed:         true,
            password:            '',
            identity:            '',
            anonymousIdentity:   '',
            eapType:             '',
            isResetModalVisible: false,
        };

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    }

    readSSID = (id, loopsLeft) => {
        return this.props.readSSID(id)
            .then(() => loopsLeft-1 >= 0 ? this.readSSID(id, loopsLeft-1) : null);
    };

    componentDidMount = () => {
        BackHandler.addEventListener('backPress', () => Actions.pop());

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this._disconnectInterval = setInterval(() => {
            return this.props.bluetooth.accessoryData.id ? this.props.handleDisconnect(this.props.bluetooth.accessoryData.id) : null;
        }, 10000);
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('backPress');

        this.handlerDiscover.remove();
        clearInterval(this._disconnectInterval);
        clearInterval(this._configurationInterval);
    }

    handleDiscoverPeripheral = (data) => {
        return data.id === this.props.bluetooth.accessoryData.id ? this.props.connectToAccessory(data)
            .catch(err => console.log(err))
            .then(() => this.props.stopConnect()) : null;
    }

    resizeResetModal = (ev) => {
        this.setState({ resetModalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    resizeModal1 = (ev) => {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    adminView = () => (
        <Placeholder />
    );

    athleteView = () => (
        <Placeholder />
    );

    biometrixAdminView = () => (
        <View style={[AppStyles.container, { backgroundColor: AppColors.secondary.light_blue.seventyPercent }]} >
            <Toast 
                ref={'toast'}
                position={'top'}
            />
            <Text style={{ padding: 10, paddingLeft: 20, fontSize: font18 }}>SETTINGS</Text>
            <ListItem
                title={`${this.props.bluetooth.accessoryData.id ? 'Disconnect' : 'Connect Kit'}`}
                rightTitle={this.props.bluetooth.accessoryData.name ? this.props.bluetooth.accessoryData.name : null}
                rightTitleStyle={{ color: this.props.bluetooth.accessoryData.id ? AppColors.secondary.blue.hundredPercent : AppColors.primary.grey.thirtyPercent}}
                onPress={() => {
                    if (this.props.bluetooth.accessoryData.id) {
                        return this.props.startConnect()
                            .then(() => this.props.disconnect(this.props.bluetooth.accessoryData.id))
                            .catch(err => this.props.disconnect(this.props.bluetooth.accessoryData.id))
                            .then(() => this.props.stopConnect());
                    }
                    return Actions.bluetoothConnect();
                }}
            />
            <Text style={{ paddingLeft: 20, fontSize: font10 }}>{`${this.props.bluetooth.accessoryData.id ? 'Disconnect from' : 'Connect to'} your Fathom Kit`}</Text>
            <Spacer />
            <Text style={{ padding: 10, paddingLeft: 20, fontSize: font18 }}>MANAGE KIT</Text>
            {
                this.props.bluetooth.accessoryData.id ?
                    <ListItem
                        title={'Owner'}
                        chevronColor={ AppColors.secondary.blue.hundredPercent }
                        titleStyle={{ color: AppColors.secondary.blue.hundredPercent }}
                        onPress={() => Actions.kitOwner()}
                    />
                    :
                    <ListItem
                        title={'Owner'}
                        chevronColor={ AppColors.primary.grey.thirtyPercent }
                        titleStyle={{ color: AppColors.primary.grey.thirtyPercent }}
                    />
            }
            {
                !this.props.bluetooth.accessoryData.id ?
                    <ListItem
                        title={'WiFi'}
                        chevronColor={ AppColors.primary.grey.thirtyPercent }
                        titleStyle={{ color: AppColors.primary.grey.thirtyPercent }}
                    />
                    :
                    <ListItem
                        title={'WiFi'}
                        chevronColor={ AppColors.secondary.blue.hundredPercent }
                        titleStyle={{ color: AppColors.secondary.blue.hundredPercent }}
                        onPress={() => {
                            this.setState({ isModal1Visible: true });
                            return this.props.scanWiFi(this.props.bluetooth.accessoryData.id)
                                .then(() => this.readSSID(this.props.bluetooth.accessoryData.id, 30));
                        }}
                    />
            }
            {
                !this.props.bluetooth.accessoryData.id ?
                    <ListItem
                        title={'Factory Reset'}
                        chevronColor={ AppColors.primary.grey.thirtyPercent }
                        titleStyle={{ color: AppColors.primary.grey.thirtyPercent }}
                    />
                    :
                    <ListItem
                        title={'Factory Reset'}
                        chevronColor={ AppColors.secondary.blue.hundredPercent }
                        titleStyle={{ color: AppColors.secondary.blue.hundredPercent }}
                        onPress={() => this.setState({ isResetModalVisible: true })}
                    />
            }
            <Text style={{ paddingLeft: AppSizes.padding, fontSize: !this.props.bluetooth.accessoryData.id ? font14 : font10, fontWeight: !this.props.bluetooth.accessoryData.id ? 'bold' : 'normal' }}>Step 1: Connect to kit</Text>
            <Text style={{ paddingLeft: AppSizes.padding, fontSize: this.props.bluetooth.accessoryData.id && !this.props.bluetooth.accessoryData.ownerFlag ? font14 : font10, fontWeight: this.props.bluetooth.accessoryData.id && !this.props.bluetooth.accessoryData.ownerFlag ? 'bold' : 'normal' }}>Step 2: Assign an owner to the kit</Text>
            <Text style={{ paddingLeft: AppSizes.padding, fontSize: this.props.bluetooth.accessoryData.id && this.props.bluetooth.accessoryData.ownerFlag ? font14 : font10, fontWeight: this.props.bluetooth.accessoryData.id && this.props.bluetooth.accessoryData.ownerFlag ? 'bold' : 'normal' }}>Step 3: Assign a wifi network to the kit</Text>
            <Egg
                setps={'TTT'}
                onCatch={() => this.props.bluetooth.accessoryData.id && this.props.bluetooth.accessoryData.ownerFlag ? this.setState({ isModal3Visible: true }) : null }
            >
                <Text style={{ paddingLeft: AppSizes.padding, fontSize: font10 }}>Step 4: Make sure WiFi light is solid green, then disconnect from kit</Text>
            </Egg>
            <Modal
                position={'center'}
                style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                isOpen={this.state.isModal1Visible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => this.setState({ isModal1Visible: false })}
            >
                <View onLayout={(ev) => this.resizeModal1(ev)}>
                    <Card title={'Connect to WiFi'}>
                        <Spacer size={5} />
                        <ScrollView style={{ borderWidth: 1, borderColor: AppColors.border, height: AppSizes.screen.heightHalf }}>
                            {
                                this.props.bluetooth.networks.map(network => (
                                    <ListItem
                                        key={network.key}
                                        title={network.label}
                                        containerStyle={{ backgroundColor: network.label === this.state.SSID || (network.label === 'Other' && this.state.other) ? AppColors.primary.grey.thirtyPercent : AppColors.white }}
                                        onPress={() => this.setState({ isModal1Visible: false, isModal2Visible: true, SSID: network.label === 'Other' ? '' : network.label, other: network.label === 'Other', newNetwork: true })}
                                    />
                                ))
                            }
                        </ScrollView>
                        <Spacer size={5} />
                        <View style={{ flexDirection: 'row' }}>
                            <Button
                                title={'Cancel'}
                                containerViewStyle={{ flex: 1 }}
                                backgroundColor={AppColors.primary.grey.fiftyPercent}
                                onPress={() => this.setState({ isModal1Visible: false })}
                            />
                            <Button
                                title={'Rescan'}
                                containerViewStyle={{ flex: 1 }}
                                onPress={() => {
                                    return this.props.scanWiFi(this.props.bluetooth.accessoryData.id)
                                        .then(() => this.readSSID(this.props.bluetooth.accessoryData.id, 30));
                                }}
                            />
                        </View>
                    </Card>
                </View>
            </Modal>
            <Modal
                position={'center'}
                style={[AppStyles.containerCentered, { backgroundColor: AppColors.transparent, flex: 1 }]}
                isOpen={this.state.isModal2Visible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => this.setState({ password: '', identity: '', anonymousIdentity: '', isModal2Visible: false, isCollapsed: true }) }
            >
                <Wrapper>
                    <Card title={`${this.state.other ? 'Hidden network' : this.state.SSID} security settings${this.state.other ? '' : ' (if needed'}`}>
                        <ScrollView style={{ height: this.state.isCollapsed ? AppSizes.screen.heightOneThird : AppSizes.screen.heightHalf }}>

                            {
                                this.state.other ?
                                    <View>
                                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >{'SSID'}</FormLabel>
                                        <FormInput
                                            containerStyle={{ borderWidth: 1, borderColor: AppColors.border }}
                                            inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }}
                                            value={this.state.SSID}
                                            maxLength={32}
                                            onChangeText={SSID => this.setState({ SSID })}
                                        />
                                    </View> : null
                            }

                            <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >{`Password${!this.state.newNetwork ? '\nUnsuccessful, please try again' : '' }`}</FormLabel>
                            <FormInput
                                containerStyle={{ borderWidth: 1, borderColor: AppColors.border }}
                                inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }}
                                value={this.state.password}
                                maxLength={32}
                                onChangeText={password => this.setState({ password })}
                            />

                            <Spacer />
                            <Text style={{ paddingLeft: 15, paddingRight: 15 }} onPress={() => this.setState({ isCollapsed: !this.state.isCollapsed })}>Advanced options</Text>
                            <Collapsible collapsed={this.state.isCollapsed} >
                                <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Identity</FormLabel>
                                <FormInput
                                    containerStyle={{ borderWidth: 1, borderColor: AppColors.border }}
                                    inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }}
                                    value={this.state.identity}
                                    maxLength={31}
                                    onChangeText={identity => this.setState({ identity })}
                                />
                                <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Anonymous Identity</FormLabel>
                                <FormInput
                                    containerStyle={{ borderWidth: 1, borderColor: AppColors.border }}
                                    inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }}
                                    value={this.state.anonymousIdentity}
                                    maxLength={31}
                                    onChangeText={anonymousIdentity => this.setState({ anonymousIdentity })}
                                />
                                <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Phase 2 Authentication</FormLabel>
                                <ModalDropdown
                                    options={Object.keys(BLEConfig.eapTypes)}
                                    style={{ paddingLeft: 15, paddingRight: 15 }}
                                    textStyle={AppStyles.h3}
                                    dropdownTextStyle={AppStyles.h3}
                                    onSelect={(index, value) => this.setState({ eapType: value })}
                                />
                            </Collapsible>

                            <Spacer />
                        </ScrollView>

                        <View style={{ flexDirection: 'row' }}>
                            <Button
                                title={'Cancel'}
                                containerViewStyle={{ flex: 1 }}
                                backgroundColor={AppColors.primary.grey.fiftyPercent}
                                onPress={() => this.setState({ isModal2Visible: false, isModal1Visible: true, SSID: null, password: '', identity: '', anonymousIdentity: '', isCollapsed: true })}
                            />
                            <Button
                                title={'Save'}
                                containerViewStyle={{ flex: 1 }}
                                onPress={() => {
                                    let config = !this.state.password.length ? BLEConfig.networkTypes.Open : this.state.identity.length || this.state.anonymousIdentity.length ? BLEConfig.networkTypes.WPA_Enterprise : BLEConfig.networkTypes.WPA_PSK;
                                    return this.props.setWiFiSSID(this.props.bluetooth.accessoryData.id, this.state.SSID)
                                        .then(() => this.props.setWiFiPassword(this.props.bluetooth.accessoryData.id, this.state.password))
                                        .then(() => this.props.setIdentity(this.props.bluetooth.accessoryData.id, this.state.identity))
                                        .then(() => this.props.setAnonymousIdentity(this.props.bluetooth.accessoryData.id, this.state.anonymousIdentity))
                                        .then(() => this.props.setEAPType(this.props.bluetooth.accessoryData.id, this.state.eapType))
                                        .then(() => this.props.connectWiFi(this.props.bluetooth.accessoryData.id, config))
                                        .then(() => {
                                            if (this.props.bluetooth.accessoryData.wifiConnected) {
                                                this.refs.toast.show(`Attempting connection to ${this.state.SSID}`, DURATION.LENGTH_LONG);
                                                return this.setState({ isModal2Visible: false, isModal1Visible: false, newNetwork: false });
                                            }
                                            this.refs.toast.show(`Failed to connect to ${this.state.SSID}`, DURATION.LENGTH_LONG);
                                            return this.setState({ isModal2Visible: true, newNetwork: true });
                                        });
                                }}
                            />
                        </View>
                    </Card>
                </Wrapper>
            </Modal>
            <Modal
                position={'center'}
                style={[AppStyles.containerCentered, { backgroundColor: AppColors.transparent, flex: 1 }]}
                isOpen={this.state.isModal3Visible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => this.setState({ isModal3Visible: false }) }
            >
                <Wrapper behavior={'padding'}>
                    <Card title={'Gyro Calibration'}>
                        <ScrollView style={{ height: AppSizes.screen.heightOneThird }}>

                            <Button
                                containerViewStyle={{ borderWidth: 1, borderColor: AppColors.border, paddingLeft: 15, paddingRight: 15 }}
                                title={'Hard Calibration Offset'}
                                onPress={() => this.props.setGyroCalibration(this.props.bluetooth.accessoryData.id, BLEConfig.gyroCalibrationOffsets.HARD)}
                            />
                            <Spacer />

                            <Button
                                containerViewStyle={{ borderWidth: 1, borderColor: AppColors.border, paddingLeft: 15, paddingRight: 15 }}
                                title={'Soft Calibration Offset'}
                                onPress={() => this.props.setGyroCalibration(this.props.bluetooth.accessoryData.id, BLEConfig.gyroCalibrationOffsets.SOFT)}
                            />
                            <Spacer />

                        </ScrollView>

                        <Button
                            title={'Cancel'}
                            containerViewStyle={{ flex: 1 }}
                            backgroundColor={AppColors.primary.grey.fiftyPercent}
                            onPress={() => this.setState({ isModal3Visible: false })}
                        />
                    </Card>
                </Wrapper>
            </Modal>
            <Modal
                position={'center'}
                style={[AppStyles.containerCentered, this.state.resetModalStyle, { backgroundColor: AppColors.transparent }]}
                isOpen={this.state.isResetModalVisible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => this.setState({ isResetModalVisible: false })}
            >
                <View onLayout={(ev) => { this.resizeResetModal(ev); }}>
                    <Card title={'Factory Reset'}>

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >This will reset all kit data. Are you sure you want to continue?</FormLabel>

                        <Spacer />

                        <View style={{ flexDirection: 'row' }}>
                            <Button
                                title={'No'}
                                containerViewStyle={{ flex: 1 }}
                                backgroundColor={AppColors.primary.grey.fiftyPercent}
                                onPress={() => this.setState({ isResetModalVisible: false })}
                            />
                            <Button
                                title={'Yes'}
                                containerViewStyle={{ flex: 1 }}
                                onPress={() => this.props.startConnect()
                                    .then(() => this.props.resetAccessory(this.props.bluetooth.accessoryData))
                                    .catch(err => console.log(err))
                                    .then(() => this.props.stopConnect())
                                    .then(() => {
                                        this.refs.toast.show(`Accessory reset ${this.props.bluetooth.resetFailed ? 'failed' : 'succeeded'}`, DURATION.LENGTH_LONG);
                                        return this.setState({ isResetModalVisible: false });
                                    })
                                }
                            />
                        </View>
                    </Card>
                </View>
            </Modal>
            { this.props.bluetooth.indicator ?
                <ActivityIndicator
                    style={[AppStyles.activityIndicator]}
                    size={'large'}
                    color={'#C1C5C8'}
                /> : null
            }
        </View>
    );

    managerView = () => (
        <Placeholder />
    );

    researcherView = () => (
        <Placeholder />
    );

    render = () => {
        return this.props.user.role ? this.biometrixAdminView() : <Placeholder />;
        // switch(this.props.user.role) {
        // case Roles.admin:
        //     return this.adminView();
        // case Roles.athlete:
        //     return this.athleteView();
        // case Roles.biometrixAdmin:
        //     return this.biometrixAdminView();
        // case Roles.superAdmin:
        //     return this.biometrixAdminView();
        // case Roles.manager:
        //     return this.biometrixAdminView();
        // case Roles.researcher:
        //     return this.researcherView();
        // default:
        //     return <Placeholder />;
        // }
    }
}

/* Export Component ==================================================================== */
export default KitManagementView;
