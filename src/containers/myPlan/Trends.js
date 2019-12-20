import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { user as UserActions, } from '../../actions';

const Trends = ({
    Layout,
    currentSelectedTab,
    plan,
    updateUser,
    user,
}) => (
    <Layout
        currentSelectedTab={currentSelectedTab}
        plan={plan}
        updateUser={updateUser}
        user={user}
    />
);

Trends.propTypes = {
    Layout:             PropTypes.func.isRequired,
    currentSelectedTab: PropTypes.string.isRequired,
    plan:               PropTypes.object.isRequired,
    updateUser:         PropTypes.func.isRequired,
    user:               PropTypes.object.isRequired,
};

Trends.defaultProps = {};

const mapStateToProps = state => ({
    currentSelectedTab: state.init.currentSelectedTab,
    plan:               state.plan,
    user:               state.user,
});

const mapDispatchToProps = {
    updateUser: UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Trends);