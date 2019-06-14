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
    bluetooth,
    deviceFound,
    getScannedWifiConnections,
    getSingleWifiConnection,
    pageStep,
    startScan,
    stopScan,
    user,
}) => (
    <Layout
        bluetooth={bluetooth}
        deviceFound={deviceFound}
        getScannedWifiConnections={getScannedWifiConnections}
        getSingleWifiConnection={getSingleWifiConnection}
        pageStep={pageStep}
        startScan={startScan}
        stopScan={stopScan}
        user={user}
    />
);

SensorFilesPage.propTypes = {
    bluetooth:                 PropTypes.shape({}).isRequired,
    deviceFound:               PropTypes.func.isRequired,
    getScannedWifiConnections: PropTypes.func.isRequired,
    getSingleWifiConnection:   PropTypes.func.isRequired,
    pageStep:                  PropTypes.string.isRequired,
    startScan:                 PropTypes.func.isRequired,
    stopScan:                  PropTypes.func.isRequired,
    user:                      PropTypes.shape({}).isRequired,
};

SensorFilesPage.defaultProps = {};

const mapStateToProps = (state, props) => ({
    bluetooth: state.ble,
    pageStep:  props.pageStep,
    user:      state.user,
});

const mapDispatchToProps = {
    deviceFound:               BluetoothActions.deviceFound,
    getScannedWifiConnections: BluetoothActions.getScannedWifiConnections,
    getSingleWifiConnection:   BluetoothActions.getSingleWifiConnection,
    startScan:                 BluetoothActions.startScan,
    stopScan:                  BluetoothActions.stopScan,
};

export default connect(mapStateToProps, mapDispatchToProps)(SensorFilesPage);