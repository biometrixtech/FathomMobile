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
import { connect } from 'react-redux';

import { ble, init } from '../../actions';

const Settings = ({
    Layout,
    accessoryData,
    deleteUserSensorData,
    disconnectFromSingleSensor,
    getSingleSensorSavedPractices,
    logout,
    user,
}) => (
    <Layout
        accessoryData={accessoryData}
        deleteUserSensorData={deleteUserSensorData}
        disconnectFromSingleSensor={disconnectFromSingleSensor}
        getSingleSensorSavedPractices={getSingleSensorSavedPractices}
        logout={logout}
        user={user}
    />
);

Settings.propTypes = {
    Layout:                        PropTypes.func.isRequired,
    accessoryData:                 PropTypes.object.isRequired,
    deleteUserSensorData:          PropTypes.func.isRequired,
    disconnectFromSingleSensor:    PropTypes.func.isRequired,
    getSingleSensorSavedPractices: PropTypes.func.isRequired,
    logout:                        PropTypes.func.isRequired,
    user:                          PropTypes.object.isRequired,
};

Settings.defaultProps = {
};

const mapStateToProps = state => ({
    accessoryData: state.ble.accessoryData || {},
    user:          state.user || {},
});

const mapDispatchToProps = {
    deleteUserSensorData:          ble.deleteUserSensorData,
    disconnectFromSingleSensor:    ble.disconnectFromSingleSensor,
    getSingleSensorSavedPractices: ble.getSingleSensorSavedPractices,
    logout:                        init.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
