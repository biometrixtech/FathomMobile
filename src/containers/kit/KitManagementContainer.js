/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:56 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:34:56 
 */

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
    scanWiFi:             BluetoothActions.scanWiFi,
    startScan:            BluetoothActions.startScan,
    setWiFiSSID:          BluetoothActions.setWiFiSSID,
    setWiFiPassword:      BluetoothActions.setWiFiPassword,
    connectWiFi:          BluetoothActions.connectWiFi,
    readSSID:             BluetoothActions.readSSID,
    handleDisconnect:     BluetoothActions.handleDisconnect,
    connectToAccessory:   BluetoothActions.connectToAccessory,
    startConnect:         BluetoothActions.startConnect,
    stopConnect:          BluetoothActions.stopConnect,
    getConfiguration:     BluetoothActions.getConfiguration,
    disconnect:           BluetoothActions.disconnect,
    setIdentity:          BluetoothActions.setIdentity,
    setAnonymousIdentity: BluetoothActions.setAnonymousIdentity,
    setEAPType:           BluetoothActions.setEAPType
};

export default connect(mapStateToProps, mapDispatchToProps)(KitManagementRender);
