/*
 * @Author: Vir Desai
 * @Date: 2018-07-27 21:51:46
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-30 02:50:06
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, } from '../../actions';

const Home = ({
    Layout,
    ble,
    clearCompletedExercises,
    setCompletedExercises,
    getMyPlan,
    getSoreBodyParts,
    notification,
    patchActiveRecovery,
    plan,
    postReadinessSurvey,
    postSessionSurvey,
    scheduledMaintenance,
    user,
}) => (
    <Layout
        ble={ble}
        clearCompletedExercises={clearCompletedExercises}
        setCompletedExercises={setCompletedExercises}
        getMyPlan={getMyPlan}
        getSoreBodyParts={getSoreBodyParts}
        notification={notification}
        patchActiveRecovery={patchActiveRecovery}
        plan={plan}
        postReadinessSurvey={postReadinessSurvey}
        postSessionSurvey={postSessionSurvey}
        scheduledMaintenance={scheduledMaintenance}
        user={user}
    />
);

Home.propTypes = {
    Layout:                  PropTypes.func.isRequired,
    ble:                     PropTypes.object.isRequired,
    clearCompletedExercises: PropTypes.func.isRequired,
    setCompletedExercises:   PropTypes.func.isRequired,
    getMyPlan:               PropTypes.func.isRequired,
    getSoreBodyParts:        PropTypes.func.isRequired,
    notification:            PropTypes.bool.isRequired,
    patchActiveRecovery:     PropTypes.func.isRequired,
    plan:                    PropTypes.object.isRequired,
    postReadinessSurvey:     PropTypes.func.isRequired,
    postSessionSurvey:       PropTypes.func.isRequired,
    scheduledMaintenance:    PropTypes.object,
    user:                    PropTypes.object.isRequired,
};

Home.defaultProps = {
    scheduledMaintenance: null,
};

const mapStateToProps = state => ({
    ble:                  state.ble,
    notification:         state.init.notification,
    plan:                 state.plan,
    scheduledMaintenance: state.init.scheduledMaintenance || null,
    user:                 state.user,
});

const mapDispatchToProps = {
    clearCompletedExercises: PlanActions.clearCompletedExercises,
    setCompletedExercises:   PlanActions.setCompletedExercise,
    getMyPlan:               PlanActions.getMyPlan,
    getSoreBodyParts:        PlanActions.getSoreBodyParts,
    patchActiveRecovery:     PlanActions.patchActiveRecovery,
    postReadinessSurvey:     PlanActions.postReadinessSurvey,
    postSessionSurvey:       PlanActions.postSessionSurvey,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
