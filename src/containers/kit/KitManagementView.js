/**
 * Kit Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    Image,
    ScrollView,
    View,
    NativeAppEventEmitter,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { NetworkInfo } from 'react-native-network-info';
import BleManager from 'react-native-ble-manager';
import Carousel from 'react-native-looped-carousel';
import Collapsible from 'react-native-collapsible';
import Prompt from 'react-native-prompt';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';

// Components
import { Spacer, Button, FormLabel, Text, ListItem } from '@ui/';

/* Component ==================================================================== */
class KitManagementView extends Component {
    static componentName = 'KitManagementView';

    /* eslint-disable react/forbid-prop-types */
    static propTypes = {
        user:      PropTypes.object,
        accessory: PropTypes.object,
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
            SSID:          null,
        };
    }

    componentWillMount = () => {
        console.log('will mount');
    }

    // componentDidMount = () => {
    //     // Get SSID
    //     NetworkInfo.getSSID(ssid => {
    //         this.setState({ SSID: ssid });
    //     });

    //     this.props.accessory.BleManager.checkState();
    //     this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    //     this.handleBleStateChange     = this.handleBleStateChange.bind(this);

    //     NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral', (data) => { this.handleDiscoverPeripheral(data); });
    //     NativeAppEventEmitter.addListener('BleManagerDidUpdateState', (data) => { this.handleBleStateChange(data); });
    // }

    // componentWillUnmount = () => {
    //     NativeAppEventEmitter.removeListener('BleManagerDiscoverPeripheral');
    //     NativeAppEventEmitter.removeListener('BleManagerDidUpdateState');
    // }

    // handleDiscoverPeripheral = (data) => {
    //     if (data.name && data.name.indexOf('fathom') > -1 && this.state.devicesFound.every(device => device.id !== data.id)) {
    //         console.log('Got new ble data', data);
    //         this.state.devicesFound.push(data);
    //         return this.setState({ ble: data, devicesFound: this.state.devicesFound });
    //     }
    //     return null;
    // }

    // handleBleStateChange = (data) => {
    //     if (data.state === 'off') {
    //         const index = this.state.index > 1 ? 1 : this.state.index;
    //         return this.setState({ resultMsg: { error: 'Bluetooth inactive' }, index });
    //     }
    //     if (this.state.index === 1) {
    //         return this.turnOnBluetooth();
    //     }
    //     return this.setState({ resultMsg: { error: null } });
    // }

    // setSSID = (ssid) => {
    //     let dataArray = new Array(20);
    //     dataArray[0] = parseInt('0x04', 16);
    //     dataArray[1] = ssid.length;
    //     for (let i = 2; i < 20 && i-2 < ssid.length; i+=1) {
    //         dataArray[i] = ssid.charCodeAt(i-2);
    //     }
    //     for (let i = ssid.length + 2; i < 20; i+=1) {
    //         dataArray[i] = parseInt('0x00', 16);
    //     }
    //     console.log('SSID Data Array: ', dataArray);
    //     return BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray)
    //         .then(() => {
    //             if (ssid.length <= 18) {
    //                 return null;
    //             }
    //             dataArray = new Array(20);
    //             dataArray[0] = parseInt('0x05', 16);
    //             dataArray[1] = ssid.length - 18;
    //             for (let i = 2; i - 2 < ssid.length - 18; i+=1) {
    //                 dataArray[i] = ssid.charCodeAt(i+16);
    //             }
    //             for (let i = ssid.length - 16; i < 20; i+=1) {
    //                 dataArray[i] = parseInt('0x00', 16);
    //             }
    //             console.log('SSID Data Array 2: ', dataArray);
    //             return BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray);
    //         });
    // }

    // setWiFiPassword = (passwordAttempt) => {
    //     let dataArray = new Array(20);
    //     dataArray[0] = parseInt('0x06', 16);
    //     dataArray[1] = passwordAttempt.length;
    //     for (let i = 2; i < 20 && i-2 < passwordAttempt.length; i+=1) {
    //         dataArray[i] = passwordAttempt.charCodeAt(i-2);
    //     }
    //     for (let i = passwordAttempt.length + 2; i < 20; i+=1) {
    //         dataArray[i] = parseInt('0x00', 16);
    //     }
    //     console.log('Password Data Array: ', dataArray);
    //     return BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray)
    //         .then(() => {
    //             if (passwordAttempt.length <= 18) {
    //                 return null;
    //             }
    //             dataArray = new Array(20);
    //             dataArray[0] = parseInt('0x07', 16);
    //             dataArray[1] = passwordAttempt.length - 18;
    //             for (let i = 2; i - 2 < passwordAttempt.length - 18; i+=1) {
    //                 dataArray[i] = passwordAttempt.charCodeAt(i+16);
    //             }
    //             for (let i = passwordAttempt.length - 16; i < 20; i+=1) {
    //                 dataArray[i] = parseInt('0x00', 16);
    //             }
    //             console.log('Password Data Array 2: ', dataArray);
    //             return BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray);
    //         });
    // }

    // setupWiFi = (ssid, password) => {
    //     return this.setSSID(ssid)
    //         .then(() => this.setWiFiPassword(password))
    //         .then(() => {
    //             let dataArray = new Array(20);
    //             dataArray[0] = parseInt('0x08', 16);
    //             dataArray[1] = parseInt('0x00', 16);
    //             for (let i = 2; i < 20; i+=1) {
    //                 dataArray[i] = parseInt('0x00', 16);
    //             }
    //             return BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray)
    //         })
    //         .then(() => BleManager.read(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de'))
    //         .then(readData => console.log(readData))
    //         .then(() => setTimeout(() => this.props.upsertAccessory(this.state.data.id, {
    //             name:    this.state.data.name,
    //             team_id: this.props.user.teams[0].id,
    //         }), 3000))
    //         .catch(err => { console.log(err); this.setState({ promptVisible: true }) });
    // }

    // _onLayoutDidChange = (e) => {
    //     const layout = e.nativeEvent.layout;
    //     this.setState({ size: { width: layout.width, height: layout.height } });
    // }

    render = () =>
        (
        <View style={[AppStyles.container, { backgroundColor: AppColors.brand.light }]} >
            <Text style={{ padding: 10, paddingLeft: 20, fontSize: 18 }}>SETTINGS</Text>
            <ListItem
                title={'Connect Kit'}
                onPress={Actions.bluetoothConnect}
            />
            <Text style={{ paddingLeft: 20, fontSize: 10 }}>Connect your Fathom Kit to WiFi</Text>
            <Spacer />
            <Text style={{ padding: 10, paddingLeft: 20, fontSize: 18 }}>MANAGE KIT</Text>
            <ListItem
                title={'Owner'}
                chevronColor={this.props.accessory.accessoryData ? AppColors.brand.blue : AppColors.lightGrey}
                titleStyle={{ color: this.props.accessory.accessoryData ? AppColors.brand.blue : AppColors.lightGrey}}
            />
            <ListItem
                title={'WiFi'}
                chevronColor={this.props.accessory.accessoryData ? AppColors.brand.blue : AppColors.lightGrey}
                titleStyle={{ color: this.props.accessory.accessoryData ? AppColors.brand.blue : AppColors.lightGrey}}
            />
            <ListItem
                title={'Reset'}
                chevronColor={this.props.accessory.accessoryData ? AppColors.brand.blue : AppColors.lightGrey}
                titleStyle={{ color: this.props.accessory.accessoryData ? AppColors.brand.blue : AppColors.lightGrey}}
            />
            <Text style={{ paddingLeft: 20, fontSize: 10 }}>Assign owner to the kit, change wifi network, or factory reset</Text>
        </View>
        );
}

/* Export Component ==================================================================== */
export default KitManagementView;
