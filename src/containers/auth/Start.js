import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { ble, init, plan as PlanActions, user as UserActions, } from '../../actions';

const Start = ({
    Layout,
    authorizeUser,
    certificate,
    device,
    email,
    environment,
    expires,
    finalizeLogin,
    getMyPlan,
    getSensorFiles,
    getUser,
    jwt,
    lastOpened,
    network,
    onFormSubmit,
    password,
    registerDevice,
    scheduledMaintenance,
    sessionToken,
    setAppLogs,
    user,
}) => (
    <Layout
        authorizeUser={authorizeUser}
        certificate={certificate}
        device={device}
        email={email}
        environment={environment}
        expires={expires}
        finalizeLogin={finalizeLogin}
        getMyPlan={getMyPlan}
        getSensorFiles={getSensorFiles}
        getUser={getUser}
        jwt={jwt}
        lastOpened={lastOpened}
        network={network}
        onFormSubmit={onFormSubmit}
        password={password}
        registerDevice={registerDevice}
        scheduledMaintenance={scheduledMaintenance}
        sessionToken={sessionToken}
        setAppLogs={setAppLogs}
        user={user}
    />
);

Start.propTypes = {
    Layout:               PropTypes.func.isRequired,
    authorizeUser:        PropTypes.func.isRequired,
    certificate:          PropTypes.object,
    device:               PropTypes.object,
    email:                PropTypes.string,
    environment:          PropTypes.string,
    expires:              PropTypes.string,
    finalizeLogin:        PropTypes.func.isRequired,
    getMyPlan:            PropTypes.func.isRequired,
    getSensorFiles:       PropTypes.func.isRequired,
    getUser:              PropTypes.func.isRequired,
    jwt:                  PropTypes.string,
    lastOpened:           PropTypes.object.isRequired,
    network:              PropTypes.object.isRequired,
    onFormSubmit:         PropTypes.func.isRequired,
    password:             PropTypes.string,
    registerDevice:       PropTypes.func.isRequired,
    scheduledMaintenance: PropTypes.object,
    sessionToken:         PropTypes.string,
    setAppLogs:           PropTypes.func.isRequired,
    user:                 PropTypes.object.isRequired,
};

Start.defaultProps = {
    certificate:          null,
    device:               null,
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
    device:               state.init.device || null,
    environment:          state.init.environment || 'PROD',
    email:                state.init.email || null,
    expires:              state.init.expires || null,
    jwt:                  state.init.jwt || null,
    lastOpened:           state.plan.lastOpened,
    network:              state.network,
    password:             state.init.password || null,
    scheduledMaintenance: state.init.scheduledMaintenance || null,
    sessionToken:         state.init.session_token || null,
    user:                 state.user,
});

const mapDispatchToProps = {
    authorizeUser:  init.authorizeUser,
    finalizeLogin:  init.finalizeLogin,
    getMyPlan:      PlanActions.getMyPlan,
    getSensorFiles: ble.getSensorFiles,
    getUser:        UserActions.getUser,
    onFormSubmit:   init.startLogin,
    registerDevice: init.registerDevice,
    setAppLogs:     PlanActions.setAppLogs,
};

export default connect(mapStateToProps, mapDispatchToProps)(Start);
