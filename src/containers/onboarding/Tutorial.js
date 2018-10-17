import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { user as UserActions, } from '../../actions';

const Tutorial = ({
    Layout,
    updateUser,
    user,
}) => (
    <Layout
        updateUser={updateUser}
        user={user}
    />
);

Tutorial.propTypes = {
    updateUser: PropTypes.func.isRequired,
    user:       PropTypes.object.isRequired,
};

Tutorial.defaultProps = {};

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = {
    updateUser: UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial);
