import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { init } from '../../actions/';

const Onboarding = ({
    Layout,
    finalizeLogin,
    registerDevice,
    signUpUser,
}) => (
    <Layout
        finalizeLogin={finalizeLogin}
        registerDevice={registerDevice}
        signUpUser={signUpUser}
    />
);

Onboarding.propTypes = {
    Layout:         PropTypes.func.isRequired,
    finalizeLogin:  PropTypes.func.isRequired,
    registerDevice: PropTypes.func.isRequired,
    signUpUser:     PropTypes.func.isRequired,
};

Onboarding.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    finalizeLogin:  init.finalizeLogin,
    registerDevice: init.registerDevice,
    signUpUser:     init.signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
