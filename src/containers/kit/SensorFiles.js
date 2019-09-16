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
    getSensorFiles,
    updateUser,
    user,
}) => (
    <Layout
        getSensorFiles={getSensorFiles}
        updateUser={updateUser}
        user={user}
    />
);

SensorFiles.propTypes = {
    getSensorFiles: PropTypes.func.isRequired,
    updateUser:     PropTypes.func.isRequired,
    user:           PropTypes.shape({}).isRequired,
};

SensorFiles.defaultProps = {
    user: {},
};

const mapStateToProps = state => ({
    user: state.user || {},
});

const mapDispatchToProps = {
    getSensorFiles: BluetoothActions.getSensorFiles,
    updateUser:     UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SensorFiles);