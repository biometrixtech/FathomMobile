import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ble, init, } from '../../actions';

const Start = ({
    Layout,
    authorizeUser,
    certificate,
    email,
    environment,
    finalizeLogin,
    jwt,
    getUserSensorData,
    onFormSubmit,
    password,
    registerDevice,
    user,
}) => (
    <Layout
        authorizeUser={authorizeUser}
        certificate={certificate}
        email={email}
        environment={environment}
        finalizeLogin={finalizeLogin}
        jwt={jwt}
        getUserSensorData={getUserSensorData}
        onFormSubmit={onFormSubmit}
        password={password}
        registerDevice={registerDevice}
        user={user}
    />
);

Start.propTypes = {
    Layout:            PropTypes.func.isRequired,
    authorizeUser:     PropTypes.func.isRequired,
    certificate:       PropTypes.object,
    email:             PropTypes.string,
    environment:       PropTypes.string,
    finalizeLogin:     PropTypes.func.isRequired,
    getUserSensorData: PropTypes.func.isRequired,
    jwt:               PropTypes.string,
    onFormSubmit:      PropTypes.func.isRequired,
    password:          PropTypes.string,
    registerDevice:    PropTypes.func.isRequired,
    user:              PropTypes.object.isRequired,
};

Start.defaultProps = {
    certificate: null,
    environment: 'PROD',
    email:       null,
    jwt:         null,
    password:    null,
};

const mapStateToProps = state => ({
    certificate: state.init.certificate || null,
    environment: state.init.environment || 'PROD',
    email:       state.init.email || null,
    jwt:         state.init.jwt || null,
    password:    state.init.password || null,
    user:        state.user,
});

const mapDispatchToProps = {
    authorizeUser:     init.authorizeUser,
    finalizeLogin:     init.finalizeLogin,
    getUserSensorData: ble.getUserSensorData,
    onFormSubmit:      init.startLogin,
    registerDevice:    init.registerDevice,
};

export default connect(mapStateToProps, mapDispatchToProps)(Start);
