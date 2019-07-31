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
    bluetooth,
    getSensorFiles,
    pageStep,
    updateUser,
    user,
}) => (
    <Layout
        assignKitIndividual={assignKitIndividual}
        bluetooth={bluetooth}
        getSensorFiles={getSensorFiles}
        pageStep={pageStep}
        updateUser={updateUser}
        user={user}
    />
);

SensorFilesPage.propTypes = {
    assignKitIndividual: PropTypes.func.isRequired,
    bluetooth:           PropTypes.shape({}).isRequired,
    getSensorFiles:      PropTypes.func.isRequired,
    pageStep:            PropTypes.string.isRequired,
    updateUser:          PropTypes.func.isRequired,
    user:                PropTypes.shape({}).isRequired,
};

SensorFilesPage.defaultProps = {};

const mapStateToProps = (state, props) => ({
    bluetooth: state.ble,
    pageStep:  props.pageStep,
    user:      state.user,
});

const mapDispatchToProps = {
    assignKitIndividual: BluetoothActions.assignKitIndividual,
    getSensorFiles:      BluetoothActions.getSensorFiles,
    updateUser:          UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SensorFilesPage);