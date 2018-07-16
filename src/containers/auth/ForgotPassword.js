/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 13:47:12 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-16 18:43:37
 */

/**
 * Forgot Password Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { init } from '@actions';

const ForgotPassword = ({
    Layout,
    onFormSubmit,
    email,
    loading,
}) => (
    <Layout
        onFormSubmit={onFormSubmit}
        email={email}
        loading={loading}
    />
);

ForgotPassword.propTypes = {
    Layout:       PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    email:        PropTypes.string,
    loading:      PropTypes.bool,
};

ForgotPassword.defaultProps = {
    email:   null,
    loading: false,
};

const mapStateToProps = state => ({
    email:   state.init.email,
    loading: state.user.loading || false,
});

const mapDispatchToProps = {
    onFormSubmit: init.forgotPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
