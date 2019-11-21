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

import { ble as BluetoothActions, init, user as userActions, } from '../../actions';

const Settings = ({
    Layout,
    accessoryData,
    changePassword,
    getSensorDetails,
    logout,
    network,
    sessionToken,
    user,
    updateUser,
    userJoinAccount,
}) => (
    <Layout
        accessoryData={accessoryData}
        changePassword={changePassword}
        getSensorDetails={getSensorDetails}
        logout={logout}
        network={network}
        sessionToken={sessionToken}
        user={user}
        updateUser={updateUser}
        userJoinAccount={userJoinAccount}
    />
);

Settings.propTypes = {
    Layout:           PropTypes.func.isRequired,
    accessoryData:    PropTypes.object.isRequired,
    getSensorDetails: PropTypes.func.isRequired,
    logout:           PropTypes.func.isRequired,
    network:          PropTypes.object.isRequired,
    user:             PropTypes.object.isRequired,
    updateUser:       PropTypes.func.isRequired,
    userJoinAccount:  PropTypes.func.isRequired,
};

Settings.defaultProps = {};

const mapStateToProps = state => ({
    accessoryData: state.ble.accessoryData || {},
    network:       state.network,
    sessionToken:  state.init.session_token || null,
    user:          state.user || {},
});

const mapDispatchToProps = {
    changePassword:   init.changePassword,
    getSensorDetails: BluetoothActions.getSensorDetails,
    logout:           init.logout,
    updateUser:       userActions.updateUser,
    userJoinAccount:  userActions.userJoinAccount,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
