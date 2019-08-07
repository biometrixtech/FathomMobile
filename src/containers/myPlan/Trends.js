import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { plan as PlanActions, user as UserActions, } from '../../actions';

const Trends = ({
    Layout,
    clearPlanAlert,
    plan,
    updateUser,
    user,
}) => (
    <Layout
        clearPlanAlert={clearPlanAlert}
        plan={plan}
        updateUser={updateUser}
        user={user}
    />
);

Trends.propTypes = {
    Layout:         PropTypes.func.isRequired,
    clearPlanAlert: PropTypes.func.isRequired,
    plan:           PropTypes.object.isRequired,
    updateUser:     PropTypes.func.isRequired,
    user:           PropTypes.object.isRequired,
};

Trends.defaultProps = {};

const mapStateToProps = state => ({
    plan: state.plan,
    user: state.user,
});

const mapDispatchToProps = {
    clearPlanAlert: PlanActions.clearPlanAlert,
    updateUser:     UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Trends);