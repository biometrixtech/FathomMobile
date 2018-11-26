import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, } from '../../actions';

const CoachesDashboard = ({
    Layout,
    coachesDashboardData,
    getCoachesDashboardData,
    lastOpened,
    network,
    scheduledMaintenance,
    user,
}) => (
    <Layout
        coachesDashboardData={coachesDashboardData}
        getCoachesDashboardData={getCoachesDashboardData}
        lastOpened={lastOpened}
        network={network}
        scheduledMaintenance={scheduledMaintenance}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(CoachesDashboard);