import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ble as BLEActions, init as InitActions, user as UserActions, } from '../../actions';

const Onboarding = ({
    Layout,
    authorizeUser,
    createUser,
    finalizeLogin,
    getUserSensorData,
    network,
    onFormSubmit,
    registerDevice,
    updateUser,
    user,
}) => (
    <Layout
        authorizeUser={authorizeUser}
        createUser={createUser}
        finalizeLogin={finalizeLogin}
        getUserSensorData={getUserSensorData}
        network={network}
        onFormSubmit={onFormSubmit}
        registerDevice={registerDevice}
        updateUser={updateUser}
        user={user}
    />
);

Onboarding.propTypes = {
    Layout:            PropTypes.func.isRequired,
    authorizeUser:     PropTypes.func.isRequired,
    createUser:        PropTypes.func.isRequired,
    finalizeLogin:     PropTypes.func.isRequired,
    getUserSensorData: PropTypes.func.isRequired,
    network:           PropTypes.object.isRequired,
    onFormSubmit:      PropTypes.func.isRequired,
    registerDevice:    PropTypes.func.isRequired,
    updateUser:        PropTypes.func.isRequired,
    user:              PropTypes.object.isRequired,
};

Onboarding.defaultProps = {};

const mapStateToProps = state => ({
    network: state.network,
    user:    state.user,
});

const mapDispatchToProps = {
    authorizeUser:     InitActions.authorizeUser,
    createUser:        UserActions.createUser,
    finalizeLogin:     InitActions.finalizeLogin,
    getUserSensorData: BLEActions.getUserSensorData,
    onFormSubmit:      InitActions.startLogin,
    registerDevice:    InitActions.registerDevice,
    updateUser:        UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
