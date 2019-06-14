/**
 * Sensor Files Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

// Actions
import { ble as BluetoothActions, user as UserActions, } from '../../actions';

const SensorFilesPage = ({
    Layout,
    assignKitIndividual,
    bluetooth,
    deviceFound,
    getBLEMacAddress,
    getScannedWifiConnections,
    getSensorFiles,
    getSingleWifiConnection,
    pageStep,
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
        getBLEMacAddress={getBLEMacAddress}
        getScannedWifiConnections={getScannedWifiConnections}
        getSensorFiles={getSensorFiles}
        getSingleWifiConnection={getSingleWifiConnection}
        pageStep={pageStep}
        startDisconnection={startDisconnection}
        startScan={startScan}
        stopConnect={stopConnect}
        stopScan={stopScan}
        updateUser={updateUser}
        user={user}
        writeWifiDetailsToSensor={writeWifiDetailsToSensor}
    />
);

SensorFilesPage.propTypes = {
    assignKitIndividual:       PropTypes.func.isRequired,
    bluetooth:                 PropTypes.shape({}).isRequired,
    deviceFound:               PropTypes.func.isRequired,
    getBLEMacAddress:          PropTypes.func.isRequired,
    getScannedWifiConnections: PropTypes.func.isRequired,
    getSensorFiles:            PropTypes.func.isRequired,
    getSingleWifiConnection:   PropTypes.func.isRequired,
    pageStep:                  PropTypes.string.isRequired,
    startDisconnection:        PropTypes.func.isRequired,
    startScan:                 PropTypes.func.isRequired,
    stopConnect:               PropTypes.func.isRequired,
    stopScan:                  PropTypes.func.isRequired,
    updateUser:                PropTypes.func.isRequired,
    user:                      PropTypes.shape({}).isRequired,
    writeWifiDetailsToSensor:  PropTypes.func.isRequired,
};

SensorFilesPage.defaultProps = {};

const mapStateToProps = (state, props) => ({
    bluetooth: state.ble,
    pageStep:  props.pageStep,
    user:      state.user,
});

const mapDispatchToProps = {
    assignKitIndividual:       BluetoothActions.assignKitIndividual,
    deviceFound:               BluetoothActions.deviceFound,
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

export default connect(mapStateToProps, mapDispatchToProps)(SensorFilesPage);