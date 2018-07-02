/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:34:40
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 18:44:00
 */

/**
 * Bluetooth Connect Screen Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Actions
import BluetoothActions from '../../actions/ble';

const BluetoothConnect = ({
    Layout,
    connectToAccessory,
    checkState,
    changeState,
    startBluetooth,
    enableBluetooth,
    startScan,
    stopScan,
    deviceFound,
    startConnect,
    stopConnect,
    disconnect,
    loginToAccessory,
    getOwnerFlag,
    getAccessoryKey,
    getWifiMacAddress,
    user,
    bluetooth
}) => (
    <Layout
        connectToAccessory={connectToAccessory}
        checkState={checkState}
        changeState={changeState}
        startBluetooth={startBluetooth}
        enableBluetooth={enableBluetooth}
        startScan={startScan}
        stopScan={stopScan}
        deviceFound={deviceFound}
        startConnect={startConnect}
        stopConnect={stopConnect}
        disconnect={disconnect}
        loginToAccessory={loginToAccessory}
        getOwnerFlag={getOwnerFlag}
        getAccessoryKey={getAccessoryKey}
        getWifiMacAddress={getWifiMacAddress}
        user={user}
        bluetooth={bluetooth}
    />
);

BluetoothConnect.propTypes = {
    Layout:             PropTypes.func.isRequired,
    connectToAccessory: PropTypes.func.isRequired,
    checkState:         PropTypes.func.isRequired,
    changeState:        PropTypes.func.isRequired,
    startBluetooth:     PropTypes.func.isRequired,
    enableBluetooth:    PropTypes.func.isRequired,
    startScan:          PropTypes.func.isRequired,
    stopScan:           PropTypes.func.isRequired,
    deviceFound:        PropTypes.func.isRequired,
    startConnect:       PropTypes.func.isRequired,
    stopConnect:        PropTypes.func.isRequired,
    disconnect:         PropTypes.func.isRequired,
    loginToAccessory:   PropTypes.func.isRequired,
    getOwnerFlag:       PropTypes.func.isRequired,
    getAccessoryKey:    PropTypes.func.isRequired,
    getWifiMacAddress:  PropTypes.func.isRequired,
    user:               PropTypes.shape({}).isRequired,
    bluetooth:          PropTypes.shape({}).isRequired,
};

BluetoothConnect.defaultProps = {
    user:      {},
    bluetooth: {},
};

const mapStateToProps = state => ({
    user:      state.user || {},
    bluetooth: state.ble || {},
});

const mapDispatchToProps = {
    connectToAccessory: BluetoothActions.connectToAccessory,
    checkState:         BluetoothActions.checkState,
    changeState:        BluetoothActions.changeState,
    startBluetooth:     BluetoothActions.startBluetooth,
    enableBluetooth:    BluetoothActions.enableBluetooth,
    startScan:          BluetoothActions.startScan,
    stopScan:           BluetoothActions.stopScan,
    deviceFound:        BluetoothActions.deviceFound,
    startConnect:       BluetoothActions.startConnect,
    stopConnect:        BluetoothActions.stopConnect,
    disconnect:         BluetoothActions.disconnect,
    loginToAccessory:   BluetoothActions.loginToAccessory,
    getOwnerFlag:       BluetoothActions.getOwnerFlag,
    getAccessoryKey:    BluetoothActions.getAccessoryKey,
    getWifiMacAddress:  BluetoothActions.getWifiMacAddress,
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothConnect);
