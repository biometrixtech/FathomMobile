import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { plan as PlanActions, user as UserActions, } from '../../actions';

const Survey = ({
    Layout,
    postSurvey,
    updateUser,
    user,
}) => (
    <Layout
        postSurvey={postSurvey}
        updateUser={updateUser}
        user={user}
    />
);

Survey.propTypes = {
    postSurvey: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    user:       PropTypes.object.isRequired,
};

Survey.defaultProps = {};

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = {
    postSurvey: PlanActions.postSurvey,
    updateUser: UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
