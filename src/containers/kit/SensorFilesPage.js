/**
 * Sensor Files Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';
const SensorFilesPage = ({
    Layout,
    pageStep,
    user,
}) => (
    <Layout
        pageStep={pageStep}
        user={user}
    />
);

SensorFilesPage.propTypes = {
    pageStep: PropTypes.string.isRequired,
    user:     PropTypes.shape({}).isRequired,
};

SensorFilesPage.defaultProps = {
    user: {},
};

const mapStateToProps = (state, props) => ({
    pageStep: props.pageStep,
    user:     state.user || {},
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SensorFilesPage);