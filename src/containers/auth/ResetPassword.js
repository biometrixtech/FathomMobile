/**
 * Reset Password Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { init } from '../../actions';

const ResetPassword = ({
    Layout,
    onFormSubmit,
    email,
    newPassword,
    verificationCode,
    loading,
}) => (
    <Layout
        onFormSubmit={onFormSubmit}
        email={email}
        newPassword={newPassword}
        verificationCode={verificationCode}
        loading={loading}
    />
);

ResetPassword.propTypes = {
    Layout:           PropTypes.func.isRequired,
    onFormSubmit:     PropTypes.func.isRequired,
    email:            PropTypes.string,
    newPassword:      PropTypes.string,
    verificationCode: PropTypes.string,
    loading:          PropTypes.bool,
};

ResetPassword.defaultProps = {
    email:            null,
    newPassword:      null,
    verificationCode: null,
    loading:          false,
};

const mapStateToProps = state => ({
    email:            state.init.email,
    newPassword:      state.init.newPassword,
    verificationCode: state.init.verificationCode,
    loading:          state.user.loading || false,
});

const mapDispatchToProps = {
    onFormSubmit: init.resetPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
