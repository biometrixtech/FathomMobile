import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, user as UserActions, } from '../../actions';

const MyPlan = ({
    Layout,
    activateFunctionalStrength,
    ble,
    clearCompletedExercises,
    clearCompletedFSExercises,
    clearHealthKitWorkouts,
    getMyPlan,
    getSoreBodyParts,
    healthData,
    lastOpened,
    markStartedFunctionalStrength,
    markStartedRecovery,
    network,
    noSessions,
    notification,
    patchActiveRecovery,
    patchActiveTime,
    patchFunctionalStrength,
    plan,
    postReadinessSurvey,
    postSessionSurvey,
    scheduledMaintenance,
    setAppLogs,
    setCompletedExercises,
    setCompletedFSExercises,
    updateUser,
    user,
}) => (
    <Layout
        activateFunctionalStrength={activateFunctionalStrength}
        ble={ble}
        clearCompletedExercises={clearCompletedExercises}
        clearCompletedFSExercises={clearCompletedFSExercises}
        clearHealthKitWorkouts={clearHealthKitWorkouts}
        getMyPlan={getMyPlan}
        getSoreBodyParts={getSoreBodyParts}
        healthData={healthData}
        lastOpened={lastOpened}
        markStartedFunctionalStrength={markStartedFunctionalStrength}
        markStartedRecovery={markStartedRecovery}
        network={network}
        noSessions={noSessions}
        notification={notification}
        patchActiveRecovery={patchActiveRecovery}
        patchActiveTime={patchActiveTime}
        patchFunctionalStrength={patchFunctionalStrength}
        plan={plan}
        postReadinessSurvey={postReadinessSurvey}
        postSessionSurvey={postSessionSurvey}
        scheduledMaintenance={scheduledMaintenance}
        setAppLogs={setAppLogs}
        setCompletedExercises={setCompletedExercises}
        setCompletedFSExercises={setCompletedFSExercises}
        updateUser={updateUser}
        user={user}
    />
);

MyPlan.propTypes = {
    Layout:                        PropTypes.func.isRequired,
    activateFunctionalStrength:    PropTypes.func.isRequired,
    ble:                           PropTypes.object.isRequired,
    clearCompletedExercises:       PropTypes.func.isRequired,
    clearCompletedFSExercises:     PropTypes.func.isRequired,
    clearHealthKitWorkouts:        PropTypes.func.isRequired,
    getMyPlan:                     PropTypes.func.isRequired,
    getSoreBodyParts:              PropTypes.func.isRequired,
    healthData:                    PropTypes.object.isRequired,
    lastOpened:                    PropTypes.object.isRequired,
    markStartedFunctionalStrength: PropTypes.func.isRequired,
    markStartedRecovery:           PropTypes.func.isRequired,
    network:                       PropTypes.object.isRequired,
    noSessions:                    PropTypes.func.isRequired,
    notification:                  PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]).isRequired,
    patchActiveRecovery:     PropTypes.func.isRequired,
    patchActiveTime:         PropTypes.func.isRequired,
    patchFunctionalStrength: PropTypes.func.isRequired,
    plan:                    PropTypes.object.isRequired,
    postReadinessSurvey:     PropTypes.func.isRequired,
    postSessionSurvey:       PropTypes.func.isRequired,
    scheduledMaintenance:    PropTypes.object,
    setAppLogs:              PropTypes.func.isRequired,
    setCompletedExercises:   PropTypes.func.isRequired,
    setCompletedFSExercises: PropTypes.func.isRequired,
    updateUser:              PropTypes.func.isRequired,
    user:                    PropTypes.object.isRequired,
};

MyPlan.defaultProps = {
    scheduledMaintenance: null,
};

const mapStateToProps = state => ({
    ble:                  state.ble,
    healthData:           state.plan.healthData,
    lastOpened:           state.plan.lastOpened,
    network:              state.network,
    notification:         state.init.notification,
    plan:                 state.plan,
    scheduledMaintenance: state.init.scheduledMaintenance || null,
    user:                 state.user,
});

const mapDispatchToProps = {
    activateFunctionalStrength:    PlanActions.activateFunctionalStrength,
    clearCompletedExercises:       PlanActions.clearCompletedExercises,
    clearCompletedFSExercises:     PlanActions.clearCompletedFSExercises,
    clearHealthKitWorkouts:        PlanActions.clearHealthKitWorkouts,
    getMyPlan:                     PlanActions.getMyPlan,
    getSoreBodyParts:              PlanActions.getSoreBodyParts,
    markStartedFunctionalStrength: PlanActions.markStartedFunctionalStrength,
    markStartedRecovery:           PlanActions.markStartedRecovery,
    noSessions:                    PlanActions.noSessions,
    patchActiveRecovery:           PlanActions.patchActiveRecovery,
    patchActiveTime:               PlanActions.patchActiveTime,
    patchFunctionalStrength:       PlanActions.patchFunctionalStrength,
    postReadinessSurvey:           PlanActions.postReadinessSurvey,
    postSessionSurvey:             PlanActions.postSessionSurvey,
    setAppLogs:                    PlanActions.setAppLogs,
    setCompletedExercises:         PlanActions.setCompletedExercises,
    setCompletedFSExercises:       PlanActions.setCompletedFSExercises,
    updateUser:                    UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPlan);