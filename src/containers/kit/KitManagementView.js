/**
 * Kit Management Screen
 */
/* eslint-disable max-len, react/no-string-refs */
import React, { Component, PropTypes } from 'react';
import {
  View,
  NativeAppEventEmitter,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { NetworkInfo } from 'react-native-network-info';
import BleManager from 'react-native-ble-manager';
import Swiper from 'react-native-swiper';
import ModalDropdown from 'react-native-modal-dropdown';
import Collapsible from 'react-native-collapsible';

// Consts and Libs
import { AppStyles, AppColors } from '@theme/';

// Components
import { Spacer, Button, FormLabel, Text } from '@ui/';

const accessoryDiscoverabilityInstruction = 'hold the ___ and ___ buttons simultaneously until the kit lights flash red and blue';

/* Component ==================================================================== */
class KitManagementView extends Component {
    static componentName = 'KitManagementView';

    /* eslint-disable react/forbid-prop-types */
    static propTypes = {
        user: PropTypes.object,
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
            ble:          null,
            scanning:     false,
            index:        0,
            devicesFound: [],
            isCollapsed:  true,
            SSID:         null,
            resultMsg:    {
                status:  null,
                success: null,
                error:   null,
            },
        };
    }

    componentDidMount = () => {
        // Get SSID
        NetworkInfo.getSSID((ssid) => {
            console.log('SSID: ', ssid);
            this.setState({ SSID: ssid });
            return null;
        });

        BleManager.checkState();
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleBleStateChange     = this.handleBleStateChange.bind(this);

        NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral', (data) => { this.handleDiscoverPeripheral(data); });
        NativeAppEventEmitter.addListener('BleManagerDidUpdateState', (data) => { this.handleBleStateChange(data); });
        NativeAppEventEmitter.addListener('BleManagerStopScan', () => { this.setState({ scanning: false, resultMsg: { success: 'Finished scanning' } }); });
    }

    componentWillUnmount = () => {
        NativeAppEventEmitter.removeListener('BleManagerDiscoverPeripheral');
        NativeAppEventEmitter.removeListener('BleManagerDidUpdateState');
        NativeAppEventEmitter.removeListener('BleManagerStopScan');
    }

    turnOnBluetooth = () => {
        BleManager.start({ showAlert: true });

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (!result) {
                    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((res) => {
                        if (res === 'denied') {
                            return this.setState({ resultMsg: { error: 'Bluetooth inactive' } });
                        }
                        return null;
                    });
                }
                return BleManager.enableBluetooth()
                  .catch(error => this.setState({ resultMsg: { error: 'Bluetooth inactive' } }));
            });
        }
    }

    handleScan = () => BleManager.scan([], 30, false)
            .then(() => { this.refs.swiper.scrollBy(1); this.setState({ scanning: true, resultMsg: { status: 'Scanning..' }, devicesFound: [] }); })
            .catch(err => console.log(err));

    toggleScanning = (bool) => {
        if (bool) {
            this.setState({ scanning: true });
            return this.handleScan();
        }
        this.setState({ scanning: false, ble: null });
        return BleManager.stopScan().then(res => BleManager.checkState());
    }

    handleDiscoverPeripheral = (data) => {
        if (data.name && data.name.indexOf('fathom') > -1 && this.state.devicesFound.every(device => device.id !== data.id)) {
            console.log('Got new ble data', data);
            this.state.devicesFound.push(data);
            return this.setState({ ble: data, devicesFound: this.state.devicesFound });
        }
        return null;
    }

    handleBleStateChange = (data) => {
        if (data.state === 'off') {
            if (this.refs.swiper.state.index > 1) {
                this.refs.swiper.scrollBy(-this.refs.swiper.state.index+1);
            }
            return this.setState({ resultMsg: { error: 'Bluetooth inactive' } });
        }
        if (this.refs.swiper.state.index === 1) {
            this.turnOnBluetooth();
            this.refs.swiper.scrollBy(1);
        }
        return this.setState({ resultMsg: { error: null } });
    }

    connect = (data) => {
        console.log(data);
        return BleManager.connect(data.id)
            .then(() => {
                data.connected = true;
                return data;
            })
            .then(() => BleManager.isPeripheralConnected(data.id, []))
            .then((isConnected) => {
                console.log(`Is peripheral ${data.name} connected: ${isConnected}`);
                data.connected = isConnected;
                return data;
            })
            .then(peripheral => BleManager.retrieveServices(peripheral.id))
            .then(peripheralData => console.log('Retrieved peripheral services', peripheralData))
            .then(() => BleManager.read(data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de'))
            .then(readData => console.log(`Data read: ${readData}`))
            .catch((err) => {
                console.log(err);
                return err;
            });
    }

    /* eslint-disable max-len */
    render = () =>
        (
          <Swiper ref="swiper" scrollEnabled={false} loop={false}>
            <View style={[AppStyles.containerCentered, { flex: 1 }]}>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 1 }}>
                <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000' }]} >
                  { accessoryDiscoverabilityInstruction }
                </FormLabel>
                <Spacer />
                <Button title={'Next'} onPress={() => { this.refs.swiper.scrollBy(1); BleManager.checkState(); }} raised />
              </View>
              <View style={{ flex: 1 }} />
            </View>
            <View style={[AppStyles.containerCentered, { flex: 1 }]}>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 1 }} >
                <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000' }]} >Step 2: Turn on bluetooth</FormLabel>
                <Icon name="bluetooth" containerStyle={{ alignSelf: 'center' }} size={30} color={AppColors.brand.primary} reverse onPress={() => this.turnOnBluetooth()} raised />
              </View>
              <View style={{ flex: 1 }} />
            </View>
            <View style={[AppStyles.containerCentered, { flex: 1 }]}>

              {/* <View style={[AppStyles.container, AppStyles.containerCentered]}>
              <RadialMenu menuRadius={AppStyles.windowSize.width/3} style={[AppStyles.radialMenu]} onOpen={() => {}} onClose={() => {}}>
                <Icon raised type="octicon" name="settings" color="#FFFFFF" containerStyle={{ backgroundColor: AppColors.brand.primary }} style={[AppStyles.containerCentered]} size={41} />
                <Icon raised type="entypo" name="tools" color={AppColors.brand.primary} size={40} />
                <Icon raised type="material-community" name="account-switch" color={AppColors.brand.primary} size={40} />
                <Icon raised type="material-community" name="replay" color={AppColors.brand.primary} size={40} />
              </RadialMenu>
            </View> */}
              <View style={{ flex: 1 }} />
              <View style={{ flex: 1, alignItems: 'center' }} >
                <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000' }]} >Step 3: Scan for accessories</FormLabel>
                <Button
                  title={this.state.scanning ? 'Stop Scan' : 'Start Scan'}
                  icon={{ name: `${this.state.scanning ? 'stop' : 'play-arrow'}` }}
                  buttonStyle={{ backgroundColor: `${this.state.scanning ? AppColors.red : AppColors.brand.primary}` }}
                  onPress={() => this.toggleScanning(!this.state.scanning)}
                  raised
                />
                <Spacer />
                <ModalDropdown options={this.state.devicesFound.map(device => device.name)} onSelect={idx => this.connect(this.state.devicesFound[idx])} />
                <Spacer />
                <Text labelStyle={[AppStyles.h5, { color: AppColors.primary }]} onPress={() => { this.setState({ isCollapsed: !this.state.isCollapsed }); }} >{'Can\'t find your device?'}</Text>
                <Spacer />
                <Collapsible collapsed={this.state.isCollapsed} >
                  <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000' }]} >
                    { `${accessoryDiscoverabilityInstruction}. Then rescan.` }
                  </FormLabel>
                </Collapsible>
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </Swiper>
        );
}

/* Export Component ==================================================================== */
export default KitManagementView;
