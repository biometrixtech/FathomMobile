/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 14:06:10 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-24 01:21:42
 */

/**
 * Settings Screen Container
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import init from '@actions/init';

const Settings = ({
    Layout,
    logout
}) => (
    <Layout
        logout={logout}
    />
);

Settings.propTypes = {
    Layout: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
};

Settings.defaultProps = {
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
    logout: init.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
