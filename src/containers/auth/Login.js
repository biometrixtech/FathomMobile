/*
 * @Author: Vir Desai
 * @Date: 2018-04-30 13:23:45
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 18:43:40
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { init, } from '../../actions';

const Login = ({
    Layout,
    authorizeUser,
    certificate,
    device,
    email,
    environment,
    finalizeLogin,
    network,
    onFormSubmit,
    password,
    registerDevice,
    scheduledMaintenance,
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
        network={network}
        onFormSubmit={onFormSubmit}
        password={password}
        registerDevice={registerDevice}
        scheduledMaintenance={scheduledMaintenance}
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
    network:              PropTypes.object.isRequired,
    onFormSubmit:         PropTypes.func.isRequired,
    password:             PropTypes.string,
    registerDevice:       PropTypes.func.isRequired,
    scheduledMaintenance: PropTypes.object,
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
    network:              state.network,
    password:             state.init.password || null,
    scheduledMaintenance: state.init.scheduledMaintenance || null,
    token:                state.init.token || null,
    user:                 state.user,
});

const mapDispatchToProps = {
    authorizeUser:  init.authorizeUser,
    finalizeLogin:  init.finalizeLogin,
    onFormSubmit:   init.startLogin,
    registerDevice: init.registerDevice,
    setEnvironment: init.setEnvironment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
