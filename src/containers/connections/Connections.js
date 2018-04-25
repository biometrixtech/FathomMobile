/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 14:05:28 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-25 00:29:44
 */

/**
 * Connections Screen Container
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UserActions from '../../actions/user';

const Connections = ({
    Layout,
}) => (
    <Layout
    />
);

Connections.propTypes = {
    Layout: PropTypes.func.isRequired,
};

Connections.defaultProps = {
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
