/**
 * Reset Password Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ble, init } from '../../actions';

const ResetPassword = ({
    Layout,
    authorizeUser,
    finalizeLogin,
    getUserSensorData,
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
        getUserSensorData={getUserSensorData}
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
    finalizeLogin:    PropTypes.func.isRequired,
    onFormSubmit:     PropTypes.func.isRequired,
    onSubmitSuccess:  PropTypes.func.isRequired,
    email:            PropTypes.string,
    newPassword:      PropTypes.string,
    confirmPassword:  PropTypes.string,
    registerDevice:   PropTypes.func.isRequired,
    setEnvironment:   PropTypes.func.isRequired,
    verificationCode: PropTypes.string,
    loading:          PropTypes.bool,
};

ResetPassword.defaultProps = {
    email:            null,
    newPassword:      null,
    confirmPassword:  null,
    verificationCode: null,
    loading:          false,
};

const mapStateToProps = state => ({
    email:            state.init.email,
    newPassword:      state.init.newPassword,
    confirmPassword:  state.init.confirmPassword,
    verificationCode: state.init.verificationCode,
    loading:          state.user.loading || false,
});

const mapDispatchToProps = {
    authorizeUser:     init.authorizeUser,
    finalizeLogin:     init.finalizeLogin,
    getUserSensorData: ble.getUserSensorData,
    onFormSubmit:      init.resetPassword,
    onSubmitSuccess:   init.startLogin,
    registerDevice:    init.registerDevice,
    setEnvironment:    init.setEnvironment,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
