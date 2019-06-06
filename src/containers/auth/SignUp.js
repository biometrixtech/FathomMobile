/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:33:03
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:13:01
 */

/**
 * SignUp Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { init, } from '../../actions';

const SignUp = ({
    Layout,
    onFormSubmit,
    email,
    password,
    loading,
}) => (
    <Layout
        email={email}
        password={password}
        loading={loading}
        onFormSubmit={onFormSubmit}
    />
);

SignUp.propTypes = {
    Layout:       PropTypes.func.isRequired,
    email:        PropTypes.string,
    password:     PropTypes.string,
    loading:      PropTypes.bool,
    onFormSubmit: PropTypes.func.isRequired,
};

SignUp.defaultProps = {
    email:    null,
    password: null,
    loading:  false,
};

const mapStateToProps = state => ({
    email:    state.init.email,
    password: state.init.password,
    loading:  state.user.loading || false,
});

const mapDispatchToProps = {
    onFormSubmit: init.signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

