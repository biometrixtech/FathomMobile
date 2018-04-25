/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 14:05:28 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-24 22:11:37
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
    userSelect,
    user,
}) => (
    <Layout
        userSelect={userSelect}
        user={user}
    />
);

Connections.propTypes = {
    Layout:     PropTypes.func.isRequired,
    userSelect: PropTypes.func.isRequired,
    user:       PropTypes.shape({}).isRequired,
};

Connections.defaultProps = {
    user: {},
};

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = {
    userSelect: UserActions.userSelect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
