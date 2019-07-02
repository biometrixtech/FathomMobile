/**
 * Bluetooth Connect 3 Sensor System Screen Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

// Actions
import { ble as BluetoothActions, user as UserActions, } from '../../actions';

const BluetoothConnect3Sensor = ({
    Layout,
    assignKitIndividual,
    bluetooth,
    deviceFound,
    getAccessoryKey,
    getBLEMacAddress,
    getScannedWifiConnections,
    getSensorFiles,
    getSingleWifiConnection,
    network,
    startDisconnection,
    startScan,
    stopConnect,
    stopScan,
    updateUser,
    user,
    writeWifiDetailsToSensor,
}) => (
    <Layout
        assignKitIndividual={assignKitIndividual}
        bluetooth={bluetooth}
        deviceFound={deviceFound}
        getAccessoryKey={getAccessoryKey}
        getBLEMacAddress={getBLEMacAddress}
        getScannedWifiConnections={getScannedWifiConnections}
        getSensorFiles={getSensorFiles}
        getSingleWifiConnection={getSingleWifiConnection}
        network={network}
        startDisconnection={startDisconnection}
        startScan={startScan}
        stopConnect={stopConnect}
        stopScan={stopScan}
        updateUser={updateUser}
        user={user}
        writeWifiDetailsToSensor={writeWifiDetailsToSensor}
    />
);

BluetoothConnect3Sensor.propTypes = {
    Layout:                    PropTypes.func.isRequired,
    assignKitIndividual:       PropTypes.func.isRequired,
    bluetooth:                 PropTypes.shape({}).isRequired,
    deviceFound:               PropTypes.func.isRequired,
    getAccessoryKey:           PropTypes.func.isRequired,
    getBLEMacAddress:          PropTypes.func.isRequired,
    getScannedWifiConnections: PropTypes.func.isRequired,
    getSensorFiles:            PropTypes.func.isRequired,
    getSingleWifiConnection:   PropTypes.func.isRequired,
    network:                   PropTypes.object.isRequired,
    startDisconnection:        PropTypes.func.isRequired,
    startScan:                 PropTypes.func.isRequired,
    stopConnect:               PropTypes.func.isRequired,
    stopScan:                  PropTypes.func.isRequired,
    updateUser:                PropTypes.func.isRequired,
    user:                      PropTypes.shape({}).isRequired,
    writeWifiDetailsToSensor:  PropTypes.func.isRequired,
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
    assignKitIndividual:       BluetoothActions.assignKitIndividual,
    deviceFound:               BluetoothActions.deviceFound,
    getAccessoryKey:           BluetoothActions.getAccessoryKey,
    getBLEMacAddress:          BluetoothActions.getBLEMacAddress,
    getScannedWifiConnections: BluetoothActions.getScannedWifiConnections,
    getSensorFiles:            BluetoothActions.getSensorFiles,
    getSingleWifiConnection:   BluetoothActions.getSingleWifiConnection,
    startDisconnection:        BluetoothActions.startDisconnection,
    startScan:                 BluetoothActions.startScan,
    stopConnect:               BluetoothActions.stopConnect,
    stopScan:                  BluetoothActions.stopScan,
    updateUser:                UserActions.updateUser,
    writeWifiDetailsToSensor:  BluetoothActions.writeWifiDetailsToSensor,
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothConnect3Sensor);