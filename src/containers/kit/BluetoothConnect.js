/**
 * Bluetooth Connect 3 Sensor System Screen Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

// Actions
import { ble as BluetoothActions, user as UserActions, } from '../../actions';

const BluetoothConnect = ({
    Layout,
    assignKitIndividual,
    bluetooth,
    deviceFound,
    exitKitSetup,
    getScannedWifiConnections,
    getSensorFiles,
    getSingleWifiConnection,
    network,
    startConnection,
    updateUser,
    user,
    writeWifiDetailsToSensor,
}) => (
    <Layout
        assignKitIndividual={assignKitIndividual}
        bluetooth={bluetooth}
        deviceFound={deviceFound}
        exitKitSetup={exitKitSetup}
        getScannedWifiConnections={getScannedWifiConnections}
        getSensorFiles={getSensorFiles}
        getSingleWifiConnection={getSingleWifiConnection}
        network={network}
        startConnection={startConnection}
        updateUser={updateUser}
        user={user}
        writeWifiDetailsToSensor={writeWifiDetailsToSensor}
    />
);

BluetoothConnect.propTypes = {
    Layout:                    PropTypes.func.isRequired,
    assignKitIndividual:       PropTypes.func.isRequired,
    bluetooth:                 PropTypes.shape({}).isRequired,
    deviceFound:               PropTypes.func.isRequired,
    exitKitSetup:              PropTypes.func.isRequired,
    getScannedWifiConnections: PropTypes.func.isRequired,
    getSensorFiles:            PropTypes.func.isRequired,
    getSingleWifiConnection:   PropTypes.func.isRequired,
    network:                   PropTypes.object.isRequired,
    startConnection:           PropTypes.func.isRequired,
    updateUser:                PropTypes.func.isRequired,
    user:                      PropTypes.shape({}).isRequired,
    writeWifiDetailsToSensor:  PropTypes.func.isRequired,
};

BluetoothConnect.defaultProps = {
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
    exitKitSetup:              BluetoothActions.exitKitSetup,
    getScannedWifiConnections: BluetoothActions.getScannedWifiConnections,
    getSensorFiles:            BluetoothActions.getSensorFiles,
    getSingleWifiConnection:   BluetoothActions.getSingleWifiConnection,
    startConnection:           BluetoothActions.startConnection,
    updateUser:                UserActions.updateUser,
    writeWifiDetailsToSensor:  BluetoothActions.writeWifiDetailsToSensor,
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothConnect);