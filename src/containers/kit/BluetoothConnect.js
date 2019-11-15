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
    getSensorFiles,
    updateUser,
    user,
}) => (
    <Layout
        assignKitIndividual={assignKitIndividual}
        getSensorFiles={getSensorFiles}
        updateUser={updateUser}
        user={user}
    />
);

BluetoothConnect.propTypes = {
    Layout:              PropTypes.func.isRequired,
    assignKitIndividual: PropTypes.func.isRequired,
    getSensorFiles:      PropTypes.func.isRequired,
    updateUser:          PropTypes.func.isRequired,
    user:                PropTypes.shape({}).isRequired,
};

BluetoothConnect.defaultProps = {
    user: {},
};

const mapStateToProps = state => ({
    user: state.user || {},
});

const mapDispatchToProps = {
    assignKitIndividual: BluetoothActions.assignKitIndividual,
    getSensorFiles:      BluetoothActions.getSensorFiles,
    updateUser:          UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothConnect);