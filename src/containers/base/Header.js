/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:23:16 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-30 13:23:16 
 */

/**
 * Header Component Container
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import init from '../../actions/init';

const Header = ({
    Layout,
    logout,
    first_name,
    last_name,
}) => (
    <Layout
        logout={logout}
        first_name={first_name}
        last_name={last_name}
    />
);

Header.propTypes = {
    Layout:     PropTypes.func.isRequired,
    logout:     PropTypes.func.isRequired,
    first_name: PropTypes.string,
    last_name:  PropTypes.string,
};

Header.defaultProps = {
    first_name: 'User',
    last_name:  '',
};

const mapStateToProps = state => ({
    first_name: state.user.first_name || 'User',
    last_name:  state.user.last_name || '',
});

const mapDispatchToProps = {
    logout: init.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
