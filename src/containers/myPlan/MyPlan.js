import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, } from '../../actions';

const MyPlan = ({
    Layout,
    ble,
    clearCompletedExercises,
    clearCompletedFSExercises,
    setCompletedExercises,
    setCompletedFSExercises,
    getMyPlan,
    getSoreBodyParts,
    noSessions,
    notification,
    patchActiveRecovery,
    patchFunctionalStrength,
    plan,
    postReadinessSurvey,
    postSessionSurvey,
    scheduledMaintenance,
    typicalSession,
    user,
}) => (
    <Layout
        ble={ble}
        clearCompletedExercises={clearCompletedExercises}
        clearCompletedFSExercises={clearCompletedFSExercises}
        setCompletedExercises={setCompletedExercises}
        setCompletedFSExercises={setCompletedFSExercises}
        getMyPlan={getMyPlan}
        getSoreBodyParts={getSoreBodyParts}
        noSessions={noSessions}
        notification={notification}
        patchActiveRecovery={patchActiveRecovery}
        patchFunctionalStrength={patchFunctionalStrength}
        plan={plan}
        postReadinessSurvey={postReadinessSurvey}
        postSessionSurvey={postSessionSurvey}
        scheduledMaintenance={scheduledMaintenance}
        typicalSession={typicalSession}
        user={user}
    />
);

MyPlan.propTypes = {
    Layout:                    PropTypes.func.isRequired,
    ble:                       PropTypes.object.isRequired,
    clearCompletedExercises:   PropTypes.func.isRequired,
    clearCompletedFSExercises: PropTypes.func.isRequired,
    setCompletedExercises:     PropTypes.func.isRequired,
    setCompletedFSExercises:   PropTypes.func.isRequired,
    getMyPlan:                 PropTypes.func.isRequired,
    getSoreBodyParts:          PropTypes.func.isRequired,
    noSessions:                PropTypes.func.isRequired,
    notification:              PropTypes.bool.isRequired,
    patchActiveRecovery:       PropTypes.func.isRequired,
    patchFunctionalStrength:   PropTypes.func.isRequired,
    plan:                      PropTypes.object.isRequired,
    postReadinessSurvey:       PropTypes.func.isRequired,
    postSessionSurvey:         PropTypes.func.isRequired,
    scheduledMaintenance:      PropTypes.object,
    typicalSession:            PropTypes.func.isRequired,
    user:                      PropTypes.object.isRequired,
};

MyPlan.defaultProps = {
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
    clearCompletedExercises:   PlanActions.clearCompletedExercises,
    clearCompletedFSExercises: PlanActions.clearCompletedFSExercises,
    setCompletedExercises:     PlanActions.setCompletedExercise,
    setCompletedFSExercises:   PlanActions.setCompletedFSExercise,
    getMyPlan:                 PlanActions.getMyPlan,
    getSoreBodyParts:          PlanActions.getSoreBodyParts,
    noSessions:                PlanActions.noSessions,
    patchActiveRecovery:       PlanActions.patchActiveRecovery,
    patchFunctionalStrength:   PlanActions.patchFunctionalStrength,
    postReadinessSurvey:       PlanActions.postReadinessSurvey,
    postSessionSurvey:         PlanActions.postSessionSurvey,
    typicalSession:            PlanActions.typicalSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPlan);