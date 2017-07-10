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
    user:         state.user,
    devicesFound: state.bluetooth.devicesFound,
    scanning:     state.bluetooth.scanning,
});

// Any actions to map to the component?
const mapDispatchToProps = {
    connectToAccessory:  BluetoothActions.connectToAccessory,
    updateAccessoryData: BluetoothActions.updateAccessoryData,
    checkState:          BluetoothActions.checkState,
    changeState:         BluetoothActions.changeState,
    startBluetooth:      BluetoothActions.startBluetooth,
    enableBluetooth:     BluetoothActions.enableBluetooth,
    startScan:           BluetoothActions.startScan,
    stopScan:            BluetoothActions.stopScan,
    deviceFound:         BluetoothActions.deviceFound,
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothConnectRender);
