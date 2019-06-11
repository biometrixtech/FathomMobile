/**
 * Sensor Files Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';
const SensorFiles = ({
    Layout,
    user,
}) => (
    <Layout
        user={user}
    />
);

SensorFiles.propTypes = {
    user: PropTypes.shape({}).isRequired,
};

SensorFiles.defaultProps = {
    user: {},
};

const mapStateToProps = state => ({
    user: state.user || {},
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SensorFiles);