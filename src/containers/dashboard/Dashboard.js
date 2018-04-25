/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:05 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-23 20:42:59
 */

/**
 * Dashboard Screen Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UserActions from '../../actions/user';

const Dashboard = ({
    Layout,
    getTeams,
    setStatsCategory,
    getTeamStats,
    startRequest,
    stopRequest,
    user,
}) => (
    <Layout
        getTeams={getTeams}
        setStatsCategory={setStatsCategory}
        getTeamStats={getTeamStats}
        startRequest={startRequest}
        stopRequest={stopRequest}
        user={user}
    />
);

Dashboard.propTypes = {
    Layout:           PropTypes.func.isRequired,
    getTeams:         PropTypes.func.isRequired,
    setStatsCategory: PropTypes.func.isRequired,
    getTeamStats:     PropTypes.func.isRequired,
    startRequest:     PropTypes.func.isRequired,
    stopRequest:      PropTypes.func.isRequired,
    user:             PropTypes.shape({}).isRequired,
};

Dashboard.defaultProps = {
    user: {
        teamIndex: 0
    },
};

const mapStateToProps = state => ({
    user: state.user || {},
});

const mapDispatchToProps = {
    getTeams:         UserActions.getTeams,
    setStatsCategory: UserActions.setStatsCategory,
    getTeamStats:     UserActions.getTeamStats,
    startRequest:     UserActions.startRequest,
    stopRequest:      UserActions.stopRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);


