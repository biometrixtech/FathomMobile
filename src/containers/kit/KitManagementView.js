/**
 * Kit Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    View,
    ScrollView,
    BackHandler,
    NativeEventEmitter,
    NativeModules,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import Toast, {DURATION} from 'react-native-easy-toast';

// Consts and Libs
import { AppStyles, AppSizes, AppColors, AppFonts } from '@theme/';
import { Roles, BLEConfig } from '@constants/';

// Components
import { Spacer, Text, ListItem, Card, Button, FormInput, FormLabel } from '@ui/';
import { Placeholder } from '@general/';

const font18 = AppFonts.scaleFont(18);
const font10 = AppFonts.scaleFont(10);

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const configuration = BLEConfig.configuration;
const bleConfiguredState = [configuration.DONE, configuration.UPSERT_PENDING, configuration.UPSERT_TO_SAVE, configuration.UPSERT_DONE];

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
        user:               PropTypes.object,
        bluetooth:          PropTypes.object,
        scanWiFi:           PropTypes.func.isRequired,
        startScan:          PropTypes.func.isRequired,
        setWiFiSSID:        PropTypes.func.isRequired,
        setWiFiPassword:    PropTypes.func.isRequired,
        connectWiFi:        PropTypes.func.isRequired,
        readSSID:           PropTypes.func.isRequired,
        handleDisconnect:   PropTypes.func.isRequired,
        connectToAccessory: PropTypes.func.isRequired,
        startConnect:       PropTypes.func.isRequired,
        stopConnect:        PropTypes.func.isRequired,
        getConfiguration:   PropTypes.func.isRequired,
        disconnect:         PropTypes.func.isRequired,
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
            modalStyle: {},
            SSID:       null,
            configured: false,
            newNetwork: true,
            password:   ''
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
        
        this._configurationInterval = setInterval(() => {
            return this.props.bluetooth.accessoryData.id ? this.props.getConfiguration(this.props.bluetooth.accessoryData.id)
                .then(() => this.setState({ configured: bleConfiguredState.some(state => state === this.props.bluetooth.accessoryData.configuration) })) : this.setState({ configured: false });
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
                            .catch(err => console.log(err))
                            .then(() => this.props.stopConnect());
                    }
                    return Actions.bluetoothConnect();
                }}
            />
            <Text style={{ paddingLeft: 20, fontSize: font10 }}>Connect your Fathom Kit to WiFi</Text>
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
                this.state.configured && this.props.bluetooth.accessoryData.id ?
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
                    :
                    <ListItem
                        title={'WiFi'}
                        chevronColor={ AppColors.lightGrey }
                        titleStyle={{ color: AppColors.lightGrey }}
                    />
            }
            <Text style={{ paddingLeft: 20, fontSize: font10 }}>Assign owner to the kit, change wifi network, or factory reset</Text>
            <Modal
                position={'center'}
                style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                isOpen={this.state.isModal1Visible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => this.setState({ isModal1Visible: false })}
            >
                <View onLayout={(ev) => { this.resizeModal(ev); }}>
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
                        <Button title={'Cancel'} onPress={() => this.setState({ isModal1Visible: false })}/>
                    </Card>
                </View>
            </Modal>
            <Modal
                position={'center'}
                style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                isOpen={this.state.isModal2Visible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => this.setState({ password: '', isModal2Visible: false }) }
            >
                <View onLayout={(ev) => { this.resizeModal(ev); }}>
                    <Card title={`${this.state.SSID} Password (if needed)`}>

                        <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >{`Password${!this.state.newNetwork ? '\nUnsuccessful, please try again' : '' }`}</FormLabel>
                        <FormInput
                            containerStyle={{ borderWidth: 1, borderColor: AppColors.border }}
                            inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }}
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                        />

                        <Spacer />

                        <View style={{ flexDirection: 'row' }}>
                            <Button
                                title={'Cancel'}
                                containerViewStyle={{ flex: 1 }}
                                backgroundColor={AppColors.brand.fogGrey}
                                onPress={() => this.setState({ isModal2Visible: false, isModal1Visible: true })}
                            />
                            <Button
                                title={'Save'}
                                containerViewStyle={{ flex: 1 }}
                                onPress={() => {
                                    return this.props.setWiFiSSID(this.props.bluetooth.accessoryData.id, this.state.SSID)
                                        .then(() => this.props.setWiFiPassword(this.props.bluetooth.accessoryData.id, this.state.password))
                                        .then(() => this.props.connectWiFi(this.props.bluetooth.accessoryData.id))
                                        .then(() => {
                                            if (this.props.bluetooth.accessoryData.wifiConnected) {
                                                this.refs.toast.show(`Successfully connected to ${this.state.SSID}`, DURATION.LENGTH_LONG);
                                                return this.setState({ isModal2Visible: false, isModal1Visible: false, newNetwork: false });
                                            }
                                            this.refs.toast.show(`Failed to connect to ${this.state.SSID}`, DURATION.LENGTH_LONG);
                                            return this.setState({ isModal2Visible: true, newNetwork: true });
                                        });
                                }}
                            />
                        </View>
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
export default KitManagementView;
