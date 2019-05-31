import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { user as UserActions, } from '../../actions';

const Tutorial = ({
    Layout,
    step,
    updateUser,
    user,
}) => (
    <Layout
        step={step}
        updateUser={updateUser}
        user={user}
    />
);

Tutorial.propTypes = {
    step:       PropTypes.string.isRequired,
    updateUser: PropTypes.func.isRequired,
    user:       PropTypes.object.isRequired,
};

Tutorial.defaultProps = {};

const mapStateToProps = (state, props) => ({
    step: props.step,
    user: state.user,
});

const mapDispatchToProps = {
    updateUser: UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial);
