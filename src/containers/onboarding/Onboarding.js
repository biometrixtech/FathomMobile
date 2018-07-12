import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { init, plan, } from '../../actions/';

const Onboarding = ({
    Layout,
    athleteSeason,
    finalizeLogin,
    registerDevice,
    signUpUser,
}) => (
    <Layout
        athleteSeason={athleteSeason}
        finalizeLogin={finalizeLogin}
        registerDevice={registerDevice}
        signUpUser={signUpUser}
    />
);

Onboarding.propTypes = {
    Layout:         PropTypes.func.isRequired,
    athleteSeason:  PropTypes.func.isRequired,
    finalizeLogin:  PropTypes.func.isRequired,
    registerDevice: PropTypes.func.isRequired,
    signUpUser:     PropTypes.func.isRequired,
};

Onboarding.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    athleteSeason:  plan.athleteSeason,
    finalizeLogin:  init.finalizeLogin,
    registerDevice: init.registerDevice,
    signUpUser:     init.signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
