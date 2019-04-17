/**
 * Bluetooth Connect 3 Sensor System Screen Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Actions
import BluetoothActions from '../../actions/ble';

const BluetoothConnect3Sensor = ({
    Layout,
    bluetooth,
    // changeState,
    // checkState,
    connectToAccessory,
    deviceFound,
    // disconnect,
    // enableBluetooth,
    // getAccessoryKey,
    // getOwnerFlag,
    // getUserSensorData,
    // getWifiMacAddress,
    // loginToAccessory,
    network,
    // postUserSensorData,
    // setKitTime,
    // startBluetooth,
    startConnect,
    startScan,
    stopConnect,
    stopScan,
    user,
}) => (
    <Layout
        bluetooth={bluetooth}
        // changeState={changeState}
        // checkState={checkState}
        connectToAccessory={connectToAccessory}
        deviceFound={deviceFound}
        // disconnect={disconnect}
        // enableBluetooth={enableBluetooth}
        // getAccessoryKey={getAccessoryKey}
        // getOwnerFlag={getOwnerFlag}
        // getUserSensorData={getUserSensorData}
        // getWifiMacAddress={getWifiMacAddress}
        // loginToAccessory={loginToAccessory}
        network={network}
        // postUserSensorData={postUserSensorData}
        // setKitTime={setKitTime}
        // startBluetooth={startBluetooth}
        startConnect={startConnect}
        startScan={startScan}
        stopConnect={stopConnect}
        stopScan={stopScan}
        user={user}
    />
);

BluetoothConnect3Sensor.propTypes = {
    Layout:             PropTypes.func.isRequired,
    bluetooth:          PropTypes.shape({}).isRequired,
    // changeState:        PropTypes.func.isRequired,
    // checkState:         PropTypes.func.isRequired,
    connectToAccessory: PropTypes.func.isRequired,
    deviceFound:        PropTypes.func.isRequired,
    // disconnect:         PropTypes.func.isRequired,
    // enableBluetooth:    PropTypes.func.isRequired,
    // getAccessoryKey:    PropTypes.func.isRequired,
    // getOwnerFlag:       PropTypes.func.isRequired,
    // getUserSensorData:  PropTypes.func.isRequired,
    // getWifiMacAddress:  PropTypes.func.isRequired,
    // loginToAccessory:   PropTypes.func.isRequired,
    network:            PropTypes.object.isRequired,
    // postUserSensorData: PropTypes.func.isRequired,
    // setKitTime:         PropTypes.func.isRequired,
    // startBluetooth:     PropTypes.func.isRequired,
    stopConnect:        PropTypes.func.isRequired,
    startScan:          PropTypes.func.isRequired,
    startConnect:       PropTypes.func.isRequired,
    stopScan:           PropTypes.func.isRequired,
    user:               PropTypes.shape({}).isRequired,
};

BluetoothConnect3Sensor.defaultProps = {
    bluetooth: {},
    user:      {},
};

const mapStateToProps = state => ({
    bluetooth: state.ble || {},
    network:   state.network,
    user:      state.user || {},
});

const mapDispatchToProps = {
    // changeState:        BluetoothActions.changeState,
    // checkState:         BluetoothActions.checkState,
    connectToAccessory: BluetoothActions.connectToAccessory,
    deviceFound:        BluetoothActions.deviceFound,
    // disconnect:         BluetoothActions.disconnect,
    // enableBluetooth:    BluetoothActions.enableBluetooth,
    // getAccessoryKey:    BluetoothActions.getAccessoryKey,
    // getOwnerFlag:       BluetoothActions.getOwnerFlag,
    // getUserSensorData:  BluetoothActions.getUserSensorData,
    // getWifiMacAddress:  BluetoothActions.getWifiMacAddress,
    // loginToAccessory:   BluetoothActions.loginToAccessory,
    // postUserSensorData: BluetoothActions.postUserSensorData,
    // setKitTime:         BluetoothActions.setKitTime,
    // startBluetooth:     BluetoothActions.startBluetooth,
    startConnect:       BluetoothActions.startConnect,
    startScan:          BluetoothActions.startScan,
    stopConnect:        BluetoothActions.stopConnect,
    stopScan:           BluetoothActions.stopScan,
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothConnect3Sensor);