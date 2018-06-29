import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Onboarding = ({
    Layout,
    // authorizeUser,
    // certificate,
    // email,
    // environment,
    // finalizeLogin,
    // loading,
    // onFormSubmit,
    // password,
    // registerDevice,
    // setEnvironment,
}) => (
    <Layout
        // authorizeUser={authorizeUser}
        // certificate={certificate}
        // email={email}
        // environment={environment}
        // finalizeLogin={finalizeLogin}
        // loading={loading}
        // onFormSubmit={onFormSubmit}
        // password={password}
        // registerDevice={registerDevice}
        // setEnvironment={setEnvironment}
    />
);

Onboarding.propTypes = {
    Layout:         PropTypes.func.isRequired,
    // authorizeUser:  PropTypes.func.isRequired,
    // certificate:    PropTypes.object,
    // email:          PropTypes.string,
    // environment:    PropTypes.string,
    // finalizeLogin:  PropTypes.func.isRequired,
    // loading:        PropTypes.bool,
    // onFormSubmit:   PropTypes.func.isRequired,
    // password:       PropTypes.string,
    // registerDevice: PropTypes.func.isRequired,
    // setEnvironment: PropTypes.func.isRequired,
};

Onboarding.defaultProps = {
    // certificate: null,
    // environment: 'PROD',
    // email:       null,
    // password:    null,
    // loading:     false,
};

const mapStateToProps = state => ({
    // certificate: state.init.certificate || null,
    // environment: state.init.environment || 'PROD',
    // email:       state.init.email || null,
    // loading:     state.user.loading || false,
    // password:    state.init.password || null,
});

const mapDispatchToProps = {
    // authorizeUser:  init.authorizeUser,
    // finalizeLogin:  init.finalizeLogin,
    // onFormSubmit:   init.startLogin,
    // registerDevice: init.registerDevice,
    // setEnvironment: init.setEnvironment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
