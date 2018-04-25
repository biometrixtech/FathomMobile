/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:33:03 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-23 20:42:27
 */

/**
 * SignUp Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import init from '../../actions/init';

const SignUp = ({
    Layout,
    onFormSubmit,
    email,
    password,
}) => (
    <Layout
        email={email}
        password={password}
        onFormSubmit={onFormSubmit}
    />
);

SignUp.propTypes = {
    Layout:       PropTypes.func.isRequired,
    email:        PropTypes.string,
    password:     PropTypes.string,
    onFormSubmit: PropTypes.func.isRequired,
};

SignUp.defaultProps = {
    email:    null,
    password: null,
};

const mapStateToProps = state => ({
    email:    state.init.email,
    password: state.init.password,
});

const mapDispatchToProps = {
    onFormSubmit: init.signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

