import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { user as UserActions, } from '../../actions';

const Trends = ({
    Layout,
    plan,
    updateUser,
    user,
}) => (
    <Layout
        plan={plan}
        updateUser={updateUser}
        user={user}
    />
);

Trends.propTypes = {
    Layout:     PropTypes.func.isRequired,
    plan:       PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
    user:       PropTypes.object.isRequired,
};

Trends.defaultProps = {};

const mapStateToProps = state => ({
    plan: state.plan,
    user: state.user,
});

const mapDispatchToProps = {
    updateUser: UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Trends);