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
}) => (
    <Layout
        onFormSubmit={onFormSubmit}
        setEnvironment={setEnvironment}
        environment={environment}
        email={email}
        password={password}
    />
);

Login.propTypes = {
    Layout:         PropTypes.func.isRequired,
    onFormSubmit:   PropTypes.func.isRequired,
    setEnvironment: PropTypes.func.isRequired,
    environment:    PropTypes.string,
    email:          PropTypes.string,
    password:       PropTypes.string,
};

Login.defaultProps = {
    environment: 'PROD',
    email:       null,
    password:    null,
};

const mapStateToProps = state => ({
    environment: state.init.environment || 'PROD',
    email:       state.init.email || null,
    password:    state.init.password || null,
});

const mapDispatchToProps = {
    onFormSubmit:   init.login,
    setEnvironment: init.setEnvironment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
