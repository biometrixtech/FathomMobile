/**
 * Sensor Files Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

// Actions
import { user as UserActions, } from '../../actions';

const SensorFiles = ({
    Layout,
    updateUser,
    user,
}) => (
    <Layout
        updateUser={updateUser}
        user={user}
    />
);

SensorFiles.propTypes = {
    updateUser: PropTypes.func.isRequired,
    user:       PropTypes.shape({}).isRequired,
};

SensorFiles.defaultProps = {
    user: {},
};

const mapStateToProps = state => ({
    user: state.user || {},
});

const mapDispatchToProps = {
    updateUser: UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SensorFiles);