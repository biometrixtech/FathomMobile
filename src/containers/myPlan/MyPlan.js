import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, } from '../../actions';

const MyPlan = ({
    Layout,
    getMyPlan,
    getSoreBodyParts,
    notification,
    plan,
    postReadinessSurvey,
    postSessionSurvey,
    user,
}) => (
    <Layout
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