/**
 * Kit Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
  Image,
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
import Prompt from 'react-native-prompt';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles, AppColors } from '@theme/';

// Components
import { Spacer, Button, FormLabel, Text } from '@ui/';

const accessoryDiscoverabilityInstruction = 'hold the top and bottom buttons simultaneously until the kit lights flash red and blue';

/* Component ==================================================================== */
class KitManagementView extends Component {
    static componentName = 'KitManagementView';

    /* eslint-disable react/forbid-prop-types */
    static propTypes = {
        user:            PropTypes.object,
        upsertAccessory: PropTypes.func.isRequired,
    }

    static defaultProps = {
        user:  {},
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
            data:         null,
            resultMsg:    {
                status:  null,
                success: null,
                error:   null,
            },
        };
    }

    componentDidMount = () => {
        console.log('------------------------------------');
        console.log(this.props.user);
        console.log('------------------------------------');
        // Get SSID
        NetworkInfo.getSSID(ssid => {
            this.setState({ SSID: ssid });
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

    setSSID = (ssid) => {
        let dataArray = new Array(20);
        dataArray[0] = parseInt('0x04', 16);
        dataArray[1] = ssid.length;
        for (let i = 2; i < 20 && i-2 < ssid.length; i++) {
            dataArray[i] = ssid.charCodeAt(i-2);
        }
        for (let i = ssid.length + 2; i < 20; i++) {
            dataArray[i] = parseInt('0x00', 16);
        }
        console.log('SSID Data Array: ', dataArray);
        return BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray)
            .then(() => {
                if (ssid.length <= 18) {
                    return;
                }
                let dataArray = new Array(20);
                dataArray[0] = parseInt('0x05', 16);
                dataArray[1] = ssid.length - 18;
                for (let i = 2; i - 2 < ssid.length - 18; i++) {
                    dataArray[i] = ssid.charCodeAt(i+16);
                }
                for (let i = ssid.length - 16; i < 20; i++) {
                    dataArray[i] = parseInt('0x00', 16);
                }
                console.log('SSID Data Array 2: ', dataArray);
                return BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray);
            });
    }

    setWiFiPassword = (passwordAttempt) => {
        let dataArray = new Array(20);
        dataArray[0] = parseInt('0x06', 16);
        dataArray[1] = passwordAttempt.length;
        for (let i = 2; i < 20 && i-2 < passwordAttempt.length; i++) {
            dataArray[i] = passwordAttempt.charCodeAt(i-2);
        }
        for (let i = passwordAttempt.length + 2; i < 20; i++) {
            dataArray[i] = parseInt('0x00', 16);
        }
        console.log('Password Data Array: ', dataArray);
        return BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray)
            .then(() => {
                if (passwordAttempt.length <= 18) {
                    return;
                }
                let dataArray = new Array(20);
                dataArray[0] = parseInt('0x07', 16);
                dataArray[1] = passwordAttempt.length - 18;
                for (let i = 2; i - 2 < passwordAttempt.length - 18; i++) {
                    dataArray[i] = passwordAttempt.charCodeAt(i+16);
                }
                for (let i = passwordAttempt.length - 16; i < 20; i++) {
                    dataArray[i] = parseInt('0x00', 16);
                }
                console.log('Password Data Array 2: ', dataArray);
                return BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray);
            });
    }

    setupWiFi = (ssid, password) => {
        return this.setSSID(ssid)
            .then(() => this.setWiFiPassword(password))
            .then(() => {
                let dataArray = new Array(20);
                dataArray[0] = parseInt('0x08', 16);
                dataArray[1] = parseInt('0x00', 16);
                for (let i = 2; i < 20; i++) {
                    dataArray[i] = parseInt('0x00', 16);
                }
                return BleManager.write(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de', dataArray)
            })
            .then(() => BleManager.read(this.state.data.id, '3282ae19-ab8b-f495-7544-67e11bb6223f', 'a268ae6f-3433-d999-4e44-42e82070d3de'))
            .then(readData => console.log(readData))
            .then(() => setTimeout(() => this.props.upsertAccessory(this.state.data.id, {
                name:    this.state.data.name,
                team_id: this.props.user.teams[0].id,
            }), 3000))
            .catch(err => { console.log(err); this.setState({ promptVisible: true }) });
    }

    connect = (data) => {
        return BleManager.connect(data.id)
            .then(() => BleManager.retrieveServices(data.id))
            .then(peripheralData => this.setState({ data, promptVisible: true }))
            .catch((err) => {
                console.log(err);
                return err;
            });
    }

    render = () =>
        (
          <Swiper ref="swiper" scrollEnabled={false} loop={false}>
            <View style={[AppStyles.containerCentered, { flex: 1 }]}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{resizeMode: 'contain', width: 400, height: 400}} source={require('@images/Instructions_Kit-Contents-Top_v01.png')}/>
              </View>
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
              <Prompt
                title={`${this.state.SSID} Password:`}
                placeholder={'Password'}
                visible={this.state.promptVisible}
                onCancel={() => this.setState({
                        promptVisible: false
                    })
                }
                onSubmit={value => {
                    this.setState({ promptVisible: false });
                    return this.setupWiFi(this.state.SSID, value);
                }}
              />
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
