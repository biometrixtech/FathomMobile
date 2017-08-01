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
import Prompt from 'react-native-prompt';
import Modal from 'react-native-modalbox';

// Consts and Libs
import { AppStyles, AppSizes, AppColors, AppFonts } from '@theme/';
import { Roles } from '@constants/';

// Components
import { Spacer, Text, ListItem, Card, Button } from '@ui/';
import { Placeholder } from '@general/';

const font18 = AppFonts.scaleFont(18);
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
        user:               PropTypes.object,
        bluetooth:          PropTypes.object,
        resetAccessory:     PropTypes.func.isRequired,
        systemReset:        PropTypes.func.isRequired,
        scanWiFi:           PropTypes.func.isRequired,
        startScan:          PropTypes.func.isRequired,
        loginToAccessory:   PropTypes.func.isRequired,
        setWiFiSSID:        PropTypes.func.isRequired,
        setWiFiPassword:    PropTypes.func.isRequired,
        connectWiFi:        PropTypes.func.isRequired,
        readSSID:           PropTypes.func.isRequired,
        handleDisconnect:   PropTypes.func.isRequired,
        assignKitName:      PropTypes.func.isRequired,
        connectToAccessory: PropTypes.func.isRequired,
        startConnect:       PropTypes.func.isRequired,
        stopConnect:        PropTypes.func.isRequired
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
            modalStyle: {},
            SSID:       null
        };

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        // this.handleDisconnectPeripheral = this.handleDisconnectPeripheral.bind(this);
    }

    readSSID = (id, loopsLeft) => {
        return this.props.readSSID(id)
            .then(() => loopsLeft-1 >= 0 ? this.readSSID(id, loopsLeft-1) : null);
    };

    componentDidMount = () => {
        BackHandler.addEventListener('backPress', () => Actions.pop());

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
        this._interval = setInterval(() => {
            return this.props.bluetooth.accessoryData.id ? this.props.handleDisconnect(this.props.bluetooth.accessoryData.id) : null;
        }, 10000);
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('backPress');

        this.handlerDiscover.remove();
        clearInterval(this._interval);
    }

    handleDiscoverPeripheral = (data) => {
        return data.id === this.props.bluetooth.accessoryData.id ? this.props.connectToAccessory(data)
            .then(() => this.props.assignKitName(data, data.name))
            .then(() => this.props.loginToAccessory(data, this.props.user))
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
                title={'Connect Kit'}
                onPress={() => Actions.bluetoothConnect()}
            />
            <Text style={{ paddingLeft: 20, fontSize: font10 }}>Connect your Fathom Kit to WiFi</Text>
            <Spacer />
            <Text style={{ padding: 10, paddingLeft: 20, fontSize: font18 }}>MANAGE KIT</Text>
            {
                this.props.bluetooth.accessoryData.accessoryConnected ?
                    (
                        <View>
                            <ListItem
                                title={'Owner'}
                                chevronColor={ AppColors.brand.blue }
                                titleStyle={{ color: AppColors.brand.blue }}
                                onPress={() => Actions.kitOwner()}
                            />
                            <ListItem
                                title={'WiFi'}
                                chevronColor={ AppColors.brand.blue }
                                titleStyle={{ color: AppColors.brand.blue }}
                                onPress={() => { this.setState({ isModalVisible: true }); return this.props.assignKitName(this.props.bluetooth.accessoryData, this.props.bluetooth.accessoryData.name).then(() => this.props.loginToAccessory(this.props.bluetooth.accessoryData, this.props.user)).then(() => this.props.scanWiFi(this.props.bluetooth.accessoryData.id)).then(() => this.readSSID(this.props.bluetooth.accessoryData.id, 30)); }}
                            />
                            <ListItem
                                title={'Reset'}
                                chevronColor={ AppColors.brand.blue }
                                titleStyle={{ color: AppColors.brand.blue }}
                                onPress={() => this.props.startConnect()
                                    .then(() => this.props.resetAccessory(this.props.bluetooth.accessoryData.id))
                                    .then(() => {
                                        this.props.systemReset(this.props.bluetooth.accessoryData.id);
                                        return this.props.startScan();
                                    })

                                }
                            />
                        </View>
                    ) : (
                        <View>
                            <ListItem
                                title={'Owner'}
                                chevronColor={ AppColors.lightGrey }
                                titleStyle={{ color: AppColors.lightGrey }}
                            />
                            <ListItem
                                title={'WiFi'}
                                chevronColor={ AppColors.lightGrey }
                                titleStyle={{ color: AppColors.lightGrey }}
                            />
                            <ListItem
                                title={'Reset'}
                                chevronColor={ AppColors.lightGrey }
                                titleStyle={{ color: AppColors.lightGrey }}
                            />
                        </View>
                    )
            }
            <Text style={{ paddingLeft: 20, fontSize: font10 }}>Assign owner to the kit, change wifi network, or factory reset</Text>
            <Prompt
                title={this.state.SSID + ' Password (if needed):'}
                placeholder={'Password'}
                visible={this.state.promptVisible}
                onCancel={() => this.setState({
                    promptVisible: false
                })}
                onSubmit={value => this.props.setWiFiSSID(this.props.bluetooth.accessoryData.id, this.state.SSID).then(() => this.props.setWiFiPassword(this.props.bluetooth.accessoryData.id, value)).then(() => this.props.connectWiFi(this.props.bluetooth.accessoryData.id)).then(() => this.setState({ promptVisible: false }))}
            />
            <Modal
                position={'center'}
                style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]}
                isOpen={this.state.isModalVisible}
                backButtonClose
                swipeToClose={false}
                onClosed={() => this.setState({ isModalVisible: false })}
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
                                        onPress={() => this.setState({ promptVisible: true, SSID: network.label })}
                                    />
                                ))
                            }
                        </ScrollView>
                        <Spacer size={5} />
                        <Button title={'Cancel'} onPress={() => this.setState({ isModalVisible: false })}/>
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
