/*
 * @Author: Vir Desai 
 * @Date: 2018-03-14 02:31:05 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-24 23:56:19
 */

/**
 * Training Report Screen Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UserActions from '../../actions/user';

const Report = ({
    Layout,
    getTeams,
    getTeamStats,
    startRequest,
    stopRequest,
    selectGraph,
    userSelect,
    user,
}) => (
    <Layout
        getTeams={getTeams}
        getTeamStats={getTeamStats}
        startRequest={startRequest}
        stopRequest={stopRequest}
        selectGraph={selectGraph}
        userSelect={userSelect}
        user={user}
    />
);

Report.propTypes = {
    Layout:       PropTypes.func.isRequired,
    getTeams:     PropTypes.func.isRequired,
    getTeamStats: PropTypes.func.isRequired,
    startRequest: PropTypes.func.isRequired,
    stopRequest:  PropTypes.func.isRequired,
    selectGraph:  PropTypes.func.isRequired,
    userSelect:   PropTypes.func.isRequired,
    user:         PropTypes.shape({}).isRequired,
};

Report.defaultProps = {
    user: null,
};

const mapStateToProps = state => ({
    user: state.user || {},
});

const mapDispatchToProps = {
    getTeams:     UserActions.getTeams,
    getTeamStats: UserActions.getTeamStats,
    startRequest: UserActions.startRequest,
    stopRequest:  UserActions.stopRequest,
    selectGraph:  UserActions.setStatsCategory,
    userSelect:   UserActions.userSelect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Report);
