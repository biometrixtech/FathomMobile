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

import { ble, init, plan } from '../../actions';

const Settings = ({
    Layout,
    accessoryData,
    clearMyPlanData,
    deleteUserSensorData,
    deleteAllSingleSensorPractices,
    logout,
    user,
}) => (
    <Layout
        accessoryData={accessoryData}
        clearMyPlanData={clearMyPlanData}
        deleteUserSensorData={deleteUserSensorData}
        deleteAllSingleSensorPractices={deleteAllSingleSensorPractices}
        logout={logout}
        user={user}
    />
);

Settings.propTypes = {
    Layout:                         PropTypes.func.isRequired,
    accessoryData:                  PropTypes.object.isRequired,
    clearMyPlanData:                PropTypes.func.isRequired,
    deleteUserSensorData:           PropTypes.func.isRequired,
    deleteAllSingleSensorPractices: PropTypes.func.isRequired,
    logout:                         PropTypes.func.isRequired,
    user:                           PropTypes.object.isRequired,
};

Settings.defaultProps = {
};

const mapStateToProps = state => ({
    accessoryData: state.ble.accessoryData || {},
    user:          state.user || {},
});

const mapDispatchToProps = {
    clearMyPlanData:                plan.clearMyPlanData,
    deleteUserSensorData:           ble.deleteUserSensorData,
    deleteAllSingleSensorPractices: ble.deleteAllSingleSensorPractices,
    logout:                         init.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
