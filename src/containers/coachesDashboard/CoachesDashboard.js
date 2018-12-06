import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, user as UserActions, } from '../../actions';

const CoachesDashboard = ({
    Layout,
    coachesDashboardData,
    getCoachesDashboardData,
    lastOpened,
    network,
    scheduledMaintenance,
    updateUser,
    user,
}) => (
    <Layout
        coachesDashboardData={coachesDashboardData}
        getCoachesDashboardData={getCoachesDashboardData}
        lastOpened={lastOpened}
        network={network}
        scheduledMaintenance={scheduledMaintenance}
        updateUser={updateUser}
        user={user}
    />
);

CoachesDashboard.propTypes = {
    Layout:                  PropTypes.func.isRequired,
    coachesDashboardData:    PropTypes.array.isRequired,
    getCoachesDashboardData: PropTypes.func.isRequired,
    lastOpened:              PropTypes.object.isRequired,
    network:                 PropTypes.object.isRequired,
    scheduledMaintenance:    PropTypes.object,
    updateUser:              PropTypes.func.isRequired,
    user:                    PropTypes.object.isRequired,
};

CoachesDashboard.defaultProps = {
    scheduledMaintenance: null,
};

const mapStateToProps = state => ({
    coachesDashboardData: state.plan.coachesDashboardData,
    lastOpened:           state.plan.lastOpened,
    network:              state.network,
    scheduledMaintenance: state.init.scheduledMaintenance || null,
    user:                 state.user,
});

const mapDispatchToProps = {
    getCoachesDashboardData: PlanActions.getCoachesDashboardData,
    updateUser:              UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(CoachesDashboard);