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
    deviceFound,
    getBLEMacAddress,
    getScannedWifiConnections,
    getSingleWifiConnection,
    network,
    startScan,
    stopConnect,
    stopScan,
    user,
    writeWifiDetailsToSensor,
    // changeState,
    // checkState,
    // connectToAccessory,
    // disconnect,
    // enableBluetooth,
    // getAccessoryKey,
    // getOwnerFlag,
    // getUserSensorData,
    // loginToAccessory,
    // postUserSensorData,
    // setKitTime,
    // startBluetooth,
    // startConnection,
}) => (
    <Layout
        bluetooth={bluetooth}
        deviceFound={deviceFound}
        getBLEMacAddress={getBLEMacAddress}
        getScannedWifiConnections={getScannedWifiConnections}
        getSingleWifiConnection={getSingleWifiConnection}
        network={network}
        startScan={startScan}
        stopConnect={stopConnect}
        stopScan={stopScan}
        user={user}
        writeWifiDetailsToSensor={writeWifiDetailsToSensor}
        // changeState={changeState}
        // checkState={checkState}
        // connectToAccessory={connectToAccessory}
        // disconnect={disconnect}
        // enableBluetooth={enableBluetooth}
        // getAccessoryKey={getAccessoryKey}
        // getOwnerFlag={getOwnerFlag}
        // getUserSensorData={getUserSensorData}
        // loginToAccessory={loginToAccessory}
        // postUserSensorData={postUserSensorData}
        // setKitTime={setKitTime}
        // startBluetooth={startBluetooth}
        // startConnection={startConnection}
    />
);

BluetoothConnect3Sensor.propTypes = {
    Layout:                    PropTypes.func.isRequired,
    bluetooth:                 PropTypes.shape({}).isRequired,
    deviceFound:               PropTypes.func.isRequired,
    getBLEMacAddress:          PropTypes.func.isRequired,
    getScannedWifiConnections: PropTypes.func.isRequired,
    getSingleWifiConnection:   PropTypes.func.isRequired,
    network:                   PropTypes.object.isRequired,
    stopConnect:               PropTypes.func.isRequired,
    startScan:                 PropTypes.func.isRequired,
    stopScan:                  PropTypes.func.isRequired,
    user:                      PropTypes.shape({}).isRequired,
    writeWifiDetailsToSensor:  PropTypes.func.isRequired,
    // changeState:        PropTypes.func.isRequired,
    // checkState:         PropTypes.func.isRequired,
    // connectToAccessory: PropTypes.func.isRequired,
    // disconnect:         PropTypes.func.isRequired,
    // enableBluetooth:    PropTypes.func.isRequired,
    // getAccessoryKey:    PropTypes.func.isRequired,
    // getOwnerFlag:       PropTypes.func.isRequired,
    // getUserSensorData:  PropTypes.func.isRequired,
    // loginToAccessory:   PropTypes.func.isRequired,
    // postUserSensorData: PropTypes.func.isRequired,
    // setKitTime:         PropTypes.func.isRequired,
    // startBluetooth:     PropTypes.func.isRequired,
    // startConnection:    PropTypes.func.isRequired,
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
    deviceFound:               BluetoothActions.deviceFound,
    getBLEMacAddress:          BluetoothActions.getBLEMacAddress,
    getScannedWifiConnections: BluetoothActions.getScannedWifiConnections,
    getSingleWifiConnection:   BluetoothActions.getSingleWifiConnection,
    startScan:                 BluetoothActions.startScan,
    stopConnect:               BluetoothActions.stopConnect,
    stopScan:                  BluetoothActions.stopScan,
    writeWifiDetailsToSensor:  BluetoothActions.writeWifiDetailsToSensor,
    // changeState:        BluetoothActions.changeState,
    // checkState:         BluetoothActions.checkState,
    // connectToAccessory: BluetoothActions.connectToAccessory,
    // disconnect:         BluetoothActions.disconnect,
    // enableBluetooth:    BluetoothActions.enableBluetooth,
    // getAccessoryKey:    BluetoothActions.getAccessoryKey,
    // getOwnerFlag:       BluetoothActions.getOwnerFlag,
    // getUserSensorData:  BluetoothActions.getUserSensorData,
    // loginToAccessory:   BluetoothActions.loginToAccessory,
    // postUserSensorData: BluetoothActions.postUserSensorData,
    // setKitTime:         BluetoothActions.setKitTime,
    // startBluetooth:     BluetoothActions.startBluetooth,
    // startConnection:    BluetoothActions.startConnection,
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothConnect3Sensor);