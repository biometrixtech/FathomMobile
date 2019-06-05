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
    deleteUserSensorData,
    deleteAllSingleSensorPractices,
    getSensorFiles,
    logout,
    network,
    user,
    updateUser,
    userJoinAccount,
}) => (
    <Layout
        accessoryData={accessoryData}
        deleteUserSensorData={deleteUserSensorData}
        deleteAllSingleSensorPractices={deleteAllSingleSensorPractices}
        getSensorFiles={getSensorFiles}
        logout={logout}
        network={network}
        user={user}
        updateUser={updateUser}
        userJoinAccount={userJoinAccount}
    />
);

Settings.propTypes = {
    Layout:                         PropTypes.func.isRequired,
    accessoryData:                  PropTypes.object.isRequired,
    deleteUserSensorData:           PropTypes.func.isRequired,
    deleteAllSingleSensorPractices: PropTypes.func.isRequired,
    getSensorFiles:                 PropTypes.func.isRequired,
    logout:                         PropTypes.func.isRequired,
    network:                        PropTypes.object.isRequired,
    user:                           PropTypes.object.isRequired,
    updateUser:                     PropTypes.func.isRequired,
    userJoinAccount:                PropTypes.func.isRequired,
};

Settings.defaultProps = {
};

const mapStateToProps = state => ({
    accessoryData: state.ble.accessoryData || {},
    network:       state.network,
    user:          state.user || {},
});

const mapDispatchToProps = {
    deleteUserSensorData:           ble.deleteUserSensorData,
    deleteAllSingleSensorPractices: ble.deleteAllSingleSensorPractices,
    getSensorFiles:                 ble.getSensorFiles,
    logout:                         init.logout,
    updateUser:                     userActions.updateUser,
    userJoinAccount:                userActions.userJoinAccount,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
