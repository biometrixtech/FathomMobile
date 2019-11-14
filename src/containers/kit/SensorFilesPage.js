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
    getSensorFiles,
    pageStep,
    updateUser,
    user,
}) => (
    <Layout
        assignKitIndividual={assignKitIndividual}
        getSensorFiles={getSensorFiles}
        pageStep={pageStep}
        updateUser={updateUser}
        user={user}
    />
);

SensorFilesPage.propTypes = {
    assignKitIndividual: PropTypes.func.isRequired,
    getSensorFiles:      PropTypes.func.isRequired,
    pageStep:            PropTypes.string.isRequired,
    updateUser:          PropTypes.func.isRequired,
    user:                PropTypes.shape({}).isRequired,
};

SensorFilesPage.defaultProps = {};

const mapStateToProps = (state, props) => ({
    pageStep: props.pageStep,
    user:     state.user,
});

const mapDispatchToProps = {
    assignKitIndividual: BluetoothActions.assignKitIndividual,
    getSensorFiles:      BluetoothActions.getSensorFiles,
    updateUser:          UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SensorFilesPage);