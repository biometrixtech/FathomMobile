import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { ble as BLEActions, plan as PlanActions, user as UserActions, } from '../../actions';

const MyPlan = ({
    Layout,
    clearCompletedCoolDownExercises,
    clearCompletedExercises,
    clearHealthKitWorkouts,
    getMobilize,
    getMyPlan,
    getSensorFiles,
    getSoreBodyParts,
    handleReadInsight,
    healthData,
    lastOpened,
    network,
    noSessions,
    notification,
    plan,
    postReadinessSurvey,
    postSessionSurvey,
    scheduledMaintenance,
    setAppLogs,
    updateUser,
    user,
}) => (
    <Layout
        clearCompletedCoolDownExercises={clearCompletedCoolDownExercises}
        clearCompletedExercises={clearCompletedExercises}
        clearHealthKitWorkouts={clearHealthKitWorkouts}
        getMobilize={getMobilize}
        getMyPlan={getMyPlan}
        getSensorFiles={getSensorFiles}
        getSoreBodyParts={getSoreBodyParts}
        handleReadInsight={handleReadInsight}
        healthData={healthData}
        lastOpened={lastOpened}
        network={network}
        noSessions={noSessions}
        notification={notification}
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
    Layout:                          PropTypes.func.isRequired,
    clearCompletedCoolDownExercises: PropTypes.func.isRequired,
    clearCompletedExercises:         PropTypes.func.isRequired,
    clearHealthKitWorkouts:          PropTypes.func.isRequired,
    getMobilize:                     PropTypes.func.isRequired,
    getMyPlan:                       PropTypes.func.isRequired,
    getSensorFiles:                  PropTypes.func.isRequired,
    getSoreBodyParts:                PropTypes.func.isRequired,
    handleReadInsight:               PropTypes.func.isRequired,
    healthData:                      PropTypes.object.isRequired,
    lastOpened:                      PropTypes.object.isRequired,
    network:                         PropTypes.object.isRequired,
    noSessions:                      PropTypes.func.isRequired,
    notification:                    PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]).isRequired,
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
    clearCompletedCoolDownExercises: PlanActions.clearCompletedCoolDownExercises,
    clearCompletedExercises:         PlanActions.clearCompletedExercises,
    clearHealthKitWorkouts:          PlanActions.clearHealthKitWorkouts,
    getMobilize:                     PlanActions.getMobilize,
    getMyPlan:                       PlanActions.getMyPlan,
    getSensorFiles:                  BLEActions.getSensorFiles,
    getSoreBodyParts:                PlanActions.getSoreBodyParts,
    handleReadInsight:               PlanActions.clearFTECategory,
    noSessions:                      PlanActions.noSessions,
    postReadinessSurvey:             PlanActions.postReadinessSurvey,
    postSessionSurvey:               PlanActions.postSessionSurvey,
    setAppLogs:                      PlanActions.setAppLogs,
    updateUser:                      UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPlan);