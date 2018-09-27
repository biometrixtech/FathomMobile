import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ble, init, user as UserActions } from '../../actions';

const Start = ({
    Layout,
    authorizeUser,
    certificate,
    email,
    environment,
    expires,
    finalizeLogin,
    getUser,
    getUserSensorData,
    jwt,
    network,
    onFormSubmit,
    password,
    registerDevice,
    scheduledMaintenance,
    sessionToken,
    user,
}) => (
    <Layout
        authorizeUser={authorizeUser}
        certificate={certificate}
        email={email}
        environment={environment}
        expires={expires}
        finalizeLogin={finalizeLogin}
        getUser={getUser}
        getUserSensorData={getUserSensorData}
        jwt={jwt}
        network={network}
        onFormSubmit={onFormSubmit}
        password={password}
        registerDevice={registerDevice}
        scheduledMaintenance={scheduledMaintenance}
        sessionToken={sessionToken}
        user={user}
    />
);

Start.propTypes = {
    Layout:               PropTypes.func.isRequired,
    authorizeUser:        PropTypes.func.isRequired,
    certificate:          PropTypes.object,
    email:                PropTypes.string,
    environment:          PropTypes.string,
    expires:              PropTypes.string,
    finalizeLogin:        PropTypes.func.isRequired,
    getUser:              PropTypes.func.isRequired,
    getUserSensorData:    PropTypes.func.isRequired,
    jwt:                  PropTypes.string,
    network:              PropTypes.object.isRequired,
    onFormSubmit:         PropTypes.func.isRequired,
    password:             PropTypes.string,
    registerDevice:       PropTypes.func.isRequired,
    scheduledMaintenance: PropTypes.object,
    sessionToken:         PropTypes.string,
    user:                 PropTypes.object.isRequired,
};

Start.defaultProps = {
    certificate:          null,
    environment:          'PROD',
    email:                null,
    expires:              null,
    jwt:                  null,
    password:             null,
    scheduledMaintenance: null,
    sessionToken:         null,
};

const mapStateToProps = state => ({
    certificate:          state.init.certificate || null,
    environment:          state.init.environment || 'PROD',
    email:                state.init.email || null,
    expires:              state.init.expires || null,
    jwt:                  state.init.jwt || null,
    network:              state.network,
    password:             state.init.password || null,
    scheduledMaintenance: state.init.scheduledMaintenance || null,
    sessionToken:         state.init.session_token || null,
    user:                 state.user,
});

const mapDispatchToProps = {
    authorizeUser:     init.authorizeUser,
    finalizeLogin:     init.finalizeLogin,
    getUser:           UserActions.getUser,
    getUserSensorData: ble.getUserSensorData,
    onFormSubmit:      init.startLogin,
    registerDevice:    init.registerDevice,
};

export default connect(mapStateToProps, mapDispatchToProps)(Start);
