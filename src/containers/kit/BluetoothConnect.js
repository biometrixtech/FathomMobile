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
    bluetooth,
    changeState,
    checkState,
    connectToAccessory,
    deviceFound,
    disconnect,
    enableBluetooth,
    getAccessoryKey,
    getOwnerFlag,
    getSingleSensorPractices,
    getWifiMacAddress,
    loginToAccessory,
    setKitTime,
    startBluetooth,
    startConnect,
    startScan,
    stopConnect,
    stopScan,
    user,
}) => (
    <Layout
        bluetooth={bluetooth}
        changeState={changeState}
        checkState={checkState}
        connectToAccessory={connectToAccessory}
        deviceFound={deviceFound}
        disconnect={disconnect}
        enableBluetooth={enableBluetooth}
        getAccessoryKey={getAccessoryKey}
        getOwnerFlag={getOwnerFlag}
        getSingleSensorPractices={getSingleSensorPractices}
        getWifiMacAddress={getWifiMacAddress}
        loginToAccessory={loginToAccessory}
        setKitTime={setKitTime}
        startBluetooth={startBluetooth}
        startConnect={startConnect}
        startScan={startScan}
        stopConnect={stopConnect}
        stopScan={stopScan}
        user={user}
    />
);

BluetoothConnect.propTypes = {
    Layout:                   PropTypes.func.isRequired,
    bluetooth:                PropTypes.shape({}).isRequired,
    changeState:              PropTypes.func.isRequired,
    checkState:               PropTypes.func.isRequired,
    connectToAccessory:       PropTypes.func.isRequired,
    deviceFound:              PropTypes.func.isRequired,
    disconnect:               PropTypes.func.isRequired,
    enableBluetooth:          PropTypes.func.isRequired,
    getAccessoryKey:          PropTypes.func.isRequired,
    getOwnerFlag:             PropTypes.func.isRequired,
    getSingleSensorPractices: PropTypes.func.isRequired,
    getWifiMacAddress:        PropTypes.func.isRequired,
    loginToAccessory:         PropTypes.func.isRequired,
    setKitTime:               PropTypes.func.isRequired,
    startBluetooth:           PropTypes.func.isRequired,
    stopConnect:              PropTypes.func.isRequired,
    startScan:                PropTypes.func.isRequired,
    startConnect:             PropTypes.func.isRequired,
    stopScan:                 PropTypes.func.isRequired,
    user:                     PropTypes.shape({}).isRequired,
};

BluetoothConnect.defaultProps = {
    bluetooth: {},
    user:      {},
};

const mapStateToProps = state => ({
    bluetooth: state.ble || {},
    user:      state.user || {},
});

const mapDispatchToProps = {
    changeState:              BluetoothActions.changeState,
    checkState:               BluetoothActions.checkState,
    connectToAccessory:       BluetoothActions.connectToAccessory,
    deviceFound:              BluetoothActions.deviceFound,
    disconnect:               BluetoothActions.disconnect,
    enableBluetooth:          BluetoothActions.enableBluetooth,
    getAccessoryKey:          BluetoothActions.getAccessoryKey,
    getOwnerFlag:             BluetoothActions.getOwnerFlag,
    getSingleSensorPractices: BluetoothActions.getSingleSensorPractices,
    getWifiMacAddress:        BluetoothActions.getWifiMacAddress,
    loginToAccessory:         BluetoothActions.loginToAccessory,
    setKitTime:               BluetoothActions.setKitTime,
    startBluetooth:           BluetoothActions.startBluetooth,
    startConnect:             BluetoothActions.startConnect,
    startScan:                BluetoothActions.startScan,
    stopConnect:              BluetoothActions.stopConnect,
    stopScan:                 BluetoothActions.stopScan,
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothConnect);
