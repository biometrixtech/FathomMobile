/**
 * Reset Password Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { init, plan as PlanActions, } from '../../actions';

const ResetPassword = ({
    Layout,
    certificate,
    confirmPassword,
    device,
    email,
    finalizeLogin,
    getMyPlan,
    lastOpened,
    newPassword,
    onFormSubmit,
    onSubmitSuccess,
    registerDevice,
    setAppLogs,
    setEnvironment,
    verificationCode,
}) => (
    <Layout
        certificate={certificate}
        confirmPassword={confirmPassword}
        device={device}
        email={email}
        finalizeLogin={finalizeLogin}
        getMyPlan={getMyPlan}
        lastOpened={lastOpened}
        newPassword={newPassword}
        onFormSubmit={onFormSubmit}
        onSubmitSuccess={onSubmitSuccess}
        registerDevice={registerDevice}
        setAppLogs={setAppLogs}
        setEnvironment={setEnvironment}
        verificationCode={verificationCode}
    />
);

ResetPassword.propTypes = {
    Layout:           PropTypes.func.isRequired,
    certificate:      PropTypes.object,
    confirmPassword:  PropTypes.string,
    device:           PropTypes.object,
    email:            PropTypes.string,
    finalizeLogin:    PropTypes.func.isRequired,
    getMyPlan:        PropTypes.func.isRequired,
    lastOpened:       PropTypes.object.isRequired,
    newPassword:      PropTypes.string,
    onFormSubmit:     PropTypes.func.isRequired,
    onSubmitSuccess:  PropTypes.func.isRequired,
    registerDevice:   PropTypes.func.isRequired,
    setAppLogs:       PropTypes.func.isRequired,
    setEnvironment:   PropTypes.func.isRequired,
    verificationCode: PropTypes.string,
};

ResetPassword.defaultProps = {
    certificate:      null,
    confirmPassword:  null,
    device:           null,
    email:            null,
    newPassword:      null,
    verificationCode: null,
};

const mapStateToProps = state => ({
    certificate:      state.init.certificate || null,
    confirmPassword:  state.init.confirmPassword,
    device:           state.init.device || null,
    email:            state.init.email,
    lastOpened:       state.plan.lastOpened,
    newPassword:      state.init.newPassword,
    verificationCode: state.init.verificationCode,
});

const mapDispatchToProps = {
    finalizeLogin:   init.finalizeLogin,
    getMyPlan:       PlanActions.getMyPlan,
    onFormSubmit:    init.resetPassword,
    onSubmitSuccess: init.startLogin,
    registerDevice:  init.registerDevice,
    setAppLogs:      PlanActions.setAppLogs,
    setEnvironment:  init.setEnvironment,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
