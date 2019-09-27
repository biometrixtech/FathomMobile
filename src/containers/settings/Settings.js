/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 14:06:10
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:13:44
 */

/**
 * Settings Screen Container
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { ble, init, user as userActions, } from '../../actions';

const Settings = ({
    Layout,
    accessoryData,
    logout,
    network,
    user,
    updateUser,
    userJoinAccount,
    changePassword,
    sessionToken
}) => (
    <Layout
        accessoryData={accessoryData}
        logout={logout}
        network={network}
        user={user}
        updateUser={updateUser}
        userJoinAccount={userJoinAccount}
        sessionToken={sessionToken}
        changePassword={changePassword}
    />
);

Settings.propTypes = {
    Layout:          PropTypes.func.isRequired,
    accessoryData:   PropTypes.object.isRequired,
    logout:          PropTypes.func.isRequired,
    network:         PropTypes.object.isRequired,
    user:            PropTypes.object.isRequired,
    updateUser:      PropTypes.func.isRequired,
    userJoinAccount: PropTypes.func.isRequired,
};

Settings.defaultProps = {
};

const mapStateToProps = state => ({
    accessoryData: state.ble.accessoryData || {},
    network:       state.network,
    user:          state.user || {},
    sessionToken:  state.init.session_token || null,
});

const mapDispatchToProps = {
    logout:          init.logout,
    updateUser:      userActions.updateUser,
    userJoinAccount: userActions.userJoinAccount,
    changePassword:  init.changePassword
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
