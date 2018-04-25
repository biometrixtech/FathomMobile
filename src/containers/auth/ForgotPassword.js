/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 13:47:12 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-23 20:42:16
 */

/**
 * Forgot Password Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import init from '../../actions/init';

const ForgotPassword = ({
    Layout,
    onFormSubmit,
    email
}) => (
    <Layout
        onFormSubmit={onFormSubmit}
        email={email}
    />
);

ForgotPassword.propTypes = {
    Layout:       PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    email:        PropTypes.string
};

ForgotPassword.defaultProps = {
    email: null,
};

const mapStateToProps = state => ({
    email: state.init.email,
});

const mapDispatchToProps = {
    onFormSubmit: init.forgotPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
