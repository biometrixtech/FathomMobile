import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { plan as PlanActions, user as UserActions, } from '../../actions';

const ExerciseModality = ({
    Layout,
    index,
    markStartedRecovery,
    modality,
    patchActiveRecovery,
    plan,
    setCompletedCoolDownExercises,
    setCompletedExercises,
    toggleActiveRestGoal,
    toggleCoolDownGoal,
    toggleWarmUpGoal,
    updateUser,
    user,
}) => (
    <Layout
        index={index}
        markStartedRecovery={markStartedRecovery}
        modality={modality}
        patchActiveRecovery={patchActiveRecovery}
        plan={plan}
        setCompletedCoolDownExercises={setCompletedCoolDownExercises}
        setCompletedExercises={setCompletedExercises}
        toggleActiveRestGoal={toggleActiveRestGoal}
        toggleCoolDownGoal={toggleCoolDownGoal}
        toggleWarmUpGoal={toggleWarmUpGoal}
        updateUser={updateUser}
        user={user}
    />
);

ExerciseModality.propTypes = {
    index:                         PropTypes.number.isRequired,
    markStartedRecovery:           PropTypes.func.isRequired,
    modality:                      PropTypes.string.isRequired,
    patchActiveRecovery:           PropTypes.func.isRequired,
    plan:                          PropTypes.object.isRequired,
    setCompletedCoolDownExercises: PropTypes.func.isRequired,
    setCompletedExercises:         PropTypes.func.isRequired,
    toggleActiveRestGoal:          PropTypes.func.isRequired,
    toggleCoolDownGoal:            PropTypes.func.isRequired,
    toggleWarmUpGoal:              PropTypes.func.isRequired,
    updateUser:                    PropTypes.func.isRequired,
    user:                          PropTypes.object.isRequired,
};

ExerciseModality.defaultProps = {};

const mapStateToProps = (state, props) => ({
    index:    props.index,
    modality: props.modality,
    plan:     state.plan,
    user:     state.user,
});

const mapDispatchToProps = {
    markStartedRecovery:           PlanActions.markStartedRecovery,
    patchActiveRecovery:           PlanActions.patchActiveRecovery,
    setCompletedCoolDownExercises: PlanActions.setCompletedCoolDownExercises,
    setCompletedExercises:         PlanActions.setCompletedExercises,
    toggleActiveRestGoal:          PlanActions.toggleActiveRestGoal,
    toggleCoolDownGoal:            PlanActions.toggleCoolDownGoal,
    toggleWarmUpGoal:              PlanActions.toggleWarmUpGoal,
    updateUser:                    UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseModality);