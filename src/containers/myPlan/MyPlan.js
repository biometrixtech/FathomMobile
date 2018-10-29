import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, } from '../../actions';

const MyPlan = ({
    Layout,
    ble,
    clearCompletedExercises,
    clearCompletedFSExercises,
    getMyPlan,
    getSoreBodyParts,
    lastOpened,
    markStartedFunctionalStrength,
    markStartedRecovery,
    network,
    noSessions,
    notification,
    patchActiveRecovery,
    patchFunctionalStrength,
    plan,
    postReadinessSurvey,
    postSessionSurvey,
    preReadiness,
    scheduledMaintenance,
    setCompletedExercises,
    setCompletedFSExercises,
    user,
}) => (
    <Layout
        ble={ble}
        clearCompletedExercises={clearCompletedExercises}
        clearCompletedFSExercises={clearCompletedFSExercises}
        getMyPlan={getMyPlan}
        getSoreBodyParts={getSoreBodyParts}
        lastOpened={lastOpened}
        markStartedFunctionalStrength={markStartedFunctionalStrength}
        markStartedRecovery={markStartedRecovery}
        network={network}
        noSessions={noSessions}
        notification={notification}
        patchActiveRecovery={patchActiveRecovery}
        patchFunctionalStrength={patchFunctionalStrength}
        plan={plan}
        postReadinessSurvey={postReadinessSurvey}
        postSessionSurvey={postSessionSurvey}
        preReadiness={preReadiness}
        scheduledMaintenance={scheduledMaintenance}
        setCompletedExercises={setCompletedExercises}
        setCompletedFSExercises={setCompletedFSExercises}
        user={user}
    />
);

MyPlan.propTypes = {
    Layout:                    PropTypes.func.isRequired,
    ble:                       PropTypes.object.isRequired,
    clearCompletedExercises:   PropTypes.func.isRequired,
    clearCompletedFSExercises: PropTypes.func.isRequired,
    getMyPlan:                 PropTypes.func.isRequired,
    getSoreBodyParts:          PropTypes.func.isRequired,
    lastOpened:                PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
    markStartedFunctionalStrength: PropTypes.func.isRequired,
    markStartedRecovery:           PropTypes.func.isRequired,
    network:                       PropTypes.object.isRequired,
    noSessions:                    PropTypes.func.isRequired,
    notification:                  PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]).isRequired,
    patchActiveRecovery:     PropTypes.func.isRequired,
    patchFunctionalStrength: PropTypes.func.isRequired,
    plan:                    PropTypes.object.isRequired,
    postReadinessSurvey:     PropTypes.func.isRequired,
    postSessionSurvey:       PropTypes.func.isRequired,
    preReadiness:            PropTypes.func.isRequired,
    scheduledMaintenance:    PropTypes.object,
    setCompletedExercises:   PropTypes.func.isRequired,
    setCompletedFSExercises: PropTypes.func.isRequired,
    user:                    PropTypes.object.isRequired,
};

MyPlan.defaultProps = {
    scheduledMaintenance: null,
};

const mapStateToProps = state => ({
    ble:                  state.ble,
    lastOpened:           state.init.lastOpened,
    network:              state.network,
    notification:         state.init.notification,
    plan:                 state.plan,
    scheduledMaintenance: state.init.scheduledMaintenance || null,
    user:                 state.user,
});

const mapDispatchToProps = {
    clearCompletedExercises:       PlanActions.clearCompletedExercises,
    clearCompletedFSExercises:     PlanActions.clearCompletedFSExercises,
    getMyPlan:                     PlanActions.getMyPlan,
    getSoreBodyParts:              PlanActions.getSoreBodyParts,
    markStartedFunctionalStrength: PlanActions.markStartedFunctionalStrength,
    markStartedRecovery:           PlanActions.markStartedRecovery,
    noSessions:                    PlanActions.noSessions,
    patchActiveRecovery:           PlanActions.patchActiveRecovery,
    patchFunctionalStrength:       PlanActions.patchFunctionalStrength,
    postReadinessSurvey:           PlanActions.postReadinessSurvey,
    postSessionSurvey:             PlanActions.postSessionSurvey,
    preReadiness:                  PlanActions.preReadiness,
    setCompletedExercises:         PlanActions.setCompletedExercises,
    setCompletedFSExercises:       PlanActions.setCompletedFSExercises,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPlan);