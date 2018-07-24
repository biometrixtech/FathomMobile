/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:34:56
 * @Last Modified by: Mazen Chami
 * @Last Modified time: 2018-07-23 11:56:00
 */

/**
 * Kit Management Screen Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Actions
import BluetoothActions from '../../actions/ble';

const KitManagement = ({
    Layout,
    bluetooth,
    connectToAccessory,
    connectWiFi,
    disconnect,
    handleDisconnect,
    readSSID,
    resetAccessory,
    scanWiFi,
    setAnonymousIdentity,
    setEAPType,
    setGyroCalibration,
    setIdentity,
    setWiFiPassword,
    setWiFiSSID,
    startConnect,
    stopConnect,
    user,
}) => (
    <Layout
        bluetooth={bluetooth}
        connectToAccessory={connectToAccessory}
        connectWiFi={connectWiFi}
        disconnect={disconnect}
        handleDisconnect={handleDisconnect}
        readSSID={readSSID}
        resetAccessory={resetAccessory}
        scanWiFi={scanWiFi}
        setAnonymousIdentity={setAnonymousIdentity}
        setEAPType={setEAPType}
        setGyroCalibration={setGyroCalibration}
        setIdentity={setIdentity}
        setWiFiPassword={setWiFiPassword}
        setWiFiSSID={setWiFiSSID}
        startConnect={startConnect}
        stopConnect={stopConnect}
        user={user}
    />
);

KitManagement.propTypes = {
    Layout:               PropTypes.func.isRequired,
    bluetooth:            PropTypes.shape({}).isRequired,
    connectToAccessory:   PropTypes.func.isRequired,
    connectWiFi:          PropTypes.func.isRequired,
    disconnect:           PropTypes.func.isRequired,
    handleDisconnect:     PropTypes.func.isRequired,
    readSSID:             PropTypes.func.isRequired,
    resetAccessory:       PropTypes.func.isRequired,
    scanWiFi:             PropTypes.func.isRequired,
    setAnonymousIdentity: PropTypes.func.isRequired,
    setEAPType:           PropTypes.func.isRequired,
    setGyroCalibration:   PropTypes.func.isRequired,
    setIdentity:          PropTypes.func.isRequired,
    setWiFiPassword:      PropTypes.func.isRequired,
    setWiFiSSID:          PropTypes.func.isRequired,
    startConnect:         PropTypes.func.isRequired,
    stopConnect:          PropTypes.func.isRequired,
    user:                 PropTypes.shape({}).isRequired,
};

KitManagement.defaultProps = {
    bluetooth: {},
    user:      {},
};

const mapStateToProps = state => ({
    bluetooth: state.ble || {},
    user:      state.user || {},
});

const mapDispatchToProps = {
    connectToAccessory:   BluetoothActions.connectToAccessory,
    connectWiFi:          BluetoothActions.connectWiFi,
    disconnect:           BluetoothActions.disconnect,
    handleDisconnect:     BluetoothActions.handleDisconnect,
    readSSID:             BluetoothActions.readSSID,
    resetAccessory:       BluetoothActions.resetAccessory,
    scanWiFi:             BluetoothActions.scanWiFi,
    setAnonymousIdentity: BluetoothActions.setAnonymousIdentity,
    setEAPType:           BluetoothActions.setEAPType,
    setGyroCalibration:   BluetoothActions.setGyroCalibration,
    setIdentity:          BluetoothActions.setIdentity,
    setWiFiPassword:      BluetoothActions.setWiFiPassword,
    setWiFiSSID:          BluetoothActions.setWiFiSSID,
    startConnect:         BluetoothActions.startConnect,
    stopConnect:          BluetoothActions.stopConnect,
};

export default connect(mapStateToProps, mapDispatchToProps)(KitManagement);
