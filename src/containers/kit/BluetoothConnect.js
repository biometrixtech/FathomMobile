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
    getSensorFiles,
    network,
    updateUser,
    user,
}) => (
    <Layout
        assignKitIndividual={assignKitIndividual}
        bluetooth={bluetooth}
        getSensorFiles={getSensorFiles}
        network={network}
        updateUser={updateUser}
        user={user}
    />
);

BluetoothConnect.propTypes = {
    Layout:              PropTypes.func.isRequired,
    assignKitIndividual: PropTypes.func.isRequired,
    bluetooth:           PropTypes.shape({}).isRequired,
    getSensorFiles:      PropTypes.func.isRequired,
    network:             PropTypes.object.isRequired,
    updateUser:          PropTypes.func.isRequired,
    user:                PropTypes.shape({}).isRequired,
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
    assignKitIndividual: BluetoothActions.assignKitIndividual,
    getSensorFiles:      BluetoothActions.getSensorFiles,
    updateUser:          UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothConnect);