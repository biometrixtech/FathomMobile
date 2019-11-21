/**
 * Sensor Files Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

// Actions
import { user as UserActions, } from '../../actions';

const SensorFilesPage = ({
    Layout,
    pageStep,
    updateUser,
    user,
}) => (
    <Layout
        pageStep={pageStep}
        updateUser={updateUser}
        user={user}
    />
);

SensorFilesPage.propTypes = {
    pageStep:   PropTypes.string.isRequired,
    updateUser: PropTypes.func.isRequired,
    user:       PropTypes.shape({}).isRequired,
};

SensorFilesPage.defaultProps = {};

const mapStateToProps = (state, props) => ({
    pageStep: props.pageStep,
    user:     state.user,
});

const mapDispatchToProps = {
    updateUser: UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SensorFilesPage);