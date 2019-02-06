/*
 * @Author: Vir Desai
 * @Date: 2018-04-30 13:23:45
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 18:43:40
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { init, plan as PlanActions, } from '../../actions';

const Login = ({
    Layout,
    authorizeUser,
    certificate,
    device,
    email,
    environment,
    finalizeLogin,
    getMyPlan,
    lastOpened,
    network,
    onFormSubmit,
    password,
    registerDevice,
    scheduledMaintenance,
    setAppLogs,
    setEnvironment,
    token,
    user,
}) => (
    <Layout
        authorizeUser={authorizeUser}
        certificate={certificate}
        device={device}
        email={email}
        environment={environment}
        finalizeLogin={finalizeLogin}
        getMyPlan={getMyPlan}
        lastOpened={lastOpened}
        network={network}
        onFormSubmit={onFormSubmit}
        password={password}
        registerDevice={registerDevice}
        scheduledMaintenance={scheduledMaintenance}
        setAppLogs={setAppLogs}
        setEnvironment={setEnvironment}
        token={token}
        user={user}
    />
);

Login.propTypes = {
    Layout:               PropTypes.func.isRequired,
    authorizeUser:        PropTypes.func.isRequired,
    certificate:          PropTypes.object,
    device:               PropTypes.object,
    email:                PropTypes.string,
    environment:          PropTypes.string,
    finalizeLogin:        PropTypes.func.isRequired,
    getMyPlan:            PropTypes.func.isRequired,
    lastOpened:           PropTypes.object.isRequired,
    network:              PropTypes.object.isRequired,
    onFormSubmit:         PropTypes.func.isRequired,
    password:             PropTypes.string,
    registerDevice:       PropTypes.func.isRequired,
    scheduledMaintenance: PropTypes.object,
    setAppLogs:           PropTypes.func.isRequired,
    setEnvironment:       PropTypes.func.isRequired,
    token:                PropTypes.string,
    user:                 PropTypes.object.isRequired,
};

Login.defaultProps = {
    certificate:          null,
    device:               null,
    environment:          'PROD',
    email:                null,
    password:             null,
    scheduledMaintenance: null,
    token:                null,
};

const mapStateToProps = state => ({
    certificate:          state.init.certificate || null,
    device:               state.init.device || null,
    environment:          state.init.environment || 'PROD',
    email:                state.init.email || null,
    lastOpened:           state.plan.lastOpened,
    network:              state.network,
    password:             state.init.password || null,
    scheduledMaintenance: state.init.scheduledMaintenance || null,
    token:                state.init.token || null,
    user:                 state.user,
});

const mapDispatchToProps = {
    authorizeUser:  init.authorizeUser,
    finalizeLogin:  init.finalizeLogin,
    getMyPlan:      PlanActions.getMyPlan,
    onFormSubmit:   init.startLogin,
    registerDevice: init.registerDevice,
    setAppLogs:     PlanActions.setAppLogs,
    setEnvironment: init.setEnvironment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
