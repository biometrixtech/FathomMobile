/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:05 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-23 16:25:15
 */

/**
 * Dashboard Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import DashboardRender from './DashboardView';

// What data from the store shall we send to the component?
const mapStateToProps = state => {
    return ({
        user: state.user,
    });
};

// Any actions to map to the component?
const mapDispatchToProps = {
    selectTrainingGroup: UserActions.selectTrainingGroup,
    getTeams:            UserActions.getTeams,
    setStatsCategory:    UserActions.setStatsCategory,
    getTeamStats:        UserActions.getTeamStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardRender);
