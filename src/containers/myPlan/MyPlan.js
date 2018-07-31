import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ble as BLEActions, plan as PlanActions, } from '../../actions';

const MyPlan = ({
    Layout,
    ble,
    getMyPlan,
    getSoreBodyParts,
    notification,
    plan,
    postReadinessSurvey,
    postSessionSurvey,
    user,
}) => (
    <Layout
        ble={ble}
        getMyPlan={getMyPlan}
        getSoreBodyParts={getSoreBodyParts}
        notification={notification}
        plan={plan}
        postReadinessSurvey={postReadinessSurvey}
        postSessionSurvey={postSessionSurvey}
        user={user}
    />
);

MyPlan.propTypes = {
    Layout:              PropTypes.func.isRequired,
    ble:                 PropTypes.object.isRequired,
    getMyPlan:           PropTypes.func.isRequired,
    getSoreBodyParts:    PropTypes.func.isRequired,
    notification:        PropTypes.bool.isRequired,
    plan:                PropTypes.object.isRequired,
    postReadinessSurvey: PropTypes.func.isRequired,
    postSessionSurvey:   PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};

MyPlan.defaultProps = {
};

const mapStateToProps = state => ({
    ble:          state.ble,
    notification: state.init.notification,
    plan:         state.plan,
    user:         state.user,
});

const mapDispatchToProps = {
    getMyPlan:           PlanActions.getMyPlan,
    getSoreBodyParts:    PlanActions.getSoreBodyParts,
    postReadinessSurvey: PlanActions.postReadinessSurvey,
    postSessionSurvey:   PlanActions.postSessionSurvey,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPlan);