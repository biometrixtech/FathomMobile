import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const SensorOnboarding = ({
    Layout,
    user,
}) => (
    <Layout
        user={user}
    />
);

SensorOnboarding.propTypes = {
    user: PropTypes.object.isRequired,
};

SensorOnboarding.defaultProps = {};

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SensorOnboarding);
