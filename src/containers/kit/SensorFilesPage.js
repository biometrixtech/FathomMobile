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
    startPage,
    updateUser,
    user,
}) => (
    <Layout
        pageStep={pageStep}
        startPage={startPage}
        updateUser={updateUser}
        user={user}
    />
);

SensorFilesPage.propTypes = {
    pageStep:   PropTypes.string.isRequired,
    startPage:  PropTypes.number,
    updateUser: PropTypes.func.isRequired,
    user:       PropTypes.shape({}).isRequired,
};

SensorFilesPage.defaultProps = {
    startPage: 0,
};

const mapStateToProps = (state, props) => ({
    pageStep:  props.pageStep,
    startPage: props.startPage,
    user:      state.user,
});

const mapDispatchToProps = {
    updateUser: UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SensorFilesPage);