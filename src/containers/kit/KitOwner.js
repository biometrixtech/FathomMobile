/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:49 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-23 20:43:35
 */

/**
 * Kit Owner Screen Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Actions
import BluetoothActions from '../../actions/bluetooth';

const KitOwner = ({
    Layout,
    assignKitName,
    getKitName,
    assignType,
    storeParams,
    loginToAccessory,
    setKitTime,
    startConnect,
    stopConnect,
    setOwnerFlag,
    getOwnerFlag,
    user,
    bluetooth
}) => (
    <Layout
        assignKitName={assignKitName}
        getKitName={getKitName}
        assignType={assignType}
        storeParams={storeParams}
        loginToAccessory={loginToAccessory}
        setKitTime={setKitTime}
        startConnect={startConnect}
        stopConnect={stopConnect}
        setOwnerFlag={setOwnerFlag}
        getOwnerFlag={getOwnerFlag}
        user={user}
        bluetooth={bluetooth}
    />
);

KitOwner.propTypes = {
    Layout:           PropTypes.func.isRequired,
    assignKitName:    PropTypes.func.isRequired,
    getKitName:       PropTypes.func.isRequired,
    assignType:       PropTypes.func.isRequired,
    storeParams:      PropTypes.func.isRequired,
    loginToAccessory: PropTypes.func.isRequired,
    setKitTime:       PropTypes.func.isRequired,
    startConnect:     PropTypes.func.isRequired,
    stopConnect:      PropTypes.func.isRequired,
    setOwnerFlag:     PropTypes.func.isRequired,
    getOwnerFlag:     PropTypes.func.isRequired,
    user:             PropTypes.shape({}).isRequired,
    bluetooth:        PropTypes.shape({}).isRequired,
};

KitOwner.defaultProps = {
    user:      {},
    bluetooth: {},
};

const mapStateToProps = state => ({
    user:      state.user || {},
    bluetooth: state.bluetooth || {},
});

const mapDispatchToProps = {
    assignKitName:    BluetoothActions.assignKitName,
    getKitName:       BluetoothActions.getKitName,
    assignType:       BluetoothActions.assignType,
    storeParams:      BluetoothActions.storeParams,
    loginToAccessory: BluetoothActions.loginToAccessory,
    setKitTime:       BluetoothActions.setKitTime,
    startConnect:     BluetoothActions.startConnect,
    stopConnect:      BluetoothActions.stopConnect,
    setOwnerFlag:     BluetoothActions.setOwnerFlag,
    getOwnerFlag:     BluetoothActions.getOwnerFlag,
};

export default connect(mapStateToProps, mapDispatchToProps)(KitOwner);
