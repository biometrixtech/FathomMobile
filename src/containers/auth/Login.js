/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:23:45 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-30 13:23:45 
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import init from '../../actions/init';

const Login = ({
    Layout,
    onFormSubmit,
    setEnvironment,
    environment,
    email,
    password,
    loading,
}) => (
    <Layout
        onFormSubmit={onFormSubmit}
        setEnvironment={setEnvironment}
        environment={environment}
        email={email}
        password={password}
        loading={loading}
    />
);

Login.propTypes = {
    Layout:         PropTypes.func.isRequired,
    onFormSubmit:   PropTypes.func.isRequired,
    setEnvironment: PropTypes.func.isRequired,
    environment:    PropTypes.string,
    email:          PropTypes.string,
    password:       PropTypes.string,
    loading:        PropTypes.bool,
};

Login.defaultProps = {
    environment: 'PROD',
    email:       null,
    password:    null,
    loading:     false,
};

const mapStateToProps = state => ({
    environment: state.init.environment || 'PROD',
    email:       state.init.email || null,
    password:    state.init.password || null,
    loading:     state.user.loading || false,
});

const mapDispatchToProps = {
    onFormSubmit:   init.login,
    setEnvironment: init.setEnvironment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
