import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { init } from '../../actions';

const Start = ({
    Layout,
    authorizeUser,
    certificate,
    email,
    environment,
    finalizeLogin,
    onFormSubmit,
    password,
    registerDevice,
}) => (
    <Layout
        authorizeUser={authorizeUser}
        certificate={certificate}
        email={email}
        environment={environment}
        finalizeLogin={finalizeLogin}
        onFormSubmit={onFormSubmit}
        password={password}
        registerDevice={registerDevice}
    />
);

Start.propTypes = {
    Layout:         PropTypes.func.isRequired,
    authorizeUser:  PropTypes.func.isRequired,
    certificate:    PropTypes.object,
    email:          PropTypes.string,
    environment:    PropTypes.string,
    finalizeLogin:  PropTypes.func.isRequired,
    onFormSubmit:   PropTypes.func.isRequired,
    password:       PropTypes.string,
    registerDevice: PropTypes.func.isRequired,
};

Start.defaultProps = {
    certificate: null,
    environment: 'PROD',
    email:       null,
    password:    null,
};

const mapStateToProps = state => ({
    certificate: state.init.certificate || null,
    environment: state.init.environment || 'PROD',
    email:       state.init.email || null,
    password:    state.init.password || null,
});

const mapDispatchToProps = {
    authorizeUser:  init.authorizeUser,
    finalizeLogin:  init.finalizeLogin,
    onFormSubmit:   init.startLogin,
    registerDevice: init.registerDevice,
};

export default connect(mapStateToProps, mapDispatchToProps)(Start);
