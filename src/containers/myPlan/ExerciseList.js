import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, user as UserActions, } from '../../actions';

const ExerciseList = ({
    Layout,
    clearCompletedExercises,
    markStartedRecovery,
    plan,
    setCompletedExercises,
    toggleRecoveryGoal,
    updateUser,
    user,
}) => (
    <Layout
        clearCompletedExercises={clearCompletedExercises}
        markStartedRecovery={markStartedRecovery}
        plan={plan}
        setCompletedExercises={setCompletedExercises}
        toggleRecoveryGoal={toggleRecoveryGoal}
        updateUser={updateUser}
        user={user}
    />
);

ExerciseList.propTypes = {
    clearCompletedExercises: PropTypes.func.isRequired,
    markStartedRecovery:     PropTypes.func.isRequired,
    plan:                    PropTypes.object.isRequired,
    setCompletedExercises:   PropTypes.func.isRequired,
    toggleRecoveryGoal:      PropTypes.func.isRequired,
    updateUser:              PropTypes.func.isRequired,
    user:                    PropTypes.object.isRequired,
};

ExerciseList.defaultProps = {};

const mapStateToProps = state => ({
    plan: state.plan,
    user: state.user,
});

const mapDispatchToProps = {
    clearCompletedExercises: PropTypes.func.isRequired,
    markStartedRecovery:     PlanActions.markStartedRecovery,
    setCompletedExercises:   PlanActions.setCompletedExercises,
    toggleRecoveryGoal:      PlanActions.toggleRecoveryGoal,
    updateUser:              UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseList);