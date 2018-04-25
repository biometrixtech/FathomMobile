/*
 * @Author: Vir Desai 
 * @Date: 2018-03-14 02:31:05 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-19 02:17:09
 */

/**
 * Training Report Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '../../redux/user/actions';

// The component we're mapping to
import ReportRender from './ReportView';

// What data from the store shall we send to the component?
const mapStateToProps = state => {
    return ({
        user: state.user,
    });
};

// Any actions to map to the component?
const mapDispatchToProps = {
    getTeams:     UserActions.getTeams,
    getTeamStats: UserActions.getTeamStats,
    startRequest: UserActions.startRequest,
    stopRequest:  UserActions.stopRequest,
    selectGraph:  UserActions.selectGraph,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportRender);
