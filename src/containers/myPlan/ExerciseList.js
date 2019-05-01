import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, user as UserActions, } from '../../actions';

const ExerciseList = ({
    Layout,
    markStartedRecovery,
    patchActiveRecovery,
    plan,
    setCompletedExercises,
    toggleRecoveryGoal,
    updateUser,
    user,
}) => (
    <Layout
        markStartedRecovery={markStartedRecovery}
        patchActiveRecovery={patchActiveRecovery}
        plan={plan}
        setCompletedExercises={setCompletedExercises}
        toggleRecoveryGoal={toggleRecoveryGoal}
        updateUser={updateUser}
        user={user}
    />
);

ExerciseList.propTypes = {
    markStartedRecovery:   PropTypes.func.isRequired,
    patchActiveRecovery:   PropTypes.func.isRequired,
    plan:                  PropTypes.object.isRequired,
    setCompletedExercises: PropTypes.func.isRequired,
    toggleRecoveryGoal:    PropTypes.func.isRequired,
    updateUser:            PropTypes.func.isRequired,
    user:                  PropTypes.object.isRequired,
};

ExerciseList.defaultProps = {};

const mapStateToProps = state => ({
    plan: state.plan,
    user: state.user,
});

const mapDispatchToProps = {
    markStartedRecovery:   PlanActions.markStartedRecovery,
    patchActiveRecovery:   PlanActions.patchActiveRecovery,
    setCompletedExercises: PlanActions.setCompletedExercises,
    toggleRecoveryGoal:    PlanActions.toggleRecoveryGoal,
    updateUser:            UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseList);