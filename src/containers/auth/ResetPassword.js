/**
 * Reset Password Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { init } from '../../actions';

const ResetPassword = ({
    Layout,
    authorizeUser,
    finalizeLogin,
    onFormSubmit,
    onSubmitSuccess,
    email,
    newPassword,
    confirmPassword,
    registerDevice,
    setEnvironment,
    verificationCode,
    loading,
}) => (
    <Layout
        authorizeUser={authorizeUser}
        finalizeLogin={finalizeLogin}
        onFormSubmit={onFormSubmit}
        onSubmitSuccess={onSubmitSuccess}
        email={email}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        registerDevice={registerDevice}
        setEnvironment={setEnvironment}
        verificationCode={verificationCode}
        loading={loading}
    />
);

ResetPassword.propTypes = {
    Layout:           PropTypes.func.isRequired,
    authorizeUser:    PropTypes.func.isRequired,
    confirmPassword:  PropTypes.string,
    email:            PropTypes.string,
    finalizeLogin:    PropTypes.func.isRequired,
    loading:          PropTypes.bool,
    newPassword:      PropTypes.string,
    onFormSubmit:     PropTypes.func.isRequired,
    onSubmitSuccess:  PropTypes.func.isRequired,
    registerDevice:   PropTypes.func.isRequired,
    setEnvironment:   PropTypes.func.isRequired,
    verificationCode: PropTypes.string,

};

ResetPassword.defaultProps = {
    email:            null,
    confirmPassword:  null,
    loading:          false,
    newPassword:      null,
    verificationCode: null,

};

const mapStateToProps = state => ({
    email:            state.init.email,
    confirmPassword:  state.init.confirmPassword,
    loading:          state.user.loading || false,
    newPassword:      state.init.newPassword,
    verificationCode: state.init.verificationCode,
});

const mapDispatchToProps = {
    authorizeUser:   init.authorizeUser,
    finalizeLogin:   init.finalizeLogin,
    onFormSubmit:    init.resetPassword,
    onSubmitSuccess: init.startLogin,
    registerDevice:  init.registerDevice,
    setEnvironment:  init.setEnvironment,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
