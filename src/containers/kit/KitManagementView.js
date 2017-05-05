/**
 * Kit Management Screen
 */
/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react';
import {
  View,
  NativeAppEventEmitter,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { Icon } from 'react-native-elements';
import RadialMenu from 'react-native-radial-menu';
import BleManager from 'react-native-ble-manager';

// Consts and Libs
import { AppStyles, AppColors } from '@theme/';

// Components
import { Alerts } from '@ui/';

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
            ble:       null,
            scanning:  false,
            resultMsg: {
                status:  null,
                success: null,
                error:   null,
            },
        };
    }

    componentDidMount = () => {
        BleManager.start({ showAlert: true });
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleBleStateChange     = this.handleBleStateChange.bind(this);

        NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        NativeAppEventEmitter.addListener('BleManagerDidUpdateState', this.handleBleStateChange);

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log('Permission is OK');
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((res) => {
                        if (res === 'denied') {
                            this.setState({ resultMsg: { error: 'Bluetooth inactive' } });
                        }
                    });
                }
                BleManager.enableBluetooth()
                  // .then(() =>
                      // Success code
                      // console.log('The bluetooth is already enabled or the user confirm'))
                  .catch((error) => {
                      // Failure code
                      this.setState({ resultMsg: { error: 'Bluetooth inactive' } });
                  });
            });
        }
    }

    handleScan = () => {
        BleManager.scan([], 30, true)
            .then((results) => { console.log('Scanning...'); });
    }

    toggleScanning = (bool) => {
        if (bool) {
            this.setState({ scanning: true });
            this.scanning = setInterval(() => this.handleScan(), 3000);
        } else {
            this.setState({ scanning: false, ble: null });
            clearInterval(this.scanning);
        }
    }

    handleDiscoverPeripheral = (data) => {
        console.log('Got ble data', data);
        this.setState({ ble: data });
    }

    handleBleStateChange = (data) => {
        if (data.state === 'off') {
            this.setState({ resultMsg: { error: 'Bluetooth inactive' } });
        } else {
            this.setState({ resultMsg: { error: null } });
        }
    }

    /* eslint-disable max-len */
    render = () =>
        (
          <View style={[AppStyles.container]}>
            {/* <View style={[AppStyles.container, AppStyles.containerCentered]}>
              <RadialMenu menuRadius={AppStyles.windowSize.width/3} style={[AppStyles.radialMenu]} onOpen={() => {}} onClose={() => {}}>
                <Icon raised type="octicon" name="settings" color="#FFFFFF" containerStyle={{ backgroundColor: AppColors.brand.primary }} style={[AppStyles.containerCentered]} size={41} />
                <Icon raised type="entypo" name="tools" color={AppColors.brand.primary} size={40} />
                <Icon raised type="material-community" name="account-switch" color={AppColors.brand.primary} size={40} />
                <Icon raised type="material-community" name="replay" color={AppColors.brand.primary} size={40} />
              </RadialMenu>
            </View> */}
            <Alerts
              status={this.state.resultMsg.status}
              success={this.state.resultMsg.success}
              error={this.state.resultMsg.error}
            />
          </View>
        );
}

/* Export Component ==================================================================== */
export default KitManagementView;
