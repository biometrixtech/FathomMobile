import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, user as UserActions, } from '../../actions';

const MyPlan = ({
    Layout,
    clearCompletedExercises,
    clearHealthKitWorkouts,
    getMyPlan,
    getSoreBodyParts,
    healthData,
    lastOpened,
    network,
    noSessions,
    notification,
    patchActiveRecovery,
    plan,
    postReadinessSurvey,
    postSessionSurvey,
    scheduledMaintenance,
    setAppLogs,
    updateUser,
    user,
}) => (
    <Layout
        clearCompletedExercises={clearCompletedExercises}
        clearHealthKitWorkouts={clearHealthKitWorkouts}
        getMyPlan={getMyPlan}
        getSoreBodyParts={getSoreBodyParts}
        healthData={healthData}
        lastOpened={lastOpened}
        network={network}
        noSessions={noSessions}
        notification={notification}
        patchActiveRecovery={patchActiveRecovery}
        plan={plan}
        postReadinessSurvey={postReadinessSurvey}
        postSessionSurvey={postSessionSurvey}
        scheduledMaintenance={scheduledMaintenance}
        setAppLogs={setAppLogs}
        updateUser={updateUser}
        user={user}
    />
);

MyPlan.propTypes = {
    Layout:                  PropTypes.func.isRequired,
    clearCompletedExercises: PropTypes.func.isRequired,
    clearHealthKitWorkouts:  PropTypes.func.isRequired,
    getMyPlan:               PropTypes.func.isRequired,
    getSoreBodyParts:        PropTypes.func.isRequired,
    healthData:              PropTypes.object.isRequired,
    lastOpened:              PropTypes.object.isRequired,
    network:                 PropTypes.object.isRequired,
    noSessions:              PropTypes.func.isRequired,
    notification:            PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]).isRequired,
    patchActiveRecovery:  PropTypes.func.isRequired,
    plan:                 PropTypes.object.isRequired,
    postReadinessSurvey:  PropTypes.func.isRequired,
    postSessionSurvey:    PropTypes.func.isRequired,
    scheduledMaintenance: PropTypes.object,
    setAppLogs:           PropTypes.func.isRequired,
    updateUser:           PropTypes.func.isRequired,
    user:                 PropTypes.object.isRequired,
};

MyPlan.defaultProps = {
    scheduledMaintenance: null,
};

const mapStateToProps = state => ({
    healthData:           state.plan.healthData,
    lastOpened:           state.plan.lastOpened,
    network:              state.network,
    notification:         state.init.notification,
    plan:                 state.plan,
    scheduledMaintenance: state.init.scheduledMaintenance || null,
    user:                 state.user,
});

const mapDispatchToProps = {
    clearCompletedExercises: PlanActions.clearCompletedExercises,
    clearHealthKitWorkouts:  PlanActions.clearHealthKitWorkouts,
    getMyPlan:               PlanActions.getMyPlan,
    getSoreBodyParts:        PlanActions.getSoreBodyParts,
    noSessions:              PlanActions.noSessions,
    patchActiveRecovery:     PlanActions.patchActiveRecovery,
    postReadinessSurvey:     PlanActions.postReadinessSurvey,
    postSessionSurvey:       PlanActions.postSessionSurvey,
    setAppLogs:              PlanActions.setAppLogs,
    updateUser:              UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPlan);