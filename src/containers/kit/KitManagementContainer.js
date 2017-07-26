/**
 * Kit Management Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as BluetoothActions from '@redux/bluetooth/actions';

// The component we're mapping to
import KitManagementRender from './KitManagementView';

// What data from the store shall we send to the component?
const mapStateToProps = state => {
    return ({
        user:      state.user,
        bluetooth: state.bluetooth
    });
};

// Any actions to map to the component?
const mapDispatchToProps = {
    resetAccessory:   BluetoothActions.resetAccessory,
    scanWiFi:         BluetoothActions.scanWiFi,
    loginToAccessory: BluetoothActions.loginToAccessory,
    setWiFiSSID:      BluetoothActions.setWiFiSSID,
    setWiFiPassword:  BluetoothActions.setWiFiPassword,
    connectWiFi:      BluetoothActions.connectWiFi,
    readSSID:         BluetoothActions.readSSID
};

export default connect(mapStateToProps, mapDispatchToProps)(KitManagementRender);
