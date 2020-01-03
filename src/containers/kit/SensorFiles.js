/**
 * Sensor Files Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

// Actions
import { ble as BluetoothActions, user as UserActions, } from '../../actions';

const SensorFiles = ({
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

SensorFiles.propTypes = {
    assignKitIndividual: PropTypes.func.isRequired,
    getSensorFiles:      PropTypes.func.isRequired,
    updateUser:          PropTypes.func.isRequired,
    user:                PropTypes.shape({}).isRequired,
};

SensorFiles.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SensorFiles);