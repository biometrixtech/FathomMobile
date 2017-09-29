/**
 * Kit Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    View,
    ScrollView,
    BackHandler,
    NativeEventEmitter,
    KeyboardAvoidingView,
    NativeModules,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Collapsible from 'react-native-collapsible';
import ModalDropdown from 'react-native-modal-dropdown';
import Modal from 'react-native-modalbox';
import Toast, {DURATION} from 'react-native-easy-toast';

// Consts and Libs
import { AppStyles, AppSizes, AppColors, AppFonts } from '@theme/';
import { Roles, BLEConfig } from '@constants/';

// Components
import { Spacer, Text, ListItem, Card, Button, FormInput, FormLabel } from '@ui/';
import { Placeholder } from '@general/';

const font18 = AppFonts.scaleFont(18);
const font14 = AppFonts.scaleFont(14);
const font10 = AppFonts.scaleFont(10);

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    indicator: {
        position: 'absolute',
        left:     0,
        right:    0,
        bottom:   0,
        top:      0,
    }
});

/* Component ==================================================================== */
class KitManagementView extends Component {
    static componentName = 'KitManagementView';

    static propTypes = {
        user:                 PropTypes.object,
        bluetooth:            PropTypes.object,
        scanWiFi:             PropTypes.func.isRequired,
        startScan:            PropTypes.func.isRequired,
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
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
            modalStyle:        {},
            SSID:              null,
            newNetwork:        true,
            isCollapsed:       true,
            password:          '',
            identity:          '',
            anonymousIdentity: '',
            eapType:           ''
        };

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    }

    readSSID = (id, loopsLeft) => {
        this.props.readSSID(id)
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
        <View style={[AppStyles.container, { backgroundColor: AppColors.brand.light }]} >
            <Toast 
                ref={'toast'}
                position={'top'}
            />
            { this.props.bluetooth.indicator ?
                <View style={[styles.indicator, { justifyContent: 'center', alignItems: 'center'}]}>
                    <ActivityIndicator
                        animating={true}
                        size={'large'}
                        color={'#C1C5C8'}
                    />
                </View> : null
            }
            <Text style={{ padding: 10, paddingLeft: 20, fontSize: font18 }}>SETTINGS</Text>
            <ListItem
                title={`${this.props.bluetooth.accessoryData.id ? 'Disconnect' : 'Connect Kit'}`}
                rightTitle={this.props.bluetooth.accessoryData.name ? this.props.bluetooth.accessoryData.name : null}
                rightTitleStyle={{ color: this.props.bluetooth.accessoryData.id ? AppColors.brand.blue : AppColors.lightGrey}}
                onPress={() => {
                    if (this.props.bluetooth.accessoryData.id) {
                        return this.props.startConnect()
                            .then(() => this.props.disconnect(this.props.bluetooth.accessoryData.id))
                            .catch(err => this.props.disconnect(this.props.bluetooth.accessoryData.id)
                                .then(() => this.props.stopConnect())
                            )
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
                        chevronColor={ AppColors.brand.blue }
                        titleStyle={{ color: AppColors.brand.blue }}
                        onPress={() => Actions.kitOwner()}
                    />
                    :
                    <ListItem
                        title={'Owner'}
                        chevronColor={ AppColors.lightGrey }
                        titleStyle={{ color: AppColors.lightGrey }}
                    />
            }
            {
                !this.props.bluetooth.accessoryData.id || !this.props.bluetooth.accessoryData.configured ?
                    <ListItem
                        title={'WiFi'}
                        chevronColor={ AppColors.lightGrey }
                        titleStyle={{ color: AppColors.lightGrey }}
                    />
                    :
                    <ListItem
                        title={'WiFi'}
                        chevronColor={ AppColors.brand.blue }
                        titleStyle={{ color: AppColors.brand.blue }}
                        onPress={() => {
                            this.setState({ isModal1Visible: true });
                            return this.props.scanWiFi(this.props.bluetooth.accessoryData.id)
                                .then(() => this.readSSID(this.props.bluetooth.accessoryData.id, 30));
                        }}
                    />
            }
            <Text style={{ paddingLeft: 20, fontSize: !this.props.bluetooth.accessoryData.id ? font14 : font10, fontWeight: !this.props.bluetooth.accessoryData.id ? 'bold' : 'normal' }}>Step 1: Connect to kit</Text>
            <Text style={{ paddingLeft: 20, fontSize: this.props.bluetooth.accessoryData.id && !this.props.bluetooth.accessoryData.configured ? font14 : font10, fontWeight: this.props.bluetooth.accessoryData.id && !this.props.bluetooth.accessoryData.configured ? 'bold' : 'normal' }}>Step 2: Assign an owner to the kit</Text>
            <Text style={{ paddingLeft: 20, fontSize: this.props.bluetooth.accessoryData.id && this.props.bluetooth.accessoryData.configured ? font14 : font10, fontWeight: this.props.bluetooth.accessoryData.id && this.props.bluetooth.accessoryData.configured ? 'bold' : 'normal' }}>Step 3: Assign a wifi network to the kit</Text>
            <Text style={{ paddingLeft: 20, fontSize: font10 }}>Step 4: Make sure WiFi light is solid green, then disconnect from kit</Text>
            <Modal
                position={'center'}
                style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                isOpen={this.state.isModal1Visible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => this.setState({ isModal1Visible: false })}
            >
                <View onLayout={(ev) => { this.resizeModal1(ev); }}>
                    <Card title={'Connect to WiFi'}>
                        <Spacer size={5} />
                        <ScrollView style={{ borderWidth: 1, borderColor: AppColors.border, height: AppSizes.screen.heightHalf }}>
                            {
                                this.props.bluetooth.networks.map(network => (
                                    <ListItem
                                        key={network.key}
                                        title={network.label}
                                        containerStyle={{ backgroundColor: network.label === this.state.SSID ? AppColors.brand.fogGrey : AppColors.background }}
                                        onPress={() => this.setState({ isModal1Visible: false, isModal2Visible: true, SSID: network.label, newNetwork: true })}
                                    />
                                ))
                            }
                        </ScrollView>
                        <Spacer size={5} />
                        <View style={{ flexDirection: 'row' }}>
                            <Button
                                title={'Cancel'}
                                containerViewStyle={{ flex: 1 }}
                                backgroundColor={AppColors.brand.fogGrey}
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
                <KeyboardAvoidingView behavior={'padding'}>
                    <Card title={`${this.state.SSID} security settings (if needed)`}>
                        <ScrollView style={{ height: this.state.isCollapsed ? AppSizes.screen.heightOneThird : AppSizes.screen.heightHalf }}>

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
                                backgroundColor={AppColors.brand.fogGrey}
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
                </KeyboardAvoidingView>
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
