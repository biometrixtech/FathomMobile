/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:56 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-24 01:27:42
 */

/**
 * Kit Management Screen Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Actions
import BluetoothActions from '../../actions/bluetooth';

const KitManagement = ({
    Layout,
    connectToAccessory,
    scanWiFi,
    setWiFiSSID,
    setWiFiPassword,
    connectWiFi,
    readSSID,
    handleDisconnect,
    startConnect,
    stopConnect,
    disconnect,
    setIdentity,
    setAnonymousIdentity,
    setEAPType,
    setGyroCalibration,
    resetAccessory,
    user,
    bluetooth
}) => (
    <Layout
        connectToAccessory={connectToAccessory}
        scanWiFi={scanWiFi}
        setWiFiSSID={setWiFiSSID}
        setWiFiPassword={setWiFiPassword}
        connectWiFi={connectWiFi}
        readSSID={readSSID}
        handleDisconnect={handleDisconnect}
        startConnect={startConnect}
        stopConnect={stopConnect}
        disconnect={disconnect}
        setIdentity={setIdentity}
        setAnonymousIdentity={setAnonymousIdentity}
        setEAPType={setEAPType}
        setGyroCalibration={setGyroCalibration}
        resetAccessory={resetAccessory}
        user={user}
        bluetooth={bluetooth}
    />
);

KitManagement.propTypes = {
    Layout:               PropTypes.func.isRequired,
    connectToAccessory:   PropTypes.func.isRequired,
    scanWiFi:             PropTypes.func.isRequired,
    setWiFiSSID:          PropTypes.func.isRequired,
    setWiFiPassword:      PropTypes.func.isRequired,
    connectWiFi:          PropTypes.func.isRequired,
    readSSID:             PropTypes.func.isRequired,
    handleDisconnect:     PropTypes.func.isRequired,
    startConnect:         PropTypes.func.isRequired,
    stopConnect:          PropTypes.func.isRequired,
    disconnect:           PropTypes.func.isRequired,
    setIdentity:          PropTypes.func.isRequired,
    setAnonymousIdentity: PropTypes.func.isRequired,
    setEAPType:           PropTypes.func.isRequired,
    setGyroCalibration:   PropTypes.func.isRequired,
    resetAccessory:       PropTypes.func.isRequired,
    user:                 PropTypes.shape({}).isRequired,
    bluetooth:            PropTypes.shape({}).isRequired,
};

KitManagement.defaultProps = {
    user:      {},
    bluetooth: {},
};

const mapStateToProps = state => ({
    user:      state.user || {},
    bluetooth: state.bluetooth || {},
});

const mapDispatchToProps = {
    scanWiFi:             BluetoothActions.scanWiFi,
    setWiFiSSID:          BluetoothActions.setWiFiSSID,
    setWiFiPassword:      BluetoothActions.setWiFiPassword,
    connectWiFi:          BluetoothActions.connectWiFi,
    readSSID:             BluetoothActions.readSSID,
    handleDisconnect:     BluetoothActions.handleDisconnect,
    connectToAccessory:   BluetoothActions.connectToAccessory,
    startConnect:         BluetoothActions.startConnect,
    stopConnect:          BluetoothActions.stopConnect,
    disconnect:           BluetoothActions.disconnect,
    setIdentity:          BluetoothActions.setIdentity,
    setAnonymousIdentity: BluetoothActions.setAnonymousIdentity,
    setEAPType:           BluetoothActions.setEAPType,
    setGyroCalibration:   BluetoothActions.setGyroCalibration,
    resetAccessory:       BluetoothActions.resetAccessory,
};

export default connect(mapStateToProps, mapDispatchToProps)(KitManagement);
