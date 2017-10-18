/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:40 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:34:40 
 */

/**
 * Bluetooth Connect Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as BluetoothActions from '@redux/bluetooth/actions';

// The component we're mapping to
import BluetoothConnectRender from './BluetoothConnectView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    user:      state.user,
    bluetooth: state.bluetooth
});

// Any actions to map to the component?
const mapDispatchToProps = {
    connectToAccessory:        BluetoothActions.connectToAccessory,
    updateAccessoryData:       BluetoothActions.updateAccessoryData,
    checkState:                BluetoothActions.checkState,
    changeState:               BluetoothActions.changeState,
    startBluetooth:            BluetoothActions.startBluetooth,
    enableBluetooth:           BluetoothActions.enableBluetooth,
    startScan:                 BluetoothActions.startScan,
    stopScan:                  BluetoothActions.stopScan,
    deviceFound:               BluetoothActions.deviceFound,
    startConnect:              BluetoothActions.startConnect,
    stopConnect:               BluetoothActions.stopConnect,
    disconnect:                BluetoothActions.disconnect,
    loginToAccessory:          BluetoothActions.loginToAccessory,
    setKitTime:                BluetoothActions.setKitTime,
    getConfiguration:          BluetoothActions.getConfiguration,
    storeParams:               BluetoothActions.storeParams,
    setAccessoryLoginEmail:    BluetoothActions.setAccessoryLoginEmail,
    setAccessoryLoginPassword: BluetoothActions.setAccessoryLoginPassword
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothConnectRender);
